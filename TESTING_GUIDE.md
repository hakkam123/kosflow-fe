# KosFlow - Testing Guide dengan Dummy Data

Dokumen ini menjelaskan cara menggunakan dummy data untuk testing fitur reminder dan fitur-fitur lainnya di dashboard KosFlow.

## 📋 Struktur Dummy Data

Dummy data mencakup:
1. **Auth** - User admin untuk login
2. **Rooms (Kamar)** - 6 kamar dengan berbagai status
3. **Tenants (Penghuni)** - 4 penghuni aktif
4. **Billing (Tagihan)** - 6 tagihan dengan berbagai status
5. **Reminders (Pengingat)** - 6 reminder dengan berbagai kategori
6. **Access Logs** - Log akses face recognition
7. **Face Notifications** - Notifikasi dari sistem face recognition
8. **Dashboard Stats** - Statistik untuk dashboard

## 🚀 Cara Menggunakan

### Option 1: Menggunakan Mock Service (RECOMMENDED)

#### A. Setup Mock Interceptor

Buat file baru `src/utils/setupMockInterceptor.js`:

```javascript
import axios from 'axios';
import {
  mockAuthService,
  mockRoomService,
  mockTenantService,
  mockBillingService,
  mockReminderService,
  mockFaceService,
} from './mockService';

export const setupMockInterceptor = () => {
  // Mock auth endpoints
  axios.interceptors.response.use(
    response => response,
    error => {
      // Jika error, return mock data
      const config = error.config;

      // Login
      if (config.url.includes('/auth/login') && config.method === 'post') {
        return Promise.resolve({
          data: {
            success: true,
            user: { id: 1, email: 'admin@kosflow.com' },
            token: 'mock-token-123',
          },
        });
      }

      // Rooms
      if (config.url.includes('/kamar') && config.method === 'get') {
        return mockRoomService.getAll();
      }

      // Tenants
      if (config.url.includes('/penghuni') && config.method === 'get') {
        return mockTenantService.getAll();
      }

      // Billings
      if (config.url.includes('/tagihan') && config.method === 'get') {
        return mockBillingService.getAll();
      }

      // Reminders
      if (config.url.includes('/reminder') && config.method === 'get') {
        return mockReminderService.getAll();
      }

      // Face
      if (config.url.includes('/face')) {
        if (config.url.includes('/logs')) {
          return mockFaceService.getLogs();
        }
        if (config.url.includes('/notifications')) {
          return mockFaceService.getNotifications();
        }
      }

      return Promise.reject(error);
    }
  );
};
```

#### B. Aktifkan Mock di main.jsx

```javascript
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { setupMockInterceptor } from './utils/setupMockInterceptor'

// Uncomment untuk enable mock data
// setupMockInterceptor()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### C. Gunakan dalam Store

Contoh di `src/context/reminderStore.js`:

```javascript
import { create } from 'zustand';
import { mockReminderService } from '../utils/mockService'; // Import mock

const USE_MOCK = true; // Set ke true untuk testing

export const useReminderStore = create((set, get) => ({
  // ... store definition ...
  
  fetchReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Gunakan mock service jika USE_MOCK = true
      const service = USE_MOCK ? mockReminderService : reminderService;
      const response = await service.getAll();
      set({ reminders: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  // ... rest of store
}));
```

### Option 2: Langsung Import Dummy Data

```javascript
import { dummyReminders, dummyTenants, dummyBillings } from '@/utils/dummyData';

// Gunakan langsung dalam component
function ReminderTest() {
  const reminders = dummyReminders;
  return (
    <div>
      {reminders.map(reminder => (
        <div key={reminder.id}>{reminder.judul}</div>
      ))}
    </div>
  );
}
```

## 🧪 Skenario Testing untuk Reminder

### Skenario 1: Display Reminder List
- ✅ Tampilkan semua reminder dari dummy data
- ✅ Filter reminder by status (Aktif, Selesai)
- ✅ Filter reminder by category (Pembayaran, Kontrak, Pemeliharaan)

**Test Data:**
```javascript
const testReminders = [
  // Reminder aktif - pembayaran
  { id: 1, status: 'Aktif', kategori: 'Pembayaran', judul: 'Bayar Tagihan Juni' },
  // Reminder aktif - kontrak
  { id: 2, status: 'Aktif', kategori: 'Kontrak', judul: 'Perpanjang Kontrak' },
  // Reminder selesai
  { id: 6, status: 'Selesai', kategori: 'Pembayaran' }
];
```

### Skenario 2: Create New Reminder
- ✅ Buat reminder baru untuk penghuni tertentu
- ✅ Set kategori reminder
- ✅ Set tanggal pengingat
- ✅ Verify reminder ditambah ke list

**Test Data:**
```javascript
const newReminder = {
  penghuni_id: 1,
  judul: 'Cek Kamar',
  deskripsi: 'Cek kondisi kamar bulan ini',
  tanggal_pengingat: '2024-07-01T00:00:00Z',
  kategori: 'Inspeksi',
  status: 'Aktif'
};
```

### Skenario 3: Edit Reminder
- ✅ Edit judul reminder
- ✅ Edit deskripsi
- ✅ Edit tanggal
- ✅ Verify perubahan disimpan

### Skenario 4: Mark as Done
- ✅ Ubah status reminder dari 'Aktif' menjadi 'Selesai'
- ✅ Update `sudah_ditampilkan` menjadi true
- ✅ Verify reminder disappear dari active list

### Skenario 5: Delete Reminder
- ✅ Hapus reminder dari list
- ✅ Verify reminder hilang dari data
- ✅ Verify tidak ada error

### Skenario 6: Bulk Actions
- ✅ Mark multiple reminders sebagai done
- ✅ Delete multiple reminders
- ✅ Filter dan delete berdasarkan kategori

## 📊 Skenario Testing Fitur Lain

### Kamar (Rooms)
- ✅ Display 6 kamar (4 terisi, 2 kosong)
- ✅ Filter kamar by status
- ✅ Add kamar baru
- ✅ Update status kamar
- ✅ Delete kamar

**Test Data Count:**
- Total: 6 kamar
- Terisi: 4 (ID: 1, 2, 4, 5)
- Kosong: 2 (ID: 3, 6)

### Penghuni (Tenants)
- ✅ Display 4 penghuni aktif
- ✅ Show kamar yang ditempati
- ✅ Add penghuni baru
- ✅ Update data penghuni
- ✅ Delete penghuni

### Tagihan (Billing)
- ✅ Display 6 tagihan dengan berbagai status:
  - Terbayar: 4
  - Belum Lunas: 1
  - Overdue: 1
- ✅ Filter by status pembayaran
- ✅ Create billing untuk penghuni
- ✅ Update payment status

### Face Recognition & Log Akses
- ✅ Display 6 access logs
- ✅ Display 4 face notifications
- ✅ Mark notification as read
- ✅ Filter logs by tenant/status

## 🔧 Tip untuk Development

### 1. Toggle Mock Data
Buat environment variable:

```javascript
// src/config/constants.js
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
```

Gunakan di `.env`:
```
VITE_USE_MOCK_DATA=true  # untuk testing
VITE_USE_MOCK_DATA=false # untuk production
```

### 2. Console Logging
Tambah logging untuk debug:

```javascript
import { dummyReminders } from '@/utils/dummyData';

console.log('📋 Available Reminders:', dummyReminders);
console.log('✅ Active Reminders:', dummyReminders.filter(r => r.status === 'Aktif'));
```

### 3. Add/Remove Test Data Dinamis

```javascript
import { mockReminderService } from '@/utils/mockService';

// Create new reminder
await mockReminderService.create({
  penghuni_id: 1,
  judul: 'Test Reminder',
  // ... other fields
});

// Delete test reminder
await mockReminderService.delete(reminderIdToDelete);
```

## 🔍 Data Relationships

```
Penghuni (Tenant)
  ├── kamar_id → Kamar (Room)
  ├── Reminders
  ├── Billings
  └── Access Logs

Tagihan (Billing)
  └── penghuni_id → Penghuni

Reminder
  └── penghuni_id → Penghuni

Face Log & Notification
  └── penghuni_id → Penghuni
```

## 📝 Checklist Testing Reminder

- [ ] Setup mock data
- [ ] Display reminder list
- [ ] Filter reminders by status
- [ ] Filter reminders by category
- [ ] Create new reminder
- [ ] Edit existing reminder
- [ ] Mark reminder as done
- [ ] Delete reminder
- [ ] Verify data persistence (Zustand store)
- [ ] Test with various tenant IDs
- [ ] Test bulk operations
- [ ] Verify UI responsiveness
- [ ] Check date formatting
- [ ] Test edge cases (empty list, long titles, etc.)

## 🚨 Common Issues & Solutions

### Issue: Data tidak update di UI
**Solution:** Ensure Zustand store is properly updating state
```javascript
// ✅ Correct
set(state => ({
  reminders: [...state.reminders, newReminder]
}));

// ❌ Wrong - mutating state directly
state.reminders.push(newReminder);
```

### Issue: Mock service terlalu cepat
**Solution:** Adjust delay di mockService.js
```javascript
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
```

### Issue: Data tidak konsisten antara store
**Solution:** Fetch related data setelah mutasi
```javascript
// Setelah add tenant, fetch rooms juga
await get().fetchTenants();
await useRoomStore.getState().fetchRooms();
```

## 📚 File References

- **Dummy Data:** `src/utils/dummyData.js`
- **Mock Services:** `src/utils/mockService.js`
- **Mock Interceptor:** `src/utils/setupMockInterceptor.js` (buat sendiri)
- **Reminder Store:** `src/context/reminderStore.js`
- **Reminder Page:** `src/pages/Reminder/Reminder.jsx`

---

**Last Updated:** 2024-06-15
**Version:** 1.0
