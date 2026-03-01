import api from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const faceService = {
  // Upload face photo for a tenant
  uploadFace: async (tenantId, file) => {
    const formData = new FormData();
    formData.append('foto', file);
    const response = await api.post(`/face/upload/${tenantId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return response.data;
  },

  // Remove face data for a tenant
  removeFace: async (tenantId) => {
    const response = await api.delete(`/face/upload/${tenantId}`);
    return response.data;
  },

  // Recognize faces from webcam frame (base64)
  recognize: async (imageBase64) => {
    const response = await api.post('/face/recognize', { image: imageBase64 }, {
      timeout: 30000,
    });
    return response.data;
  },

  // Get access logs
  getLogs: async (params = {}) => {
    const response = await api.get('/face/log', { params });
    return response.data;
  },

  // Get face notifications
  getNotifications: async () => {
    const response = await api.get('/face/notifikasi');
    return response.data;
  },

  // Mark notification as read
  markRead: async (id) => {
    const response = await api.put(`/face/notifikasi/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllRead: async () => {
    const response = await api.put('/face/notifikasi/read-all');
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/face/notifikasi/unread-count');
    return response.data;
  },

  // Get face recognition stats
  getStats: async () => {
    const response = await api.get('/face/stats');
    return response.data;
  },

  // Get uploads URL base
  getUploadsUrl: () => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    // Remove /api suffix to get base URL
    return base.replace(/\/api$/, '') + '/uploads';
  },
};

export default faceService;
