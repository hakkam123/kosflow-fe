import { create } from 'zustand';
import reminderService from '../services/reminderService';
import { dummyReminders } from '../utils/dummyData';

// Flag untuk menggunakan mock data (set ke true untuk testing)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true; // Default true untuk demo

export const useReminderStore = create((set, get) => ({
    reminders: [],
    isLoading: false,
    error: null,

    fetchReminders: async () => {
        set({ isLoading: true, error: null });
        try {
                if (USE_MOCK_DATA) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    set({ reminders: dummyReminders, isLoading: false });
                } else {
                    const response = await reminderService.getAll();
                    set({ reminders: response.data || [], isLoading: false });
                }
        } catch (error) {
                // Fallback ke dummy data jika error
                set({ reminders: dummyReminders, error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchRemindersByTenant: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await reminderService.getByTenantId(tenantId);
            return response.data || [];
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },

    createReminder: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await reminderService.create(data);
            await get().fetchReminders();
            return { success: true, data: response.data };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    updateReminder: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await reminderService.update(id, data);
            await get().fetchReminders();
            return { success: true, data: response.data };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    deleteReminder: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await reminderService.delete(id);
            set((state) => ({
                reminders: state.reminders.filter((r) => r.id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    getRemindersByTenantId: (tenantId) =>
        get().reminders.filter((r) => r.penghuni_id === tenantId),
}));
