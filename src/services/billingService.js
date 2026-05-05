import api from './api';

const billingService = {
    // Get all billings
    getAll: async () => {
        const response = await api.get('/tagihan');
        return response.data;
    },

    // Get single billing by ID
    getById: async (id) => {
        const response = await api.get(`/tagihan/${id}`);
        return response.data;
    },

    // Create new billing (manual)
    create: async (billingData) => {
        const response = await api.post('/tagihan', billingData);
        return response.data;
    },

    // Generate billings for all active tenants
    generate: async (data) => {
        const response = await api.post('/tagihan/generate', data);
        return response.data;
    },

    // Update billing
    update: async (id, billingData) => {
        const response = await api.put(`/tagihan/${id}`, billingData);
        return response.data;
    },

    // Delete billing
    delete: async (id) => {
        const response = await api.delete(`/tagihan/${id}`);
        return response.data;
    },

    // Get billings by tenant
    getByTenantId: async (tenantId) => {
        const response = await api.get(`/tagihan/penghuni/${tenantId}`);
        return response.data;
    },

    // Create Midtrans payment link
    // options: { source: 'admin' | 'tenant' }
    createPayment: async (billingId, options = {}) => {
        const response = await api.post(`/tagihan/${billingId}/pay`, {
            source: options.source || 'admin',
        });
        return response.data;
    },

    // Check & mark overdue billings
    checkOverdue: async () => {
        const response = await api.post('/tagihan/check-overdue');
        return response.data;
    },

    // Check payment status for a billing
    checkPaymentStatus: async (billingId) => {
        const response = await api.get(`/tagihan/${billingId}`);
        return response.data;
    },
};

export default billingService;
