import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Home, FileText, BarChart, Sun, Moon } from 'lucide-react'; // Using Lucide icons

const Sidebar = ({ theme, toggleTheme }) => {
  // Get the logout function directly from our global context
  const { logout } = useAuth(); 

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense System</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {/* Navigation links */}
        <NavLink to="/dashboard" className="flex items-center space-x-3 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Home className="h-6 w-6" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/expenses" className="flex items-center space-x-3 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <FileText className="h-6 w-6" />
          <span>Expenses</span>
        </NavLink>
        <NavLink to="/reports" className="flex items-center space-x-3 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <BarChart className="h-6 w-6" />
          <span>Reports</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t dark:border-gray-700 space-y-2">
        {/* The onClick now correctly calls the toggleTheme function */}
        <button onClick={toggleTheme} className="w-full flex items-center space-x-3 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {/* The onClick now correctly calls the logout function */}
        <button onClick={logout} className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;