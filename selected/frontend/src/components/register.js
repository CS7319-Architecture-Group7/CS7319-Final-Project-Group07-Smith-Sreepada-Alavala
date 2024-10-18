import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const location = useLocation();
  const emailId = location.state?.emailId || '';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/register', {
        firstName,
        lastName,
        emailId
      });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email ID:</label>
          <input
            type="email"
            value={emailId}
            disabled
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;