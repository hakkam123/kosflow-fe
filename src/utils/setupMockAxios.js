/**
 * Setup Mock Axios Interceptor for Testing
 * This intercepts API calls and returns mock data
 */

import axios from 'axios';
import {
  dummyAuthData,
  dummyRooms,
  dummyTenants,
  dummyBillings,
  dummyReminders,
  dummyAccessLogs,
  dummyFaceNotifications,
} from './dummyData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;

export const setupMockAxios = () => {
  if (!USE_MOCK) return;

  // Response interceptor to mock API calls
  axios.interceptors.response.use(
    response => response,
    async error => {
      if (!error.config) return Promise.reject(error);

      const url = error.config.url || '';
      const method = error.config.method || '';

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Login endpoint
      if (url.includes('/auth/login') && method === 'post') {
        const data = error.config.data ? JSON.parse(error.config.data) : {};
        if (data.email === 'admin@kosflow.com' && data.password === 'admin123') {
          return Promise.resolve({
            data: dummyAuthData,
            status: 200,
            statusText: 'OK',
            config: error.config,
          });
        }
        return Promise.reject(new Error('Email atau password salah'));
      }

      // Rooms endpoints
      if (url.includes('/kamar') && method === 'get') {
        return Promise.resolve({
          data: { success: true, data: dummyRooms },
          status: 200,
          statusText: 'OK',
          config: error.config,
        });
      }

      // Tenants endpoints
      if (url.includes('/penghuni') && method === 'get') {
        return Promise.resolve({
          data: { success: true, data: dummyTenants },
          status: 200,
          statusText: 'OK',
          config: error.config,
        });
      }

      // Billing endpoints
      if (url.includes('/tagihan') && method === 'get') {
        return Promise.resolve({
          data: { success: true, data: dummyBillings },
          status: 200,
          statusText: 'OK',
          config: error.config,
        });
      }

      // Reminder endpoints
      if (url.includes('/reminder')) {
        if (method === 'get') {
          return Promise.resolve({
            data: { success: true, data: dummyReminders },
            status: 200,
            statusText: 'OK',
            config: error.config,
          });
        }
      }

      // Face/Access endpoints
      if (url.includes('/face')) {
        if (url.includes('/logs') && method === 'get') {
          return Promise.resolve({
            data: { success: true, data: dummyAccessLogs },
            status: 200,
            statusText: 'OK',
            config: error.config,
          });
        }
        if (url.includes('/notifications') && method === 'get') {
          return Promise.resolve({
            data: { success: true, data: dummyFaceNotifications },
            status: 200,
            statusText: 'OK',
            config: error.config,
          });
        }
      }

      // Default: return original error
      return Promise.reject(error);
    }
  );
};

export default setupMockAxios;
