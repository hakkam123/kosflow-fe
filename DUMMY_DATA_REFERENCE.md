# 📊 KosFlow Dummy Data - Quick Reference

## Data Summary

### 👤 Auth Data
- **User:** admin_kosflow (admin@kosflow.com)
- **Role:** Admin
- **ID:** 1

### 🛏️ Rooms (6 Total)
| ID | Nomor | Tipe    | Harga      | Status  | Penghuni        |
|----|-------|---------|------------|---------|-----------------|
| 1  | 101   | Standar | 1.5M       | Terisi  | Ahmad Riyadi    |
| 2  | 102   | Standar | 1.5M       | Terisi  | Siti Nurhaliza  |
| 3  | 103   | Deluxe  | 2M         | Kosong  | -               |
| 4  | 201   | Standar | 1.5M       | Terisi  | Budi Santoso    |
| 5  | 202   | Standar | 1.5M       | Terisi  | Eka Putri       |
| 6  | 203   | Deluxe  | 2M         | Kosong  | -               |

**Stats:** 
- Total: 6 | Terisi: 4 | Kosong: 2

### 👥 Tenants (4 Total)
| ID | Nama             | Email              | Kamar | Status | Kontrak Berakhir |
|----|------------------|--------------------|-------|--------|------------------|
| 1  | Ahmad Riyadi     | ahmad.riyadi@...   | 101   | Aktif  | 2025-02-01       |
| 2  | Siti Nurhaliza   | siti.nurhaliza@... | 102   | Aktif  | 2025-01-15       |
| 3  | Budi Santoso     | budi.santoso@...   | 201   | Aktif  | 2025-03-01       |
| 4  | Eka Putri Wijaya | eka.putri@...      | 202   | Aktif  | 2025-02-15       |

**Stats:**
- Total: 4 | Semua Aktif: ✅

### 💰 Billings (6 Total)
| ID | Penghuni         | Bulan | Tahun | Jumlah | Status        | Jatuh Tempo |
|----|------------------|-------|-------|--------|---------------|-------------|
| 1  | Ahmad Riyadi     | Mei   | 2024  | 1.5M   | ✅ Terbayar   | 2024-05-05  |
| 2  | Ahmad Riyadi     | Juni  | 2024  | 1.5M   | ⏳ Belum Lunas| 2024-06-05  |
| 3  | Siti Nurhaliza   | Mei   | 2024  | 1.5M   | ✅ Terbayar   | 2024-05-05  |
| 4  | Siti Nurhaliza   | Juni  | 2024  | 1.5M   | ✅ Terbayar   | 2024-06-05  |
| 5  | Budi Santoso     | Mei   | 2024  | 1.5M   | ⚠️ OVERDUE    | 2024-05-05  |
| 6  | Eka Putri Wijaya | Juni  | 2024  | 1.5M   | ⏳ Belum Lunas| 2024-06-05  |

**Stats:**
- Total: 6 | Terbayar: 4 | Belum Lunas: 1 | Overdue: 1

### 📢 Reminders (6 Total)
| ID | Penghuni         | Kategori      | Judul                      | Status    | Tgl Pengingat |
|----|------------------|---------------|----------------------------|-----------|--------------|
| 1  | Ahmad Riyadi     | Pembayaran    | Bayar Tagihan Juni         | Aktif     | 2024-06-05   |
| 2  | Ahmad Riyadi     | Kontrak       | Perpanjang Kontrak         | Aktif     | 2025-01-01   |
| 3  | Siti Nurhaliza   | Pembayaran    | Pembayaran Tagihan Juli    | Aktif     | 2024-07-05   |
| 4  | Budi Santoso     | Pembayaran    | URGENT: Tunggakan Pembayaran| Aktif     | 2024-06-10   |
| 5  | Siti Nurhaliza   | Pemeliharaan  | Pemeliharaan Kamar         | Aktif     | 2024-06-17   |
| 6  | Eka Putri Wijaya | Pembayaran    | Pembayaran Tagihan Juni    | ✓ Selesai | 2024-06-05   |

**Stats:**
- Total: 6 | Aktif: 5 | Selesai: 1
- By Category: Pembayaran: 4 | Kontrak: 1 | Pemeliharaan: 1

**Categories:**
- 🏦 Pembayaran (Payment)
- 📋 Kontrak (Contract)
- 🔧 Pemeliharaan (Maintenance)

### 🔐 Access Logs (6 Total)
| ID | Penghuni         | Tipe  | Waktu        | Status    | Confidence |
|----|------------------|-------|--------------|-----------|------------|
| 1  | Ahmad Riyadi     | Masuk | 2024-06-15   | ✅ Berhasil| 0.98       |
| 2  | Ahmad Riyadi     | Keluar| 2024-06-15   | ✅ Berhasil| 0.96       |
| 3  | Siti Nurhaliza   | Masuk | 2024-06-15   | ✅ Berhasil| 0.97       |
| 4  | Budi Santoso     | Masuk | 2024-06-15   | ✅ Berhasil| 0.95       |
| 5  | Ahmad Riyadi     | Masuk | 2024-06-16   | ✅ Berhasil| 0.99       |
| 6  | Eka Putri Wijaya | Masuk | 2024-06-16   | ✅ Berhasil| 0.97       |

**Stats:**
- Total: 6 | Berhasil: 6 | Gagal: 0

### 🔔 Face Notifications (4 Total)
| ID | Penghuni         | Tipe                    | Pesan                                    | Dibaca |
|----|------------------|-------------------------|------------------------------------------|--------|
| 1  | Budi Santoso     | Wajah Tidak Dikenali    | Ada akses dari wajah yang tidak terdaftar| ❌     |
| 2  | Ahmad Riyadi     | Akses Berhasil          | Anda berhasil masuk pada 07:30           | ✅     |
| 3  | Siti Nurhaliza   | Multiple Detection      | Multiple wajah terdeteksi pada 07:15    | ❌     |
| 4  | Eka Putri Wijaya | Akses Berhasil          | Anda berhasil masuk pada 08:00           | ❌     |

**Stats:**
- Total: 4 | Dibaca: 1 | Belum Dibaca: 3

**Notification Types:**
- ⚠️ Wajah Tidak Dikenali
- ✅ Akses Berhasil
- 👥 Multiple Detection

### 📈 Dashboard Statistics
```
Kamar:
  Total: 6
  Terisi: 4
  Kosong: 2

Penghuni:
  Total: 4

Tagihan:
  Total: 6
  Terbayar: 4
  Belum Lunas: 1
  Overdue: 1

Reminder:
  Total: 6
  Aktif: 5
  Selesai: 1

Akses Hari Ini: 6
Akses Bulan Ini: 12

Notifikasi: 3 (belum dibaca)
```

---

## 🔗 Data Relationships

```
┌─────────────────────────────────────────────────┐
│              PENGHUNI (Tenant)                  │
├─────────────────────────────────────────────────┤
│ ├─ Ahmad Riyadi (ID: 1)                        │
│ │  ├─ Kamar 101 (Standar, 1.5M)                │
│ │  ├─ Billings: 2 (Mei: ✅, Juni: ⏳)          │
│ │  ├─ Reminders: 2 (Bayar, Perpanjang)         │
│ │  └─ Access Logs: 3 (Masuk 2x, Keluar 1x)    │
│ │                                              │
│ ├─ Siti Nurhaliza (ID: 2)                      │
│ │  ├─ Kamar 102 (Standar, 1.5M)                │
│ │  ├─ Billings: 2 (Mei: ✅, Juni: ✅)          │
│ │  ├─ Reminders: 2 (Bayar, Pemeliharaan)       │
│ │  └─ Access Logs: 2 (Masuk 2x)                │
│ │                                              │
│ ├─ Budi Santoso (ID: 3)                        │
│ │  ├─ Kamar 201 (Standar, 1.5M)                │
│ │  ├─ Billings: 1 (Mei: ⚠️ OVERDUE)            │
│ │  ├─ Reminders: 1 (URGENT: Tunggakan)         │
│ │  └─ Access Logs: 1 (Masuk)                   │
│ │                                              │
│ └─ Eka Putri Wijaya (ID: 4)                    │
│    ├─ Kamar 202 (Standar, 1.5M)                │
│    ├─ Billings: 1 (Juni: ⏳ Belum Lunas)       │
│    ├─ Reminders: 1 (Juni: ✓ Selesai)           │
│    └─ Access Logs: 1 (Masuk)                   │
└─────────────────────────────────────────────────┘
```

---

## 💡 Usage Tips

### Import Dummy Data
```javascript
import {
  dummyAuthData,
  dummyRooms,
  dummyTenants,
  dummyBillings,
  dummyReminders,
  dummyAccessLogs,
  dummyFaceNotifications,
  dummyDashboardStats
} from '@/utils/dummyData';
```

### Use Mock Service
```javascript
import {
  mockReminderService,
  mockBillingService,
  mockTenantService
} from '@/utils/mockService';

// Fetch reminders
const reminders = await mockReminderService.getAll();

// Create reminder
await mockReminderService.create({ ... });

// Update reminder
await mockReminderService.update(id, { ... });

// Delete reminder
await mockReminderService.delete(id);
```

### Quick Filters
```javascript
// Get active reminders only
const activeReminders = dummyReminders.filter(r => r.status === 'Aktif');

// Get reminders by tenant
const tenantReminders = dummyReminders.filter(r => r.penghuni_id === 1);

// Get payment reminders
const paymentReminders = dummyReminders.filter(r => r.kategori === 'Pembayaran');

// Get overdue billings
const overdueBillings = dummyBillings.filter(b => b.status_pembayaran === 'Overdue');

// Get unread notifications
const unreadNotifs = dummyFaceNotifications.filter(n => !n.sudah_dibaca);
```

---

## 🎯 Testing Scenarios by Feature

### ✅ Reminder Feature
- Display all reminders (6 data)
- Filter by status (Aktif: 5, Selesai: 1)
- Filter by category (Pembayaran: 4, Kontrak: 1, Pemeliharaan: 1)
- Create new reminder
- Update existing reminder
- Mark reminder as done
- Delete reminder

### ✅ Billing Feature
- Display all billings (6 data)
- Filter by status (Terbayar: 4, Belum Lunas: 1, Overdue: 1)
- Display overdue billings
- Create new billing
- Update payment status
- Create payment (Midtrans)

### ✅ Kamar Feature
- Display all rooms (6 data)
- Filter by status (Terisi: 4, Kosong: 2)
- Display room details with tenant
- Add new room
- Update room info
- Delete room

### ✅ Penghuni Feature
- Display all tenants (4 data)
- Display tenant details with room
- Add new tenant
- Update tenant info
- Delete tenant
- Show contract end date

### ✅ Face Recognition
- Display access logs (6 data)
- Display face notifications (4 data)
- Mark notification as read
- Filter logs by tenant/status

---

## 📅 Date Reference
- **Current Testing Date:** 2024-06-16
- **Recent Activity:** 2024-06-15 to 2024-06-16
- **Contract Dates:** 2025-01-15 to 2025-03-01
- **Overdue Since:** 2024-06-05 (Budi Santoso - Mei invoice)

---

**Last Updated:** June 2024
**Data Version:** 1.0
