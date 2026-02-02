import { create } from 'zustand';
import { ROOM_STATUS } from '../config/constants';
import { useRoomStore } from './roomStore';

// Mock data for development
const mockTenants = [
    {
        id: 1,
        nama_penghuni: 'Muhammad Bilal Abdurrohman',
        nomor_kontak: '081234567890',
        tanggal_masuk: '2026-01-15',
        kamar_id: 1,
    },
];

export const useTenantStore = create((set, get) => ({
    tenants: mockTenants,
    isLoading: false,
    error: null,

    // Fetch all tenants
    fetchTenants: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ tenants: mockTenants, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Add new tenant and update room status
    addTenant: async (tenantData) => {
        set({ isLoading: true, error: null });
        try {
            const newTenant = {
                ...tenantData,
                id: Date.now(),
            };

            set((state) => ({
                tenants: [...state.tenants, newTenant],
                isLoading: false,
            }));

            // Auto-update room status to "Terisi"
            if (tenantData.kamar_id) {
                useRoomStore.getState().updateRoomStatus(tenantData.kamar_id, ROOM_STATUS.OCCUPIED);
            }

            return { success: true, data: newTenant };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Update tenant
    updateTenant: async (id, tenantData) => {
        set({ isLoading: true, error: null });
        try {
            const oldTenant = get().tenants.find((t) => t.id === id);

            set((state) => ({
                tenants: state.tenants.map((tenant) =>
                    tenant.id === id ? { ...tenant, ...tenantData } : tenant
                ),
                isLoading: false,
            }));

            // Handle room status changes if room assignment changed
            if (oldTenant && oldTenant.kamar_id !== tenantData.kamar_id) {
                // Set old room to available
                if (oldTenant.kamar_id) {
                    useRoomStore.getState().updateRoomStatus(oldTenant.kamar_id, ROOM_STATUS.AVAILABLE);
                }
                // Set new room to occupied
                if (tenantData.kamar_id) {
                    useRoomStore.getState().updateRoomStatus(tenantData.kamar_id, ROOM_STATUS.OCCUPIED);
                }
            }

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Delete tenant and free up room
    deleteTenant: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const tenant = get().tenants.find((t) => t.id === id);

            set((state) => ({
                tenants: state.tenants.filter((t) => t.id !== id),
                isLoading: false,
            }));

            // Set room status back to available
            if (tenant?.kamar_id) {
                useRoomStore.getState().updateRoomStatus(tenant.kamar_id, ROOM_STATUS.AVAILABLE);
            }

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Get tenant by room ID
    getTenantByRoomId: (roomId) => {
        return get().tenants.find((t) => t.kamar_id === roomId);
    },

    // Computed values
    getTotalTenants: () => get().tenants.length,
}));
