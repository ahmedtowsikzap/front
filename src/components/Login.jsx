import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      const { message, role } = response.data;

      alert(message);

      if (role === 'CEO' || role === 'Manager') {
        navigate('/admin'); // CEO and Manager navigate to admin dashboard
      } else if (role === 'User') {
        navigate('/user'); // Regular users navigate to user dashboard
      } else {
        alert('Unknown role. Please contact support.');
      }
      
    } catch (err) {
      // Check for specific error response or default to generic error message
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;