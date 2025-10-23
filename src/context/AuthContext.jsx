import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') { document.documentElement.classList.add('dark'); } 
    else { document.documentElement.classList.remove('dark'); }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.group('[AuthContext] Token Decoded');
        console.log('Full Decoded Token:', decodedToken);
        console.log('Username (sub):', decodedToken.sub);
        console.log('Raw Roles field:', decodedToken.roles);
        console.log('Raw Authorities field:', decodedToken.authorities);
        console.log('UserId:', decodedToken.userId);
        console.log('Expiry:', new Date(decodedToken.exp * 1000));
        
        // Parse roles properly - backend sends comma-separated string
        let userRoles = [];
        if (decodedToken.roles) {
          if (typeof decodedToken.roles === 'string') {
            userRoles = decodedToken.roles.split(',').map(role => role.trim());
          } else if (Array.isArray(decodedToken.roles)) {
            userRoles = decodedToken.roles;
          }
        } else if (decodedToken.authorities) {
          if (typeof decodedToken.authorities === 'string') {
            userRoles = decodedToken.authorities.split(',').map(role => role.trim());
          } else if (Array.isArray(decodedToken.authorities)) {
            userRoles = decodedToken.authorities;
          }
        }
        
        console.log('Parsed user roles:', userRoles);
        console.groupEnd();
        
        setUser({ 
          username: decodedToken.sub,
          role: userRoles,
          roles: userRoles, // Add both for compatibility
          id: decodedToken.id || decodedToken.userId,
          exp: decodedToken.exp
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout(); // Use the logout function to handle bad tokens
      }
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const newToken = response.data.jwt;
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // This 'value' object makes all these functions available to child components
  const value = { user, token, theme, toggleTheme, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};