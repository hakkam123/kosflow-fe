# 💳 Panduan Alur Pembayaran (Payment Flow)

## Ringkasan Fitur

Sistem pembayaran KosFlow sekarang mempunyai endpoint dan UI yang lengkap untuk menginformasikan status pembayaran kepada penghuni (tenant) setelah mereka selesai membayar.

## 🔄 Alur Pembayaran Step-by-Step

### 1. **Admin Membuat Tagihan**
```
Admin buka halaman Tagihan
   ↓
Klik "Tambah Tagihan" (manual) atau "Generate Otomatis" (batch)
   ↓
Tagihan dibuat dengan status "Belum Bayar"
   ↓
Email notifikasi dikirim ke penghuni (jika email ada di config)
```

### 2. **Penghuni/Admin Membuka Link Pembayaran**
```
Halaman Tagihan → Klik tombol 💳 (Bayar via Midtrans)
   ↓
POST /api/tagihan/:id/pay
   ↓
Backend generate Midtrans payment link
   ↓
Link di-cache di database (untuk reuse)
   ↓
Link dibuka di tab baru
```

### 3. **Penghuni Melakukan Pembayaran**
```
Midtrans payment page dibuka
   ↓
Penghuni pilih metode pembayaran (kartu kredit, e-wallet, transfer, dll)
   ↓
Input data pembayaran
   ↓
Pembayaran diproses oleh Midtrans
```

### 4. **Status Pembayaran Ditampilkan** ⭐ (FITUR BARU)
```
User otomatis redirect ke halaman: /payment-status?id=<billingId>
   ↓
Halaman polling status pembayaran setiap 2 detik
   ↓
Jika status berubah menjadi "Lunas", tampilkan success state
   ↓
Jika timeout (2 menit), tampilkan timeout message dengan tombol refresh
```

### 5. **Backend Menerima Webhook dari Midtrans**
```
Midtrans kirim POST ke /api/tagihan/webhook/midtrans
   ↓
Backend validate payload
   ↓
Jika transaksi berhasil (settlement/capture):
   - Update status_tagihan → "Lunas"
   - Update tanggal_bayar → sekarang
   - Clear midtrans_payment_url & midtrans_expires_at
```

## 📁 File-File yang Ditambah/Dimodifikasi

### Frontend (React)

#### ✨ File Baru
- **`src/pages/PaymentStatus/PaymentStatus.jsx`**
  - Halaman untuk menampilkan status pembayaran
  - Polling logic untuk update status real-time (setiap 2 detik)
  - Max 60 polls (2 menit timeout)
  - UI yang responsive dengan 3 state: processing, success, error

#### 📝 File yang Dimodifikasi
- **`src/App.jsx`**
  - Import PaymentStatus component
  - Add route: `<Route path="/payment-status" element={<PaymentStatus />} />`

- **`src/pages/Tagihan/Tagihan.jsx`**
  - Import `useNavigate` from react-router-dom
  - Update `handlePayMidtrans()`:
    - Buka payment URL di tab baru (tetap sama)
    - Tambah redirect ke `/payment-status?id={billing.id}` setelah 1 detik
    - Toast notifikasi yang lebih user-friendly

- **`src/services/billingService.js`**
  - Tambah method `checkPaymentStatus(billingId)`:
    ```javascript
    checkPaymentStatus: async (billingId) => {
        const response = await api.get(`/tagihan/${billingId}`);
        return response.data;
    }
    ```

### Backend (Express)

#### Sudah Ada (tidak perlu modifikasi)
- **`src/controllers/billingController.js`**
  - Endpoint `GET /api/tagihan/:id` → check billing status
  - Endpoint `POST /api/tagihan/webhook/midtrans` → handle payment callback
  
- **`src/routes/billingRoutes.js`**
  - Routes sudah terconfigurasi dengan benar

## 🎯 Frontend Implementation Details

### PaymentStatus.jsx

**Component Props/Query Params:**
- `id` (required): Billing ID dari query string `?id=123`

**States:**
- `loading`: Loading saat fetch data pertama kali
- `billing`: Billing data dari backend
- `pollingActive`: Kontrol polling loop
- `pollCount`: Jumlah polls yang sudah dilakukan

**Effects:**
1. **Initial Load**: Fetch billing status saat component mount
2. **Polling Loop**: Update status setiap 2 detik sampai:
   - Status berubah menjadi "Lunas" (success)
   - Mencapai max polls 60 (timeout 2 menit)

**UI States:**
```
┌─────────────────────────────────────────┐
│         Status Pembayaran               │
├─────────────────────────────────────────┤
│  🔵 PROCESSING (Spinner)                │
│    - Polling indicator (e.g., 15/60)    │
│    - Billing details                    │
│    - Info message                       │
│                                         │
│  ✅ SUCCESS (Green)                     │
│    - Checkmark icon                     │
│    - Success message                    │
│    - Full billing details               │
│    - Kembali button                     │
│                                         │
│  ❌ TIMEOUT/ERROR (Red)                 │
│    - Error icon                         │
│    - Error message                      │
│    - Refresh button                     │
│    - Kembali button                     │
└─────────────────────────────────────────┘
```

## 🔌 API Endpoints

### Payment Status Check
```
GET /api/tagihan/:id

Params:
- id (number): Billing ID

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "status_tagihan": "Lunas",           // atau "Belum Bayar", "Terlambat"
    "total_tagihan": 1500000,
    "bulan_tagihan": "2026-05",
    "tanggal_jatuh_tempo": "2026-05-25",
    "tanggal_bayar": "2026-05-20",       // null jika belum bayar
    "tenant": {
      "id": 1,
      "nama_penghuni": "Ahmad Wijaya",
      "room": {
        "nomor_kamar": "101"
      }
    }
  }
}
```

### Payment Webhook (Backend Only)
```
POST /api/tagihan/webhook/midtrans
(No authentication required - called by Midtrans)

Midtrans Payload:
{
  "order_id": "KOS-1-1715000000000",
  "transaction_status": "settlement",    // atau capture, pending, deny, cancel, expire
  "fraud_status": "accept",               // atau challenge, deny
  "payment_type": "credit_card",
  "transaction_id": "0512345678"
}

Handler Logic:
- Jika transaction_status = settlement/capture dan fraud_status = accept:
  → Update billing.status_tagihan = "Lunas"
  → Update billing.tanggal_bayar = now()
  
- Jika transaction_status = deny/cancel/expire:
  → Clear midtrans fields (allow retry)
```

## 💬 User Flow / UX

### Scenario: Admin Bayar Tagihan

1. **Admin** buka halaman Tagihan
2. **Admin** lihat tagihan dengan status "Belum Bayar"
3. **Admin** klik tombol 💳 di sebelah tagihan
   - Toast: "Link Pembayaran Dibuka"
   - Tab baru membuka halaman pembayaran Midtrans
   - Halaman saat ini redirect ke `/payment-status?id=1`
4. **Di halaman Payment Status:**
   - Loading state dengan spinner
   - Polling status setiap 2 detik
   - Billing details ditampilkan: Nama, Kamar, Jumlah, Periode
5. **Admin** selesai bayar di tab Midtrans → kembali/tutup tab
6. **Di halaman Payment Status:**
   - Polling mendeteksi status berubah jadi "Lunas"
   - UI berubah ke success state (hijau, checkmark)
   - Toast success: "✅ Pembayaran Berhasil!"
   - Info box: Terima kasih + detail pembayaran
   - Tombol "Kembali" untuk back ke halaman Tagihan
7. **Admin** klik "Kembali"
   - Redirect ke `/tagihan`
   - List billings ter-refresh (atau bisa manual refresh)
   - Tagihan tadi sudah berubah status jadi "Lunas"

## 🛠️ Setup & Configuration

### Backend (.env)
```env
# Midtrans Keys (dapatkan dari https://dashboard.midtrans.com)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx

# Frontend URL untuk callback
FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:3000 (atau ngrok URL)
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3000/api
```

### Midtrans Dashboard Setup

1. Register/Login ke https://dashboard.midtrans.com
2. Go to **Settings → Payment → Notification URL**
3. Set POST URL ke: `https://<backend-url>/api/tagihan/webhook/midtrans`
   - Local: `http://localhost:3000/api/tagihan/webhook/midtrans`
   - Production: gunakan ngrok atau public URL backend
4. Set Finish/Cancel/Unfinish Redirect URL ke: `http://localhost:5173/payment-status`

## 🧪 Testing

### Test Payment dengan Midtrans Sandbox

1. Buka halaman Tagihan
2. Klik "Bayar via Midtrans" pada tagihan yang belum bayar
3. Di halaman pembayaran Midtrans, gunakan test card:
   ```
   Kartu Kredit:
   - Nomor: 4111 1111 1111 1111
   - Exp: 12/25
   - CVV: 123
   
   Atau gunakan e-wallet test, transfer bank test, dll
   ```
4. Klik bayar → akan redirect ke payment status page
5. Status seharusnya berubah menjadi "Lunas" dalam beberapa detik
6. Toast success akan muncul

### Test Timeout Scenario

1. Di payment status page, biarkan polling berjalan
2. Tunggu 2 menit (60 polls × 2 detik)
3. Jika belum ada payment dari Midtrans, halaman akan:
   - Stop polling
   - Show timeout message
   - Tombol "Refresh Status" untuk manual check
   - Tombol "Kembali" untuk back

## 📊 Status Transitions

```
         User bayar di Midtrans
                 ↓
         Midtrans webhook terkirim
                 ↓
    ┌────────────┴────────────┐
    ↓                         ↓
Settlement/Capture       Deny/Cancel/Expire
    ↓                         ↓
Status = "Lunas" ✅     Clear payment fields
  (Success)              (Allow retry)
```

## 🚨 Error Handling

### Skenario Error:
1. **Midtrans tidak dikonfigurasi**
   - Toast error: "Midtrans belum dikonfigurasi"
   - Button disabled atau tidak berfungsi

2. **Billing tidak ditemukan**
   - Payment status page: "Tagihan Tidak Ditemukan"
   - Tombol "Kembali ke Tagihan"

3. **Payment gagal/expired**
   - Status tetap "Belum Bayar"
   - Admin bisa retry dengan klik tombol bayar lagi
   - Midtrans auto-generate payment link baru jika expired

4. **Polling timeout (2 menit)**
   - Show timeout message
   - Admin bisa click "Refresh Status" untuk manual check
   - Atau kembali ke halaman Tagihan dan refresh

## 📱 Responsive Design

- **Desktop**: Full layout dengan 2-column
- **Tablet**: Adjusted padding dan font sizes
- **Mobile**: Single column, full width

## ♿ Accessibility

- Semantic HTML (button, form labels)
- ARIA attributes untuk icons
- Color contrast sesuai WCAG standard
- Keyboard navigation support

## 📚 Related Documentation

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans API Reference](https://api-docs.midtrans.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**Last Updated:** May 5, 2026  
**Version:** 1.0.0
