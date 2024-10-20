import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status === 404) {
        navigate('/register', { state: { emailId: email } });
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
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
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;