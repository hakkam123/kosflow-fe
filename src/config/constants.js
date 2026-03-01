// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// App Configuration
export const APP_NAME = 'KosFlow';
export const APP_TAGLINE = 'Sistem Manajemen Kos Modern';

// Status Constants
export const ROOM_STATUS = {
    AVAILABLE: 'Kosong',
    OCCUPIED: 'Terisi',
};

export const BILLING_STATUS = {
    UNPAID: 'Belum Bayar',
    PAID: 'Lunas',
    OVERDUE: 'Terlambat',
};

export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Tunai' },
    { value: 'transfer', label: 'Transfer Bank' },
    { value: 'ewallet', label: 'E-Wallet' },
];

// Navigation Menu
export const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/kamar', label: 'Kamar', icon: 'DoorOpen' },
    { path: '/penghuni', label: 'Penghuni', icon: 'Users' },
    { path: '/tagihan', label: 'Tagihan', icon: 'Receipt' },
    { path: '/reminder', label: 'Reminder', icon: 'Bell' },
    { path: '/pengaturan', label: 'Pengaturan', icon: 'Settings' },
];
