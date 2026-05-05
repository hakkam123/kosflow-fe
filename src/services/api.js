
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { dummyAuthData, dummyRooms, dummyTenants, dummyBillings, dummyReminders, dummyAccessLogs, dummyFaceNotifications } from '../utils/dummyData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;
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
    async (error) => {
        // Mock data interceptor for network errors
        if (USE_MOCK_DATA && error.code) {
            const config = error.config;
            if (!config) return Promise.reject(error);

            const url = config.url || '';
            const method = config.method || '';

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            try {
                // Mock login
                if (url.includes('/auth/login') && method === 'post') {
                    const data = error.config.data ? JSON.parse(error.config.data) : {};
                    if (data.email === 'admin@kosflow.com' && data.password === 'admin123') {
                        return Promise.resolve({ data: dummyAuthData, status: 200, statusText: 'OK', config });
                    }
                    return Promise.reject(new Error('Email atau password salah'));
                }

                // Mock kamar
                if (url.includes('/kamar') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyRooms }, status: 200, statusText: 'OK', config });
                }

                // Mock penghuni  
                if (url.includes('/penghuni') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyTenants }, status: 200, statusText: 'OK', config });
                }

                // Mock tagihan
                if (url.includes('/tagihan') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyBillings }, status: 200, statusText: 'OK', config });
                }

                // Mock reminder
                if (url.includes('/reminder') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyReminders }, status: 200, statusText: 'OK', config });
                }

                // Mock face logs
                if (url.includes('/face/logs') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyAccessLogs }, status: 200, statusText: 'OK', config });
                }

                // Mock face notifications
                if (url.includes('/face/notifications') && method === 'get') {
                    return Promise.resolve({ data: { success: true, data: dummyFaceNotifications }, status: 200, statusText: 'OK', config });
                }
            } catch (err) {
                console.error('Mock interceptor error:', err);
            }
        }

        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and redirect
            localStorage.removeItem('kosflow-auth');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
