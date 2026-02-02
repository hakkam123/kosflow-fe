import { create } from 'zustand';
import { ROOM_STATUS } from '../config/constants';

// Mock data for development
const mockRooms = [
    { id: 1, nomor_kamar: 'Kamar 01', tipe_kamar: 'Standard', harga_per_bulan: 800000, status_kamar: ROOM_STATUS.OCCUPIED },
    { id: 2, nomor_kamar: 'Kamar 02', tipe_kamar: 'Standard', harga_per_bulan: 800000, status_kamar: ROOM_STATUS.AVAILABLE },
    { id: 3, nomor_kamar: 'Kamar 03', tipe_kamar: 'Deluxe', harga_per_bulan: 1200000, status_kamar: ROOM_STATUS.AVAILABLE },
    { id: 4, nomor_kamar: 'Kamar 04', tipe_kamar: 'Deluxe', harga_per_bulan: 1200000, status_kamar: ROOM_STATUS.AVAILABLE },
    { id: 5, nomor_kamar: 'Kamar 05', tipe_kamar: 'VIP', harga_per_bulan: 1500000, status_kamar: ROOM_STATUS.AVAILABLE },
];

export const useRoomStore = create((set, get) => ({
    rooms: mockRooms,
    isLoading: false,
    error: null,

    // Fetch all rooms
    fetchRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // const response = await roomService.getAll();
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ rooms: mockRooms, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Add new room
    addRoom: async (roomData) => {
        set({ isLoading: true, error: null });
        try {
            const newRoom = {
                ...roomData,
                id: Date.now(),
                status_kamar: ROOM_STATUS.AVAILABLE,
            };
            set((state) => ({
                rooms: [...state.rooms, newRoom],
                isLoading: false,
            }));
            return { success: true, data: newRoom };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Update room
    updateRoom: async (id, roomData) => {
        set({ isLoading: true, error: null });
        try {
            set((state) => ({
                rooms: state.rooms.map((room) =>
                    room.id === id ? { ...room, ...roomData } : room
                ),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Delete room
    deleteRoom: async (id) => {
        set({ isLoading: true, error: null });
        try {
            set((state) => ({
                rooms: state.rooms.filter((room) => room.id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Update room status (called when tenant is linked/unlinked)
    updateRoomStatus: (roomId, status) => {
        set((state) => ({
            rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, status_kamar: status } : room
            ),
        }));
    },

    // Computed values
    getTotalRooms: () => get().rooms.length,
    getAvailableRooms: () => get().rooms.filter((r) => r.status_kamar === ROOM_STATUS.AVAILABLE),
    getOccupiedRooms: () => get().rooms.filter((r) => r.status_kamar === ROOM_STATUS.OCCUPIED),
}));
