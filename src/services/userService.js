import api from './api';
import { jwtDecode } from 'jwt-decode'; // We need a small library to decode the token

// Install it by running: npm install jwt-decode
const getCurrentUser = () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // The username is in the 'sub' (subject) field of the JWT
    return { username: decoded.sub }; 
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const userService = {
  getCurrentUser,
};

export default userService;