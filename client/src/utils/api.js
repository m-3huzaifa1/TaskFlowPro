import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
})

// const apiSecure = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('token='))
//     ?.split('=')[1];

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await api.get('/api/refresh', {
          withCredentials: true
        });
        
        localStorage.setItem('accessToken', data?.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);


export default api;