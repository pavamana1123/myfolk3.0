import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import './index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Login = () => {
  const [phoneOrUsername, setPhoneOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if phoneOrUsername and password fields are not empty
    if (!phoneOrUsername || !password) {
      return;
    }

    // Hash the password using md5
    const hashedPassword = md5(password);

    // Prepare the request body
    const requestBody = {
      password: hashedPassword,
    };

    // Determine if phoneOrUsername is a valid phone number or a username
    if (/^\d{10}$/.test(phoneOrUsername)) {
      // Input is a valid phone number
      requestBody.phone = phoneOrUsername;
    } else {
      // Input is a username
      requestBody.username = phoneOrUsername;
    }

    // Make the API call
    axios
      .post('/api', requestBody, { headers: { endpoint: '/login' } })
      .then((user) => {
        Cookies.set('save', JSON.stringify(user.data), { expires: 7 });
        window.open("/buddies","_self")
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
        if (error.response) {
          // Response received with error status
          if (error.response.status === 404) {
            // User does not exist
            toast.error('User does not exist');
            setPhoneOrUsername('');
            setPassword('');
          } else if (error.response.status === 403) {
            // Invalid password
            toast.error('Invalid password');
            setPassword('');
          }
        } else {
          // Network or server error
          toast.error('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <div className="login-container">
      <img
        className="login-logo"
        src="https://play-lh.googleusercontent.com/dtMAZtzr011BU_f-PT9gfiZJF-VJ9uAyrgTTbUir1Tgk2bpRnp7WQJ9lrYy9h36oCj4"
        alt="Logo"
      />
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Phone or Username"
          value={phoneOrUsername}
          onChange={(e) => setPhoneOrUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button" disabled={!phoneOrUsername || !password}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
