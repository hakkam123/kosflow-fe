import { create } from 'zustand';
import roomService from '../services/roomService';
import { dummyRooms } from '../utils/dummyData';

// Flag untuk menggunakan mock data (set ke true untuk testing)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true; // Default true untuk demo

export const useRoomStore = create((set, get) => ({
    rooms: [],
    isLoading: false,
    error: null,

    // Fetch all rooms from backend
    fetchRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ rooms: dummyRooms, isLoading: false });
            } else {
                const response = await roomService.getAll();
                set({ rooms: response.data, isLoading: false });
            }
        } catch (error) {
            // Fallback ke dummy data jika error
            const message = error.response?.data?.message || 'Gagal memuat data kamar';
            set({ rooms: dummyRooms, error: message, isLoading: false });
        }
    },

    // Add new room
    addRoom: async (roomData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await roomService.create(roomData);
            // Re-fetch to get consistent data with tenant includes
            await get().fetchRooms();
            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menambah kamar';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Update room
    updateRoom: async (id, roomData) => {
        set({ isLoading: true, error: null });
        try {
            await roomService.update(id, roomData);
            await get().fetchRooms();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal memperbarui kamar';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Delete room
    deleteRoom: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await roomService.delete(id);
            await get().fetchRooms();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menghapus kamar';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Computed values
    getTotalRooms: () => get().rooms.length,
    getAvailableRooms: () => get().rooms.filter((r) => r.status_kamar === 'Kosong'),
    getOccupiedRooms: () => get().rooms.filter((r) => r.status_kamar === 'Terisi'),
}));
