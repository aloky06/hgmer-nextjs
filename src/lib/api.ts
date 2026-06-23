import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hgmer-git-master-hindsols-projects.vercel.app/api', // Vercel Cloud Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      console.log("Interceptor attaching token:", token ? "YES" : "NO");
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
