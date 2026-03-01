import { create } from 'zustand';
import billingService from '../services/billingService';

export const useBillingStore = create((set, get) => ({
    billings: [],
    isLoading: false,
    error: null,

    // Fetch all billings from API
    fetchBillings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await billingService.getAll();
            set({ billings: response.data || [], isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    // Generate billings for all tenants (otomatis)
    generateBillings: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await billingService.generate(data);
            // Re-fetch to get full data with associations
            await get().fetchBillings();
            return { success: true, data: response };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    // Create single billing (manual)
    createBilling: async (billingData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await billingService.create(billingData);
            await get().fetchBillings();
            return { success: true, data: response.data };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    // Update billing
    updateBilling: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await billingService.update(id, data);
            await get().fetchBillings();
            return { success: true, data: response.data };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    // Delete billing
    deleteBilling: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await billingService.delete(id);
            set((state) => ({
                billings: state.billings.filter((b) => b.id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            set({ error: msg, isLoading: false });
            return { success: false, error: msg };
        }
    },

    // Create Midtrans payment
    createPayment: async (billingId) => {
        try {
            const response = await billingService.createPayment(billingId);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Check overdue billings
    checkOverdue: async () => {
        try {
            const response = await billingService.checkOverdue();
            await get().fetchBillings();
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Computed values
    getPendingBillings: () =>
        get().billings.filter((b) => b.status_tagihan === 'Belum Bayar'),

    getPaidBillings: () =>
        get().billings.filter((b) => b.status_tagihan === 'Lunas'),

    getOverdueBillings: () =>
        get().billings.filter((b) => b.status_tagihan === 'Terlambat'),

    getTotalPendingAmount: () =>
        get()
            .billings.filter((b) => b.status_tagihan === 'Belum Bayar')
            .reduce((sum, b) => sum + b.total_tagihan, 0),

    getBillingsByTenant: (tenantId) =>
        get().billings.filter((b) => b.penghuni_id === tenantId),
}));
