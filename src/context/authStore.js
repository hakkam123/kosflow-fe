import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user for development
const mockUser = {
    id: 1,
    username: 'admin',
    email: 'admin@kosflow.com',
    nama_lengkap: 'Admin',
    role: 'admin',
};

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (credentials.email === 'admin' && credentials.password === 'admin') {
                        set({
                            user: mockUser,
                            token: 'mock-jwt-token',
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true };
                    } else {
                        throw new Error('Username atau password salah');
                    }
                } catch (error) {
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, error: error.message };
                }
            },

            // Register action
            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Mock register - always succeeds for dev
                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, error: error.message };
                }
            },

            // Verify email action
            verifyEmail: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Mock verify - accept any 6-digit code for dev
                    if (data.code && data.code.length === 6) {
                        set({ isLoading: false });
                        return { success: true };
                    } else {
                        throw new Error('Kode verifikasi tidak valid');
                    }
                } catch (error) {
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, error: error.message };
                }
            },

            // Resend verification code
            resendCode: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    await new Promise(resolve => setTimeout(resolve, 500));

                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, error: error.message };
                }
            },

            // Logout action
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Clear error
            clearError: () => set({ error: null }),
        }),
        {
            name: 'kosflow-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
