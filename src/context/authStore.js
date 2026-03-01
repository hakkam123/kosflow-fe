import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action - connects to backend POST /api/auth/login
            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authService.login({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return { success: true };
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Login gagal, coba lagi.';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    return { success: false, error: message };
                }
            },

            // Register action - connects to backend POST /api/auth/register
            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.register({
                        username: data.username,
                        email: data.email,
                        password: data.password,
                    });

                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Registrasi gagal, coba lagi.';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    return { success: false, error: message };
                }
            },

            // Get user profile from backend
            fetchProfile: async () => {
                try {
                    const data = await authService.getProfile();
                    set({ user: data.user });
                    return { success: true };
                } catch (error) {
                    return { success: false };
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
