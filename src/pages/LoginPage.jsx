import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Use the login function from our context

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(username, password);
      // The context will handle the redirect on success
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">to access your Expense System</p>
        </div>
        {error && (
          <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            <span>{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* ... Inputs are the same as before ... */}
          <div>
            <input id="username" name="username" type="text" required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <input id="password" name="password" type="password" required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;