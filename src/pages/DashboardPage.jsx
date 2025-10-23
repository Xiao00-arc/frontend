import React, { useState, useEffect } from 'react';
import userService from '../services/userService';

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // When the component mounts, get the current user's info
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div>
      <div className="mb-8">
        {/* Display the username if it exists */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Hello, {user ? user.username : 'User'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back to your expense dashboard.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... The rest of your static dashboard cards ... */}
      </div>
    </div>
  );
};

export default DashboardPage;