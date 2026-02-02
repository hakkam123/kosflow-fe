import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('kosflow-auth');
        if (authData) {
            const { state } = JSON.parse(authData);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and redirect
            localStorage.removeItem('kosflow-auth');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
