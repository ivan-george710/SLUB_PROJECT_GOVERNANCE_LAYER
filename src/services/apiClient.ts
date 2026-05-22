import axios from 'axios';

// Create an Axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
// This runs BEFORE every request is sent to the server.
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here later.
    // Example:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
// This runs AFTER a response is received from the server.
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx trigger this function
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);
