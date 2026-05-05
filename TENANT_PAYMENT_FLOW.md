# 📧 Complete Tenant Payment Flow (Email/Telegram → Payment)

## Overview

Dokumentasi lengkap untuk flow pembayaran penghuni dari email/telegram link hingga pembayaran selesai.

---

## 🔄 Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTEM GENERATES BILLING                         │
│              (Admin atau scheduled task membuat tagihan)             │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SEND NOTIFICATIONS                                 │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │   EMAIL SERVICE  │              │  TELEGRAM BOT    │            │
│  │                  │              │                  │            │
│  │ Subject: Tagihan │◄─────────────► Send message     │            │
│  │ Include payment  │   paymentUrl  │ with link       │            │
│  │ button/link      │              │                  │            │
│  └────────┬─────────┘              └────────┬─────────┘            │
│           │                                  │                      │
│  Payment URL format:                         │                      │
│  http://backend/api/tagihan/pay/{id}        │                      │
└─────────────────────────────────────────────┴──────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼ Email                       ▼ Telegram
    ┌────────────┐               ┌────────────┐
    │  Inbox    │               │    Chat    │
    │  [Bayar]  │               │   [Bayar]  │
    └────┬───────┘               └────┬───────┘
         │ Click                      │ Click
         └──────────────┬─────────────┘
                        ▼
         ┌──────────────────────────────────┐
         │  GET /api/tagihan/pay/:id        │
         │  (PUBLIC - No Auth Required)     │
         │                                  │
         │  Check status:                   │
         │  - Lunas? → redirect to page     │
         │  - Belum? → redirect to page     │
         └───────────────┬──────────────────┘
                         ▼
         ┌──────────────────────────────────────┐
         │   /payment-status-public?id=X        │
         │   (Frontend Public Page)             │
         │                                      │
         │  Display:                            │
         │  - Billing details                   │
         │  - Status indicator                  │
         │  - "Bayar Sekarang" button           │
         │  - Poll status every 2 sec           │
         └───────────┬──────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────────┐          ┌──────────────┐
    │ Already Paid│          │ Click Bayar  │
    │  Show Lunas │          │ Open Midtrans│
    │  Status     │          │ in New Tab   │
    └─────────────┘          └──────┬───────┘
                                    │
                                    ▼
                        ┌──────────────────────────────┐
                        │  Midtrans Payment Page       │
                        │  (in new browser tab)        │
                        │                              │
                        │  - Select payment method     │
                        │  - Enter payment details     │
                        │  - Complete transaction      │
                        └──────────┬───────────────────┘
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                        ▼                     ▼
                    ┌─────────┐         ┌──────────┐
                    │ Success │         │ Failed   │
                    └────┬────┘         └────┬─────┘
                         │                   │
        ┌────────────────┴──────────────────┴──────────┐
        │                                              │
        │  Midtrans Webhook to Backend                │
        │  POST /api/tagihan/webhook/midtrans         │
        │  (Update status to Lunas if paid)           │
        │                                              │
        └────────────────┬─────────────────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │  Backend updates Billing record  │
        │  status_tagihan = 'Lunas'        │
        │  tanggal_bayar = now()           │
        └─────────────┬────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────────┐
        │  Frontend polls status            │
        │  every 2 seconds                 │
        │                                  │
        │  Detects status change           │
        │  Shows Success UI                │
        │  Status = ✅ LUNAS               │
        └──────────────────────────────────┘
```

---

## 📨 Phase 1: Notification Generation

### Backend: Email Service
**File**: `BE_draft1/KosAbah_BE/src/services/emailService.js`

```javascript
// Triggered when billing is created or reminder needs to be sent

sendBillingCreatedEmail(tenant, billing, paymentUrl) {
  // HTML Email includes:
  // - Tenant name
  // - Billing details (room, amount, period)
  // - Jatuh tempo (due date)
  // - Clickable [Bayar Sekarang] button → paymentUrl
  // - Contact info
  
  // paymentUrl format:
  // http://backend:3000/api/tagihan/pay/{billing.id}
}

sendReminderEmail(tenant, billing, paymentUrl) {
  // Reminder email before jatuh tempo
  // Same format with payment link
}

sendOverdueEmail(tenant, billing, paymentUrl) {
  // Overdue notice if payment not received
  // Same format with urgent message
}
```

### Backend: Telegram Bot Service
**File**: `BE_draft1/KosAbah_BE/src/services/telegramBot.js`

```javascript
// Send telegram message with markdown link

sendReminder(chatId, params) {
  // Message format:
  // "🟡 Reminder: Kamar {room} - Rp {amount}
  //  Jatuh tempo: {date}
  //  [Bayar Sekarang]({paymentUrl})"
}

sendOverdueNotice(chatId, params) {
  // Urgent message with red emoji
  // Same link format
}
```

---

## 🔗 Phase 2: Penghuni Opens Email/Telegram Link

### User Experience

```
Penghuni receives:

📧 EMAIL:
┌────────────────────────────────────────┐
│ Subject: Tagihan Kamar Anda Jatuh Tempo│
├────────────────────────────────────────┤
│ Nama Penghuni: Ahmad Hamka             │
│ Kamar: 101                             │
│ Periode: Januari 2024                  │
│ Total: Rp 2.000.000                    │
│ Jatuh Tempo: 31 Januari 2024           │
│                                        │
│        [ BAYAR SEKARANG ]              │
│      (clickable button link)           │
│                                        │
│ Link: http://backend/api/tagihan/...   │
└────────────────────────────────────────┘

💬 TELEGRAM:
🟡 Reminder Pembayaran!
Kamar: 101
Periode: Januari 2024
Total: Rp 2.000.000
Jatuh Tempo: 31 Jan 2024
👉 [Bayar Sekarang](http://backend/api/tagihan/pay/123)
```

**Penghuni Action**: Click link in email or telegram

---

## 🔀 Phase 3: Backend Redirect Endpoint

### Endpoint: GET /api/tagihan/pay/:id
**File**: `BE_draft1/KosAbah_BE/src/controllers/billingController.js` → `redirectToPayment`

```javascript
// PUBLIC endpoint - NO authentication required
// Accessible from email/telegram links

GET /api/tagihan/pay/123

Response Logic:
1. Fetch billing by ID
2. Check if already paid (status === 'Lunas')
3. If Lunas → redirect to payment status page with status=lunas
4. If Belum Bayar → redirect to payment status page
5. If Terlambat → redirect to payment status page (still need payment)

Redirect URL:
http://frontend:5173/payment-status-public?id=123
```

### Configuration Required

`.env` file must have:
```
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

---

## 💳 Phase 4: Frontend Payment Status Public Page

### Component: PaymentStatusPublic
**File**: `Fe_draft1/kosflow-fe/src/pages/PaymentStatusPublic/PaymentStatusPublic.jsx`

#### Key Features

1. **PUBLIC ACCESS** - No login required
2. **URL**: `/payment-status-public?id=123` (query param id required)
3. **Real-time Polling** - Every 2 seconds, max 60 polls (2 minutes)
4. **Three UI States**:

#### UI State 1: Processing / Pending
```
┌─────────────────────────────────────┐
│  🔵 Pembayaran Menunggu            │
├─────────────────────────────────────┤
│  Periode: Januari 2024              │
│  Jumlah: Rp 2.000.000              │
│  Penghuni: Ahmad Hamka              │
│  Kamar: 101                         │
│  Jatuh Tempo: 31 Jan 2024           │
│  Status: Belum Bayar                │
├─────────────────────────────────────┤
│  📌 Klik "Bayar Sekarang" untuk     │
│     membayar via Midtrans.         │
│                                     │
│  [    BAYAR SEKARANG   ]            │
│  Polling: 5/60...                   │
└─────────────────────────────────────┘
```

#### UI State 2: Success
```
┌─────────────────────────────────────┐
│  ✅ Pembayaran Berhasil             │
├─────────────────────────────────────┤
│  Periode: Januari 2024              │
│  Jumlah: Rp 2.000.000              │
│  Penghuni: Ahmad Hamka              │
│  Kamar: 101                         │
│  Jatuh Tempo: 31 Jan 2024           │
│  Tanggal Bayar: 28 Jan 2024         │
│  Status: ✅ Lunas                  │
├─────────────────────────────────────┤
│  ✓ Tagihan Anda telah terbayar.    │
│    Terima kasih!                    │
│                                     │
│  [       KEMBALI       ]            │
└─────────────────────────────────────┘
```

#### UI State 3: Error/Timeout
```
┌─────────────────────────────────────┐
│  ⚠️ Status Belum Terupdate          │
├─────────────────────────────────────┤
│  Polling selesai (timeout)          │
│  Silakan coba lagi nanti            │
│                                     │
│  [      REFRESH      ]              │
│  [    HUBUNGI ADMIN   ]             │
└─────────────────────────────────────┘
```

#### Component Logic

```javascript
// Initial State
- Load billing data from backend
- Start polling every 2 seconds
- Max 60 polls = 2 minute timeout

// Polling Function
checkPaymentStatus(billingId) {
  GET /api/tagihan/{billingId}
  Return: { 
    status_tagihan, 
    total_tagihan, 
    tenant: { nama_penghuni },
    tenant.room: { nomor_kamar }
  }
}

// Stop Polling When
- Status becomes 'Lunas' → Stop, show success
- Reaches 60 polls → Stop, show error
- User clicks action button → Stop

// On Midtrans Success
- Midtrans redirects to this page with ?id=X
- Page starts polling
- Backend webhook updates status to 'Lunas'
- Frontend detects change → shows success

// On Midtrans Cancel/Failure
- User back to page with ?id=X
- Can click "Bayar Sekarang" again
- Retry Midtrans payment
```

---

## 💳 Phase 5: Midtrans Payment

### When User Clicks "Bayar Sekarang"

```javascript
// Frontend Action
handleOpenPayment() {
  // Call backend to create/get Midtrans link
  POST /api/tagihan/{id}/pay
  
  // Response: { payment_url: "https://app.midtrans.com/snap/v2/..." }
  
  // Open in NEW tab
  window.open(paymentUrl, '_blank')
  
  // Start polling on current tab
  setPollingActive(true)
}
```

### Midtrans Page in New Tab
- User selects payment method (CC, e-wallet, bank transfer, etc.)
- User completes payment
- Midtrans processes transaction

### Payment Status Options

**Success**:
- Midtrans sends webhook to backend: POST /api/tagihan/webhook/midtrans
- Webhook updates billing: `status_tagihan = 'Lunas'`, `tanggal_bayar = now()`
- Frontend polling detects change → shows success

**Failure**:
- Midtrans shows error
- User closes Midtrans tab
- Returns to PaymentStatusPublic page
- Can click "Bayar Sekarang" again to retry

---

## 🔐 Phase 6: Webhook & Status Update

### Midtrans Webhook Endpoint
**File**: `BE_draft1/KosAbah_BE/src/controllers/billingController.js` → `midtransWebhook`

```javascript
POST /api/tagihan/webhook/midtrans
Headers: None (No Auth)
Body: {
  transaction_status: "settlement",
  order_id: "BILL-123",
  gross_amount: 2000000,
  // ... more midtrans data
}

// Endpoint logic:
1. Verify Midtrans signature
2. Parse transaction status
3. If "settlement" (paid):
   - Update Billing: status = 'Lunas', tanggal_bayar = now()
   - Return 200 OK
4. If "pending" or "cancel":
   - Keep status as is
   - Return 200 OK
```

### What Changes in Database

```sql
UPDATE Billing 
SET 
  status_tagihan = 'Lunas',
  tanggal_bayar = '2024-01-28 14:30:00',
  midtrans_order_id = 'BILL-123',
  updated_at = now()
WHERE id = 123
```

---

## 📱 Phase 7: Frontend Real-time Update

### Frontend Polling Logic
**File**: `Fe_draft1/kosflow-fe/src/pages/PaymentStatusPublic/PaymentStatusPublic.jsx`

```javascript
// Polling interval
setInterval(() => {
  // Every 2 seconds
  GET /api/tagihan/123
  
  // Check if status changed to 'Lunas'
  if (billing.status_tagihan === 'Lunas') {
    // Stop polling
    setPollingActive(false)
    
    // Show success UI
    // Display tanggal_bayar
  }
}, 2000)

// Max 60 polls
if (pollCount >= 60) {
  // Stop polling (2 minute timeout)
  // Show error: "Status belum terupdate"
}
```

### Frontend Update Flow

```
Time: 0s
- Page loads
- Fetch billing: status = "Belum Bayar"
- Show "Processing" UI
- Start polling

Time: 2s, 4s, 6s... 20s
- Midtrans payment in progress
- Polling every 2s: status still = "Belum Bayar"
- Show spinner

Time: 25s
- User completes payment on Midtrans
- Midtrans sends webhook ✓
- Backend updates status = "Lunas"

Time: 27s
- Frontend polling detects: status = "Lunas"
- Stop polling
- Update UI to Success
- Show ✅ checkmark
- Display tanggal_bayar
- Show message: "Pembayaran berhasil, terima kasih!"
```

---

## 🔍 API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/tagihan/pay/:id | ❌ No | Email/Telegram redirect, check status |
| GET | /api/tagihan/:id | ⭐ JWT | Frontend fetch billing details |
| POST | /api/tagihan/:id/pay | ⭐ JWT | Admin/Frontend create Midtrans link |
| POST | /api/tagihan/webhook/midtrans | ❌ No | Midtrans callback on payment complete |

**Legend**: ❌ No = Public, ⭐ JWT = Requires login token

---

## 📋 Configuration Checklist

- [ ] **Backend .env**:
  - `FRONTEND_URL=http://localhost:5173` (or production URL)
  - `MIDTRANS_SERVER_KEY=...` (production/sandbox key)
  - `MIDTRANS_CLIENT_KEY=...`
  - `MIDTRANS_APP_ID=...`
  - SMTP configured for email service
  - Telegram bot token configured

- [ ] **Frontend .env**:
  - `VITE_API_URL=http://localhost:3000` (or production URL)

- [ ] **Database**:
  - Billing table has columns: `status_tagihan`, `tanggal_bayar`, `midtrans_order_id`
  - Tenant table has columns: `email`, `telegram_chat_id`

- [ ] **Notification Services**:
  - Email service configured and tested
  - Telegram bot configured and tested
  - Scheduled jobs running for reminders

---

## 🧪 Testing Complete Flow

### Step 1: Create Test Billing
```bash
# Create billing for test tenant
POST /api/tagihan
{
  penghuni_id: 1,
  bulan_tagihan: "Januari 2024",
  total_tagihan: 100000,
  tanggal_jatuh_tempo: "2024-01-31"
}
```

### Step 2: Check Email
- Open email inbox
- Find email with subject containing billing info
- Click [Bayar Sekarang] button

### Step 3: Verify Redirect
- Should redirect to: `http://localhost:5173/payment-status-public?id=X`
- Should show billing details
- Status should show "Belum Bayar"

### Step 4: Click "Bayar Sekarang"
- New tab opens with Midtrans
- Can see payment methods (Sandbox mode available)
- Select test payment method

### Step 5: Test Payment Success
- Complete test payment on Midtrans
- Return to original tab
- Status should update to "✅ Lunas" within 2 seconds
- Should show tanggal_bayar

### Step 6: Test Payment Already Paid
- Open email/telegram link again for paid billing
- Should redirect and show "Status: ✅ Lunas"
- No payment button visible

---

## 🐛 Troubleshooting

### Issue: "Tagihan tidak ditemukan"
- Check billing ID in URL param
- Verify billing exists in database
- Check backend logs

### Issue: Page stuck on "Processing"
- Check browser console for errors
- Verify backend `/api/tagihan/{id}` endpoint working
- Check CORS settings if 403 error

### Issue: Midtrans link not opening
- Check `MIDTRANS_SERVER_KEY` and `MIDTRANS_CLIENT_KEY` configured
- Verify backend creating payment link correctly
- Check browser console for errors

### Issue: Status not updating after payment
- Verify Midtrans webhook configured correctly
- Check backend logs for webhook events
- Verify `MIDTRANS_SERVER_KEY` is correct (must match key used to sign)
- Manually trigger webhook test from Midtrans dashboard

### Issue: Email not received
- Check SMTP configuration in backend
- Verify tenant email address is correct
- Check spam folder
- Check backend logs

### Issue: Telegram link not received
- Verify tenant has `telegram_chat_id` set
- Check bot token is correct
- Verify bot is running
- Send test message manually via bot

---

## 📝 Implementation Checklist

- [x] **Backend**: Updated redirectToPayment to redirect to payment status page
- [x] **Frontend**: Created PaymentStatusPublic component for public access
- [x] **Frontend**: Added route `/payment-status-public` in App.jsx
- [x] **Frontend**: Polling logic every 2 seconds with 60 second timeout
- [ ] **Testing**: Test complete flow end-to-end
- [ ] **Production**: Deploy and configure for production URLs
- [ ] **Documentation**: Share with tenants explaining payment link process
- [ ] **Monitoring**: Set up logs/monitoring for payment flow

---

## 📞 Support

For issues or questions:
- Check backend logs: `npm run dev` output
- Check frontend console: Browser DevTools → Console tab
- Check Midtrans dashboard: Transaction history
- Check database: Billing table status updates

---

**Last Updated**: January 2024
**Version**: 1.0
