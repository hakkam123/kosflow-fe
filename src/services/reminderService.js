import api from './api';

const reminderService = {
    getAll: async () => {
        const response = await api.get('/reminder');
        return response.data;
    },

    getByTenantId: async (tenantId) => {
        const response = await api.get(`/reminder/penghuni/${tenantId}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/reminder', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/reminder/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/reminder/${id}`);
        return response.data;
    },

    testSend: async (id) => {
        const response = await api.post(`/reminder/${id}/test`);
        return response.data;
    },
};

export default reminderService;
