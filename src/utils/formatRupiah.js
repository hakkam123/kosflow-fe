/**
 * Format a number to Indonesian Rupiah currency format
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "Rp 800.000")
 */
export const formatRupiah = (amount) => {
    if (amount === null || amount === undefined) return 'Rp 0';

    const number = Number(amount);
    if (isNaN(number)) return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number).replace('IDR', 'Rp');
};

/**
 * Format a number with thousand separators
 * @param {number} number - The number to format
 * @returns {string} Formatted number with dots as thousand separators
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('id-ID').format(number);
};
