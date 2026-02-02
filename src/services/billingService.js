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

    // Create new billing (generate invoice)
    create: async (billingData) => {
        const response = await api.post('/tagihan', billingData);
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

    // Record payment
    recordPayment: async (paymentData) => {
        const response = await api.post('/pembayaran', paymentData);
        return response.data;
    },

    // Get all payments
    getAllPayments: async () => {
        const response = await api.get('/pembayaran');
        return response.data;
    },

    // Get payments by billing ID
    getPaymentsByBillingId: async (billingId) => {
        const response = await api.get(`/pembayaran/tagihan/${billingId}`);
        return response.data;
    },
};

export default billingService;
