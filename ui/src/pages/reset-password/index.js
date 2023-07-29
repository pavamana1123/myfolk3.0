// TODO
// - change inputID feature
// - resend OTP feature


import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import md5 from 'md5';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./index.css"
import _ from "../../_"

const ResetPassword = () => {

  const otpExpirationSeconds = 300
  const [inputID, setinputID] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(otpExpirationSeconds)
  const [timerID, setTimerID] = useState()
  const [sendOTPEnabled, setSendOTPEnabled] = useState(false)
  const [verifyOTPEnabled, setVerifyOTPEnabled] = useState(false)
  const [resetPassEnabled, setResetPassEnabled] = useState(false)
  const [sendOTPWaiting, setSendOTPWaiting] = useState(false)
  const [verifyOTPWaiting, setVerifyOTPWaiting] = useState(false)
  const [otpVerified, setOTPVerified] = useState(false)
  const [resetPassWaiting, setResetPassWaiting] = useState(false)
  const [passReset, setPassReset] = useState(false)
  const [username, setUsername] = useState('')

  var respassInput = useRef()
  var otpTimestamp = useRef(null)
  var userData = useRef()

  useEffect(()=>{
    respassInput.current.focus()
  }, [])


  const isValidInputID = (input)=> {
    return input!="" && (_.phoneRegex.test(input) || _.emailRegex.test(input))
  }

  const isValidOTP = (input)=> {
    const numberRegex = /^\d{6}$/;
    return numberRegex.test(input) 
  }

  const handleInputIDChange = (e) => {
    var val = e.target.value.trim().toLowerCase().replace(/\s/g, '')
    setinputID(val)
    if(isValidInputID(val)){
      setSendOTPEnabled(true)
    }else{
      setSendOTPEnabled(false)
    }
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value.trim().replace(/\s/g, ''))
    if(isValidOTP(e.target.value)){
      setVerifyOTPEnabled(true)
    }else{
      setVerifyOTPEnabled(false)
    }
  }

  const handleSendOtp = () => {
    const endpoint = '/api'
    const requestData = {
      id: `myfolk-${inputID}`,
    }

    if (_.emailRegex.test(inputID)) {
      requestData.email = inputID
    } else if (_.phoneRegex.test(inputID)){
      requestData.phone = inputID
    } else {
      requestData.username = inputID
    }

    setSendOTPWaiting(true)
    setSendOTPEnabled(false)
    axios
      .post(endpoint, requestData, {
        headers: {
          'endpoint': '/send-otp',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        userData.current = response.data
        toast.success(`OTP is sent to your ${isNaN(inputID)?'Email ID':'WhatsApp number'}`)
        setOtpSent(true)
        startOTPTimer()
        setUsername(response.data.username)
      })
      .catch((error) => {
        toast.error(error.response.status==404?`Invalid ${requestData.email?'Email ID':'WhatsApp number'}`:'Could not send OTP. Please contact the admin.')
      })
      .finally(()=>{
        setSendOTPWaiting(false)
        respassInput.current.focus()
      })
  }

  const handleVerifyOtp = () => {
    const endpoint = '/api'
    const requestData = {
      id: `myfolk-${inputID}`,
      otp
    }

    setVerifyOTPWaiting(true)
    setVerifyOTPEnabled(false)

    axios.post(endpoint, requestData, {
        headers: {
          'endpoint': '/verify-otp',
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        setinputID('')
        setOTPVerified(true)
        clearInterval(timerID)
        setSecondsRemaining(otpExpirationSeconds)
        otpTimestamp.current=null
      })
      .catch((error) => {
        setOtp('')
        toast.error((()=>{
          switch(error.response.status){
              case 403:
                return 'Incorrect OTP! Please check and try again.'
              case 404:
                return 'OTP has expired! Refresh page and try again.'
              default:
                return 'Unable to verify OTP. Please contact the admin.'
            }
          })()
        )
      })

  }

  const handleNewPassChange = (e) => {
    setinputID(e.target.value)
    setResetPassEnabled(e.target.value.length>3)
  }

  const handleResetPass = () => {
    const endpoint = '/api'
    const requestData = { 
      password: md5(inputID),
      username 
    }

    setResetPassWaiting(true)

    axios.post(endpoint, requestData, {
        headers: {
          'endpoint': '/reset-pass',
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        setPassReset(true)
        setTimeout(()=>{
          window.open("/login", "_self")
        }, 4000)
      })
      .catch((error) => {
        setOtp('')
        setOtpSent(false)
        toast.error('Unable to reset password. Please try agin or contact the admin')

      })
  }

  const startOTPTimer = () => {
    otpTimestamp.current = moment()
    setTimerID(setInterval(() => {
      var s = otpExpirationSeconds - moment.duration(moment().diff(otpTimestamp.current)).asSeconds()
      setSecondsRemaining(s)
      if (s <= 0) {
        setinputID('')
        setOtpSent(false)
        clearInterval(timerID)
        setSecondsRemaining(otpExpirationSeconds)
        otpTimestamp.current=null
        toast.error('OTP has expired! Try again.')
      }
    }, 1000))
  }

  return (
    <div className="respass-container">
      {!passReset? <>
        <img src="/img/login/logo.png" className="respass-logo" />
        <label className='respass-label-1'>
        {otpVerified?`Enter new password (minimum 4 characters)`:(otpSent?`Enter 6-digit OTP sent to your ${isNaN(inputID)?'Email ID':'WhatsApp number'} ${inputID}`:'To reset password enter registered 10-digit WhatsApp number or Email-ID below')}
        </label>
        <input
          type="text"
          value={otpSent?(otpVerified?inputID:otp):inputID}
          onChange={otpVerified?handleNewPassChange:(otpSent?handleOtpChange:handleInputIDChange)}
          placeholder={otpVerified?'New Password':(otpSent?'Enter OTP':'')}
          className="respass-input"
          ref={respassInput}
        />

        <button
          onClick={otpVerified?handleResetPass:(otpSent?handleVerifyOtp:handleSendOtp)}
          disabled={otpVerified?(!resetPassEnabled || resetPassWaiting):(otpSent?!verifyOTPEnabled:!sendOTPEnabled)}
          className="respass-send-button"
        >
          {otpVerified?`Reset Password`:(otpSent?(verifyOTPWaiting?'Verifying...':'Verify OTP'):(sendOTPWaiting?'Sending...':'Send OTP'))}
        </button>

        {(otpSent && !otpVerified) && (
          <div className="respass-timer">
            <span>{`Your OTP expires in  ${Math.floor(secondsRemaining / 60).toString().padStart(2, '0')}:${Math.floor(secondsRemaining % 60 < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60).toString().padStart(2, '0')}`}</span>
          </div>
        )}
      </>: 
      <div className='pass-redirect'>
        {"Your password is reset successfully!\n\n Redirecting you to the login page..."}
      </div>}
    </div>
  )
}

export default ResetPassword