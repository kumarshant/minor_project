import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log all requests
api.interceptors.request.use(config => {
  console.log('API →', config.method?.toUpperCase(), config.url);
  return config;
});

export default api;