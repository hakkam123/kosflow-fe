import api from './api';

const tenantService = {
    // Get all tenants
    getAll: async () => {
        const response = await api.get('/penghuni');
        return response.data;
    },

    // Get single tenant by ID
    getById: async (id) => {
        const response = await api.get(`/penghuni/${id}`);
        return response.data;
    },

    // Create new tenant
    create: async (tenantData) => {
        const response = await api.post('/penghuni', tenantData);
        return response.data;
    },

    // Update tenant
    update: async (id, tenantData) => {
        const response = await api.put(`/penghuni/${id}`, tenantData);
        return response.data;
    },

    // Delete tenant
    delete: async (id) => {
        const response = await api.delete(`/penghuni/${id}`);
        return response.data;
    },

    // Get tenant by room ID
    getByRoomId: async (roomId) => {
        const response = await api.get(`/penghuni/room/${roomId}`);
        return response.data;
    },
};

export default tenantService;
