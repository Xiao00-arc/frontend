import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    setError('');

    const userData = { username, email, password, role: 'EMPLOYEE', employeeId: `EMP-${Date.now()}` };

    authService.register(userData)
      .then(() => {
        alert('Registration successful! Please sign in.');
        navigate('/login');
      })
      .catch(err => {
        console.error('Sign up failed:', err);
        setError('Registration failed. Please try again.');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">to start managing your expenses</p>
        </div>
        {/* ... Form JSX will be very similar to LoginPage ... */}
        <form className="space-y-6" onSubmit={handleSignUp}>
          {/* Username Input */}
          <div>
            <input id="username" name="username" type="text" required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          {/* Email Input */}
          <div>
            <input id="email" name="email" type="email" required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {/* Password Input */}
          <div>
            <input id="password" name="password" type="password" required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;