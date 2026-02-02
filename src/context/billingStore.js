import { create } from 'zustand';
import { BILLING_STATUS } from '../config/constants';
import { getBillingMonth } from '../utils/formatDate';

// Mock data for development
const mockBillings = [
    {
        id: 1,
        penghuni_id: 1,
        user_id: 1,
        bulan_tagihan: '2026-02',
        total_tagihan: 800000,
        status_tagihan: BILLING_STATUS.UNPAID,
    },
];

const mockPayments = [];

export const useBillingStore = create((set, get) => ({
    billings: mockBillings,
    payments: mockPayments,
    isLoading: false,
    error: null,

    // Fetch all billings
    fetchBillings: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ billings: mockBillings, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Generate monthly invoice for a tenant
    generateInvoice: async (tenantId, amount, userId = 1) => {
        set({ isLoading: true, error: null });
        try {
            const newBilling = {
                id: Date.now(),
                penghuni_id: tenantId,
                user_id: userId,
                bulan_tagihan: getBillingMonth(),
                total_tagihan: amount,
                status_tagihan: BILLING_STATUS.UNPAID,
            };

            set((state) => ({
                billings: [...state.billings, newBilling],
                isLoading: false,
            }));

            return { success: true, data: newBilling };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Check if billing exists for current month
    hasBillingForCurrentMonth: (tenantId) => {
        const currentMonth = getBillingMonth();
        return get().billings.some(
            (b) => b.penghuni_id === tenantId && b.bulan_tagihan === currentMonth
        );
    },

    // Record payment and update billing status
    recordPayment: async (paymentData) => {
        set({ isLoading: true, error: null });
        try {
            const newPayment = {
                id: Date.now(),
                ...paymentData,
                tanggal_bayar: new Date().toISOString(),
            };

            // Add payment
            set((state) => ({
                payments: [...state.payments, newPayment],
            }));

            // Update billing status to "Lunas"
            set((state) => ({
                billings: state.billings.map((billing) =>
                    billing.id === paymentData.tagihan_id
                        ? { ...billing, status_tagihan: BILLING_STATUS.PAID }
                        : billing
                ),
                isLoading: false,
            }));

            return { success: true, data: newPayment };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Delete billing
    deleteBilling: async (id) => {
        set({ isLoading: true, error: null });
        try {
            set((state) => ({
                billings: state.billings.filter((b) => b.id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Computed values
    getPendingBillings: () =>
        get().billings.filter((b) => b.status_tagihan === BILLING_STATUS.UNPAID),

    getPaidBillings: () =>
        get().billings.filter((b) => b.status_tagihan === BILLING_STATUS.PAID),

    getTotalPendingAmount: () =>
        get()
            .billings.filter((b) => b.status_tagihan === BILLING_STATUS.UNPAID)
            .reduce((sum, b) => sum + b.total_tagihan, 0),

    getMonthlyIncome: () =>
        get()
            .billings.filter(
                (b) =>
                    b.status_tagihan === BILLING_STATUS.PAID &&
                    b.bulan_tagihan === getBillingMonth()
            )
            .reduce((sum, b) => sum + b.total_tagihan, 0),

    getBillingsByTenant: (tenantId) =>
        get().billings.filter((b) => b.penghuni_id === tenantId),
}));
