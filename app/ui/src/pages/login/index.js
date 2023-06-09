import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import './index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handlePhoneChange = (e) => {
    const validatedPhone = e.target.value.replace(/\D/g, '').slice(0, 10); // Remove non-digit characters and limit to 10 digits
    setPhone(validatedPhone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if phone and password fields are not empty
    if (!phone || !password) {
      return;
    }

    // Hash the password using md5
    const hashedPassword = md5(password);

    // Prepare the request body
    const requestBody = {
      phone,
      password: hashedPassword,
    };

    // Make the API call
    axios.post('/data', requestBody, { headers: { endpoint: '/login' } })
      .then((response) => {
        // Handle the response
        console.log(response.data);
        const { participants, roles } = response.data;

        if ((participants && participants.length > 0) || (roles && roles.length > 0)) {
          // User(s) exist with the given phone number

          if (participants && participants.length > 0 && roles && roles.length > 0) {
            // Both participants and roles exist
            // Store the data of the first user from participants
            const user = participants[0];
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);
          } else {
            // Only one of participants or roles exist
            // Store the data of the first user from either participants or roles
            const user = participants.length > 0 ? participants[0] : roles[0];
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);
          }

          // Redirect to home page
          window.open('/home', '_self');
        } else {
          // User does not exist
          toast.error('User does not exist', { autoClose: 3000 });
          setPhone('');
          setPassword('');
        }

      })
      .catch((error) => {
        // Handle the error
        console.log(error);
        if (error.response) {
          // Response received with error status
          if (error.response.status === 404) {
            // User does not exist
            toast.error('User does not exist');
            setPhone('');
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
      <img className="login-logo" src="https://play-lh.googleusercontent.com/dtMAZtzr011BU_f-PT9gfiZJF-VJ9uAyrgTTbUir1Tgk2bpRnp7WQJ9lrYy9h36oCj4" alt="Logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Phone"
          value={phone}
          onChange={handlePhoneChange}
          maxLength="10"
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
        <button type="submit" className="login-button" disabled={!phone || !password}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;