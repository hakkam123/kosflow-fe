import api from './api';

const roomService = {
    // Get all rooms
    getAll: async () => {
        const response = await api.get('/kamar');
        return response.data;
    },

    // Get single room by ID
    getById: async (id) => {
        const response = await api.get(`/kamar/${id}`);
        return response.data;
    },

    // Create new room
    create: async (roomData) => {
        const response = await api.post('/kamar', roomData);
        return response.data;
    },

    // Update room
    update: async (id, roomData) => {
        const response = await api.put(`/kamar/${id}`, roomData);
        return response.data;
    },

    // Delete room
    delete: async (id) => {
        const response = await api.delete(`/kamar/${id}`);
        return response.data;
    },

    // Update room status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/kamar/${id}/status`, { status_kamar: status });
        return response.data;
    },
};

export default roomService;
