import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user for development
const mockUser = {
    id: 1,
    username: 'admin@kosflow.com',
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
                    // const response = await authService.login(credentials);

                    // Mock login for development
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (credentials.email === 'admin@kosflow.com') {
                        set({
                            user: mockUser,
                            token: 'mock-jwt-token',
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true };
                    } else {
                        throw new Error('Email tidak ditemukan');
                    }
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
