import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const DashboardLayout = ({ children }) => {
  // Get the theme state and toggle function from our global context
  const { theme, toggleTheme } = useAuth(); 

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Pass the theme and function down to the Sidebar as props */}
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;