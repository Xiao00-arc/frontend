import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import ExpensesPage from './pages/ExpensesPage'; // <-- 1. IMPORT THE NEW PAGE
import './index.css';

// ... (Your ProtectedRoute and PublicRoute components remain the same) ...
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) { return <Navigate to="/login" />; }
    return <DashboardLayout>{children}</DashboardLayout>;
};
const PublicRoute = ({ children }) => {
    const { token } = useAuth();
    if (token) { return <Navigate to="/dashboard" />; }
    return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      {/* --- 2. THIS ROUTE IS NOW UPDATED --- */}
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} /> 

      <Route path="/reports" element={<ProtectedRoute><div>Reports Page Content</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;