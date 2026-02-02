/**
 * Format a date to Indonesian locale
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '-';

    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    };

    return new Date(date).toLocaleDateString('id-ID', defaultOptions);
};

/**
 * Format a date to short format (e.g., "02 Feb 2026")
 * @param {string|Date} date - The date to format
 * @returns {string} Short formatted date
 */
export const formatDateShort = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Get the current month name in Indonesian
 * @returns {string} Month name (e.g., "Februari")
 */
export const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('id-ID', { month: 'long' });
};

/**
 * Get month-year string for billing (e.g., "2026-02")
 * @param {Date} date - Optional date, defaults to current date
 * @returns {string} Month-year string
 */
export const getBillingMonth = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};
