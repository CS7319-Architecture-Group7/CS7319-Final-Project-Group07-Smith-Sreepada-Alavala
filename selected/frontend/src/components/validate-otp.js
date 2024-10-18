import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenManager from '../services/tokenManagerService';

function ValidateOTP() {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/validate_otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passcode }),
    });
    const tokenResponse = await response.json();
    if (response.status !== 200 || !tokenResponse.token) {
      console.error('Validation failed:', tokenResponse);
      return;
    }
    // Save the token in local storage
    var tokenManager = TokenManager(navigate);
    tokenManager.saveToken(tokenResponse.token);
    
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <label className="block mb-2">Passcode:</label>
        <input
          type="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Validate OTP
        </button>
      </form>
    </div>
  );
}

export default ValidateOTP;