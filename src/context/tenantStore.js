import { create } from 'zustand';
import tenantService from '../services/tenantService';
import { useRoomStore } from './roomStore';
import { dummyTenants } from '../utils/dummyData';

// Flag untuk menggunakan mock data (set ke true untuk testing)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true; // Default true untuk demo

export const useTenantStore = create((set, get) => ({
    tenants: [],
    isLoading: false,
    error: null,

    // Fetch all tenants from backend
    fetchTenants: async () => {
        set({ isLoading: true, error: null });
        try {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ tenants: dummyTenants, isLoading: false });
            } else {
                const response = await tenantService.getAll();
                set({ tenants: response.data, isLoading: false });
            }
        } catch (error) {
            // Fallback ke dummy data jika error
            const message = error.response?.data?.message || 'Gagal memuat data penghuni';
            set({ tenants: dummyTenants, error: message, isLoading: false });
        }
    },

    // Add new tenant
    addTenant: async (tenantData) => {
        set({ isLoading: true, error: null });
        try {
            await tenantService.create(tenantData);
            // Re-fetch both tenants and rooms to stay in sync
            await get().fetchTenants();
            await useRoomStore.getState().fetchRooms();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menambah penghuni';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Update tenant
    updateTenant: async (id, tenantData) => {
        set({ isLoading: true, error: null });
        try {
            await tenantService.update(id, tenantData);
            await get().fetchTenants();
            await useRoomStore.getState().fetchRooms();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal memperbarui penghuni';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Delete tenant
    deleteTenant: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await tenantService.delete(id);
            await get().fetchTenants();
            await useRoomStore.getState().fetchRooms();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menghapus penghuni';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Computed values
    getTotalTenants: () => get().tenants.length,
    getTenantByRoomId: (roomId) => get().tenants.find((t) => t.kamar_id === roomId),
}));
