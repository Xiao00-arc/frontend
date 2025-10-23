import api from './api'; // Use our new api instance

const login = (username, password) => {
  return api.post('/authenticate', { username, password });
};

const register = (userData) => {
  return api.post('/users/post', userData);
};

const authService = { login, register };
export default authService;