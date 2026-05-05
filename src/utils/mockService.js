/**
 * Mock Service for Testing
 * Simulates API responses with dummy data
 * Use this for functional testing of reminder feature and other features
 */

import {
  dummyAuthData,
  dummyRooms,
  dummyTenants,
  dummyBillings,
  dummyReminders,
  dummyAccessLogs,
  dummyFaceNotifications,
} from './dummyData';

// Helper untuk simulate delay API
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// =====================================================================
// MOCK AUTH SERVICE
// =====================================================================
export const mockAuthService = {
  login: async (credentials) => {
    await delay();
    if (credentials.email === 'admin@kosflow.com' && credentials.password === 'admin123') {
      return {
        success: true,
        user: dummyAuthData.user,
        token: dummyAuthData.token,
      };
    }
    throw new Error('Email atau password salah');
  },

  getProfile: async () => {
    await delay();
    return {
      success: true,
      user: dummyAuthData.user,
    };
  },

  register: async (data) => {
    await delay();
    return {
      success: true,
      message: 'Registrasi berhasil',
    };
  },
};

// =====================================================================
// MOCK ROOM SERVICE
// =====================================================================
export const mockRoomService = {
  getAll: async () => {
    await delay();
    return {
      success: true,
      data: dummyRooms,
    };
  },

  getById: async (id) => {
    await delay();
    const room = dummyRooms.find(r => r.id === id);
    if (!room) throw new Error('Kamar tidak ditemukan');
    return { success: true, data: room };
  },

  create: async (roomData) => {
    await delay();
    const newRoom = {
      id: dummyRooms.length + 1,
      ...roomData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyRooms.push(newRoom);
    return { success: true, data: newRoom };
  },

  update: async (id, roomData) => {
    await delay();
    const index = dummyRooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Kamar tidak ditemukan');
    dummyRooms[index] = {
      ...dummyRooms[index],
      ...roomData,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyRooms[index] };
  },

  delete: async (id) => {
    await delay();
    const index = dummyRooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Kamar tidak ditemukan');
    dummyRooms.splice(index, 1);
    return { success: true };
  },
};

// =====================================================================
// MOCK TENANT SERVICE
// =====================================================================
export const mockTenantService = {
  getAll: async () => {
    await delay();
    return {
      success: true,
      data: dummyTenants,
    };
  },

  getById: async (id) => {
    await delay();
    const tenant = dummyTenants.find(t => t.id === id);
    if (!tenant) throw new Error('Penghuni tidak ditemukan');
    return { success: true, data: tenant };
  },

  create: async (tenantData) => {
    await delay();
    const newTenant = {
      id: dummyTenants.length + 1,
      ...tenantData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyTenants.push(newTenant);
    return { success: true, data: newTenant };
  },

  update: async (id, tenantData) => {
    await delay();
    const index = dummyTenants.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Penghuni tidak ditemukan');
    dummyTenants[index] = {
      ...dummyTenants[index],
      ...tenantData,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyTenants[index] };
  },

  delete: async (id) => {
    await delay();
    const index = dummyTenants.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Penghuni tidak ditemukan');
    dummyTenants.splice(index, 1);
    return { success: true };
  },
};

// =====================================================================
// MOCK BILLING SERVICE
// =====================================================================
export const mockBillingService = {
  getAll: async () => {
    await delay();
    return {
      success: true,
      data: dummyBillings,
    };
  },

  getById: async (id) => {
    await delay();
    const billing = dummyBillings.find(b => b.id === id);
    if (!billing) throw new Error('Tagihan tidak ditemukan');
    return { success: true, data: billing };
  },

  getByTenantId: async (tenantId) => {
    await delay();
    const tenantBillings = dummyBillings.filter(b => b.penghuni_id === tenantId);
    return { success: true, data: tenantBillings };
  },

  create: async (billingData) => {
    await delay();
    const newBilling = {
      id: dummyBillings.length + 1,
      ...billingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyBillings.push(newBilling);
    return { success: true, data: newBilling };
  },

  update: async (id, billingData) => {
    await delay();
    const index = dummyBillings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Tagihan tidak ditemukan');
    dummyBillings[index] = {
      ...dummyBillings[index],
      ...billingData,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyBillings[index] };
  },

  delete: async (id) => {
    await delay();
    const index = dummyBillings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Tagihan tidak ditemukan');
    dummyBillings.splice(index, 1);
    return { success: true };
  },

  generate: async (data) => {
    await delay();
    return { success: true, message: 'Tagihan berhasil dibuat' };
  },

  createPayment: async (billingId) => {
    await delay();
    return {
      success: true,
      data: {
        transaction_id: 'TRX-' + Math.random().toString(36).substr(2, 9),
        payment_url: 'https://app.midtrans.com/snap/v1/...',
      },
    };
  },

  checkOverdue: async () => {
    await delay();
    const overdues = dummyBillings.filter(b => b.status_pembayaran === 'Overdue');
    return { success: true, data: overdues };
  },
};

// =====================================================================
// MOCK REMINDER SERVICE
// =====================================================================
export const mockReminderService = {
  getAll: async () => {
    await delay();
    return {
      success: true,
      data: dummyReminders,
    };
  },

  getById: async (id) => {
    await delay();
    const reminder = dummyReminders.find(r => r.id === id);
    if (!reminder) throw new Error('Reminder tidak ditemukan');
    return { success: true, data: reminder };
  },

  getByTenantId: async (tenantId) => {
    await delay();
    const tenantReminders = dummyReminders.filter(r => r.penghuni_id === tenantId);
    return { success: true, data: tenantReminders };
  },

  create: async (reminderData) => {
    await delay();
    const newReminder = {
      id: dummyReminders.length + 1,
      ...reminderData,
      sudah_ditampilkan: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyReminders.push(newReminder);
    return { success: true, data: newReminder };
  },

  update: async (id, reminderData) => {
    await delay();
    const index = dummyReminders.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reminder tidak ditemukan');
    dummyReminders[index] = {
      ...dummyReminders[index],
      ...reminderData,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyReminders[index] };
  },

  delete: async (id) => {
    await delay();
    const index = dummyReminders.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reminder tidak ditemukan');
    dummyReminders.splice(index, 1);
    return { success: true };
  },

  markAsShown: async (id) => {
    await delay();
    const index = dummyReminders.findIndex(r => r.id === id);
    if (index !== -1) {
      dummyReminders[index].sudah_ditampilkan = true;
      dummyReminders[index].updated_at = new Date().toISOString();
    }
    return { success: true };
  },
};

// =====================================================================
// MOCK FACE SERVICE
// =====================================================================
export const mockFaceService = {
  getLogs: async (params = {}) => {
    await delay();
    let logs = [...dummyAccessLogs];

    if (params.tenantId) {
      logs = logs.filter(l => l.penghuni_id === params.tenantId);
    }

    if (params.status) {
      logs = logs.filter(l => l.status === params.status);
    }

    return { success: true, data: logs };
  },

  getNotifications: async () => {
    await delay();
    return { success: true, data: dummyFaceNotifications };
  },

  markRead: async (id) => {
    await delay();
    const notification = dummyFaceNotifications.find(n => n.id === id);
    if (notification) {
      notification.sudah_dibaca = true;
      notification.updated_at = new Date().toISOString();
    }
    return { success: true };
  },

  markAllRead: async () => {
    await delay();
    dummyFaceNotifications.forEach(n => {
      n.sudah_dibaca = true;
      n.updated_at = new Date().toISOString();
    });
    return { success: true };
  },

  getUnreadCount: async () => {
    await delay();
    const count = dummyFaceNotifications.filter(n => !n.sudah_dibaca).length;
    return { success: true, count };
  },

  getStats: async () => {
    await delay();
    return {
      success: true,
      data: {
        totalAccess: dummyAccessLogs.length,
        todayAccess: dummyAccessLogs.filter(
          l => new Date(l.waktu_akses).toDateString() === new Date().toDateString()
        ).length,
        unreadNotifications: dummyFaceNotifications.filter(n => !n.sudah_dibaca).length,
      },
    };
  },
};

// =====================================================================
// EXPORT ALL MOCK SERVICES
// =====================================================================
export default {
  mockAuthService,
  mockRoomService,
  mockTenantService,
  mockBillingService,
  mockReminderService,
  mockFaceService,
};
