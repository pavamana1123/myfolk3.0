// TODO
// - change inputID feature
// - resend OTP feature


import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import Cookies from 'js-cookie'
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
  const [sendOTPWaiting, setSendOTPWaiting] = useState(false)
  const [verifyOTPWaiting, setVerifyOTPWaiting] = useState(false)
  const [otpVerified, setOTPVerified] = useState(false)

  var respassInput = useRef()
  var otpTimestamp = useRef(null)
  var userData = useRef()

  useEffect(()=>{
    respassInput.current.focus()
  }, [])


  const isValidInputID = (input)=> {
    return input!="" && (_.phoneRegex.test(input) || _.emailRegex.test(input) || input == input.toLowerCase())
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
    } else if (_.phoneRegex.text(inputID)){
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
        userData.current = response .data
        toast.success(`OTP is sent to your ${isNaN(inputID)?'Email ID':'WhatsApp number'}`)
        setOtpSent(true)
        startOTPTimer()
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
      id: `vseva-${inputID}`,
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
        Cookies.set('save', JSON.stringify(userData.current))
        window.location.href = new URLSearchParams(window.location.search).get('redirect') || '/home'
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
      .finally(()=>{
        setOTPVerified(true)
      })
  }

  const startOTPTimer = () => {
    otpTimestamp.current = moment()
    setTimerID(setInterval(() => {
      var s = otpExpirationSeconds - moment.duration(moment().diff(otpTimestamp.current)).asSeconds()
      setSecondsRemaining(s)
      if (s <= 0) {
        clearInterval(timerID)
        setOtpSent(false)
        setinputID('')
        setSecondsRemaining(otpExpirationSeconds)
        otpTimestamp.current=null
        toast.error('OTP has expired! Try again.')
      }
    }, 1000))
  }

  return (
    <div className="respass-container">
      {otpVerified?
      <div className='respass-success'>
        ResetPassword successful! Redirecting...
      </div>
      :<>
        <img src="/img/login/logo.png" className="respass-logo" />
        <label className='respass-label-1'>
        {otpSent?`Enter 6-digit OTP sent to your ${isNaN(inputID)?'Email ID':'WhatsApp number'} ${inputID}`:'To reset password enter registered 10-digit WhatsApp number or Email-ID or username below'}
        </label>
        <input
          type="text"
          value={otpSent?otp:inputID}
          onChange={otpSent?handleOtpChange:handleInputIDChange}
          placeholder={otpSent?'Enter OTP':''}
          className="respass-input"
          ref={respassInput}
        />

        <button
          onClick={otpSent?handleVerifyOtp:handleSendOtp}
          disabled={otpSent?!verifyOTPEnabled:!sendOTPEnabled}
          className="respass-send-button"
        >
          {otpSent?(verifyOTPWaiting?'Verifying...':'Verify OTP'):(sendOTPWaiting?'Sending...':'Send OTP')}
        </button>

        {otpSent && (
          <div className="respass-timer">
            <span>{`Your OTP expires in  ${Math.floor(secondsRemaining / 60).toString().padStart(2, '0')}:${Math.floor(secondsRemaining % 60 < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60).toString().padStart(2, '0')}`}</span>
          </div>
        )}
      </>}
    </div>
  )
}

export default ResetPassword