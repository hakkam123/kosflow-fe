import { create } from 'zustand';
import faceService from '../services/faceService';

export const useFaceStore = create((set, get) => ({
  logs: [],
  notifications: [],
  stats: null,
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Fetch access logs
  fetchLogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await faceService.getLogs(params);
      set({ logs: response.data, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal memuat log akses';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await faceService.getNotifications();
      set({ notifications: response.data, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal memuat notifikasi';
      set({ error: message, isLoading: false });
    }
  },

  // Mark notification as read
  markRead: async (id) => {
    try {
      await faceService.markRead(id);
      // Update locally
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, sudah_dibaca: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Gagal' };
    }
  },

  // Mark all as read
  markAllRead: async () => {
    try {
      await faceService.markAllRead();
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, sudah_dibaca: true })),
        unreadCount: 0,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Gagal' };
    }
  },

  // Fetch unread count
  fetchUnreadCount: async () => {
    try {
      const result = await faceService.getUnreadCount();
      set({ unreadCount: result.count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await faceService.getStats();
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch face stats:', error);
    }
  },

  // Upload face photo for tenant
  uploadFace: async (tenantId, file) => {
    try {
      const result = await faceService.uploadFace(tenantId, file);
      return { success: true, data: result.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal upload foto wajah';
      return { success: false, error: message };
    }
  },

  // Remove face photo
  removeFace: async (tenantId) => {
    try {
      await faceService.removeFace(tenantId);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus data wajah';
      return { success: false, error: message };
    }
  },

  // Add notification from socket event
  addNotification: (notif) => {
    set(state => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
