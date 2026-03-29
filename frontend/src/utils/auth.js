// src/utils/auth.js

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = parseJwt(token);
  // Need to verify if the token is valid, simple check for now
  if (decoded && decoded.exp * 1000 > Date.now()) {
    return decoded;
  }
  
  // If expired
  localStorage.removeItem('token');
  return null;
};
