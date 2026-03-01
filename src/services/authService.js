import api from './api';

const authService = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise} - { message, user, token }
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     * @param {Object} data - { username, email, password }
     * @returns {Promise} - { message, user, token }
     */
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    /**
     * Get current user profile (protected)
     * @returns {Promise} - { user }
     */
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};

export default authService;
