// constants/api.ts
import axios from 'axios';

// Use your computer's local IP address
const API_URL = 'http://192.168.0.4:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = (data: { email: string; password: string }) => api.post('/login/', data);
export const registerUser = (data: { name: string; email: string; password: string }) => api.post('/register/', data);
// You can add more API functions here as needed

export default api;
