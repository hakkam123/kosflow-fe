/**
 * Dummy Data for KosFlow Frontend Testing
 * Covers all features: Auth, Rooms, Tenants, Billing, Reminders, Face Recognition, and Access Logs
 */

// =====================================================================
// 1. AUTH DATA
// =====================================================================
export const dummyAuthData = {
  user: {
    id: 1,
    username: 'admin_kosflow',
    email: 'admin@kosflow.com',
    nama_lengkap: 'Admin KosFlow',
    role: 'admin',
    foto_profil: null,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  isAuthenticated: true,
};

// =====================================================================
// 2. ROOMS DATA (Kamar)
// =====================================================================
export const dummyRooms = [
  {
    id: 1,
    nomor_kamar: '101',
    tipe_kamar: 'Standar',
    harga_sewa: 1500000,
    status_kamar: 'Terisi',
    daya_listrik: '900W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    nomor_kamar: '102',
    tipe_kamar: 'Standar',
    harga_sewa: 1500000,
    status_kamar: 'Terisi',
    daya_listrik: '900W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 3,
    nomor_kamar: '103',
    tipe_kamar: 'Deluxe',
    harga_sewa: 2000000,
    status_kamar: 'Kosong',
    daya_listrik: '1200W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam', 'Balkon'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 4,
    nomor_kamar: '201',
    tipe_kamar: 'Standar',
    harga_sewa: 1500000,
    status_kamar: 'Terisi',
    daya_listrik: '900W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 5,
    nomor_kamar: '202',
    tipe_kamar: 'Standar',
    harga_sewa: 1500000,
    status_kamar: 'Terisi',
    daya_listrik: '900W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 6,
    nomor_kamar: '203',
    tipe_kamar: 'Deluxe',
    harga_sewa: 2000000,
    status_kamar: 'Kosong',
    daya_listrik: '1200W',
    fasilitas: ['WiFi', 'Kasur', 'Lemari', 'AC', 'Kamar Mandi Dalam', 'Balkon'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
];

// =====================================================================
// 3. TENANTS DATA (Penghuni)
// =====================================================================
export const dummyTenants = [
  {
    id: 1,
      nama_penghuni: 'Ahmad Riyadi',
    nama_lengkap: 'Ahmad Riyadi',
    email: 'ahmad.riyadi@email.com',
    nomor_hp: '081234567890',
    nomor_identitas: '3273011234567890',
    jenis_identitas: 'KTP',
    status_penghuni: 'Aktif',
    kamar_id: 1,
      telegram_chat_id: '123456789',
    tanggal_masuk: '2024-02-01T00:00:00Z',
    tanggal_kontrak_berakhir: '2025-02-01T00:00:00Z',
    foto_profil: null,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 2,
      nama_penghuni: 'Siti Nurhaliza',
    nama_lengkap: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    nomor_hp: '082345678901',
    nomor_identitas: '3273011234567891',
    jenis_identitas: 'KTP',
    status_penghuni: 'Aktif',
    kamar_id: 2,
      telegram_chat_id: '987654321',
    tanggal_masuk: '2024-01-15T00:00:00Z',
    tanggal_kontrak_berakhir: '2025-01-15T00:00:00Z',
    foto_profil: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
      nama_penghuni: 'Budi Santoso',
    nama_lengkap: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    nomor_hp: '083456789012',
    nomor_identitas: '3273011234567892',
    jenis_identitas: 'KTP',
    status_penghuni: 'Aktif',
    kamar_id: 4,
      telegram_chat_id: '555666777',
    tanggal_masuk: '2024-03-01T00:00:00Z',
    tanggal_kontrak_berakhir: '2025-03-01T00:00:00Z',
    foto_profil: null,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 4,
      nama_penghuni: 'Eka Putri Wijaya',
    nama_lengkap: 'Eka Putri Wijaya',
    email: 'eka.putri@email.com',
    nomor_hp: '084567890123',
    nomor_identitas: '3273011234567893',
    jenis_identitas: 'KTP',
    status_penghuni: 'Aktif',
    kamar_id: 5,
      telegram_chat_id: '888999000',
    tanggal_masuk: '2024-02-15T00:00:00Z',
    tanggal_kontrak_berakhir: '2025-02-15T00:00:00Z',
    foto_profil: null,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
  },
];

// =====================================================================
// 4. BILLING DATA (Tagihan)
// =====================================================================
export const dummyBillings = [
  {
    id: 1,
    penghuni_id: 1,
    bulan: 'Mei',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Terbayar',
    metode_pembayaran: 'Transfer Bank',
    tanggal_bayar: '2024-05-10T10:00:00Z',
    tanggal_jatuh_tempo: '2024-05-05T00:00:00Z',
    catatan: 'Pembayaran tepat waktu',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-10T10:00:00Z',
    penghuni: {
      id: 1,
      nama_lengkap: 'Ahmad Riyadi',
      kamar_id: 1,
    },
  },
  {
    id: 2,
    penghuni_id: 1,
    bulan: 'Juni',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Belum Lunas',
    metode_pembayaran: null,
    tanggal_bayar: null,
    tanggal_jatuh_tempo: '2024-06-05T00:00:00Z',
    catatan: 'Menunggu pembayaran',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    penghuni: {
      id: 1,
      nama_lengkap: 'Ahmad Riyadi',
      kamar_id: 1,
    },
  },
  {
    id: 3,
    penghuni_id: 2,
    bulan: 'Mei',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Terbayar',
    metode_pembayaran: 'Transfer Bank',
    tanggal_bayar: '2024-05-05T08:30:00Z',
    tanggal_jatuh_tempo: '2024-05-05T00:00:00Z',
    catatan: '',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-05T08:30:00Z',
    penghuni: {
      id: 2,
      nama_lengkap: 'Siti Nurhaliza',
      kamar_id: 2,
    },
  },
  {
    id: 4,
    penghuni_id: 2,
    bulan: 'Juni',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Terbayar',
    metode_pembayaran: 'Transfer Bank',
    tanggal_bayar: '2024-06-04T14:20:00Z',
    tanggal_jatuh_tempo: '2024-06-05T00:00:00Z',
    catatan: 'Pembayaran cepat',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-04T14:20:00Z',
    penghuni: {
      id: 2,
      nama_lengkap: 'Siti Nurhaliza',
      kamar_id: 2,
    },
  },
  {
    id: 5,
    penghuni_id: 3,
    bulan: 'Mei',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Overdue',
    metode_pembayaran: null,
    tanggal_bayar: null,
    tanggal_jatuh_tempo: '2024-05-05T00:00:00Z',
    catatan: 'Sudah 1 bulan belum membayar',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-06-05T00:00:00Z',
    penghuni: {
      id: 3,
      nama_lengkap: 'Budi Santoso',
      kamar_id: 4,
    },
  },
  {
    id: 6,
    penghuni_id: 4,
    bulan: 'Juni',
    tahun: 2024,
    jumlah_tagihan: 1500000,
    status_pembayaran: 'Belum Lunas',
    metode_pembayaran: null,
    tanggal_bayar: null,
    tanggal_jatuh_tempo: '2024-06-05T00:00:00Z',
    catatan: 'Menunggu pembayaran',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    penghuni: {
      id: 4,
      nama_lengkap: 'Eka Putri Wijaya',
      kamar_id: 5,
    },
  },
];

// =====================================================================
// 5. REMINDERS DATA (Pengingat)
// =====================================================================
export const dummyReminders = [
  {
    id: 1,
    penghuni_id: 1,
    hari_sebelum_jatuh_tempo: 5,
    pesan_custom: 'Jangan lupa bayar tagihan bulan ini',
    aktif: true,
    created_at: '2024-05-25T10:00:00Z',
    updated_at: '2024-05-25T10:00:00Z',
  },
  {
    id: 2,
    penghuni_id: 1,
    hari_sebelum_jatuh_tempo: 30,
    pesan_custom: 'Waktu untuk perpanjang kontrak',
    aktif: true,
    created_at: '2024-06-01T08:00:00Z',
    updated_at: '2024-06-01T08:00:00Z',
  },
  {
    id: 3,
    penghuni_id: 2,
    hari_sebelum_jatuh_tempo: 7,
    pesan_custom: 'Pembayaran tagihan bulan depan',
    aktif: true,
    created_at: '2024-06-20T09:00:00Z',
    updated_at: '2024-06-20T09:00:00Z',
  },
  {
    id: 4,
    penghuni_id: 3,
    hari_sebelum_jatuh_tempo: 1,
    pesan_custom: 'URGENT: Tunggakan pembayaran',
    aktif: true,
    created_at: '2024-06-05T12:00:00Z',
    updated_at: '2024-06-10T12:00:00Z',
  },
  {
    id: 5,
    penghuni_id: 2,
    hari_sebelum_jatuh_tempo: 3,
    pesan_custom: 'Jadwal pemeliharaan kamar minggu depan',
    aktif: true,
    created_at: '2024-06-08T14:00:00Z',
    updated_at: '2024-06-08T14:00:00Z',
  },
  {
    id: 6,
    penghuni_id: 4,
    hari_sebelum_jatuh_tempo: 5,
    pesan_custom: null,
    aktif: false,
    created_at: '2024-05-20T10:00:00Z',
    updated_at: '2024-06-05T16:00:00Z',
  },
];

// =====================================================================
// 6. ACCESS LOGS DATA (Log Akses / Face Recognition)
// =====================================================================
export const dummyAccessLogs = [
  {
    id: 1,
    penghuni_id: 1,
    tipe_akses: 'masuk',
    metode: 'wajah',
    waktu_akses: '2024-06-15T07:30:00Z',
    status: 'berhasil',
    confidence_score: 0.98,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-15T07:30:00Z',
  },
  {
    id: 2,
    penghuni_id: 1,
    tipe_akses: 'keluar',
    metode: 'wajah',
    waktu_akses: '2024-06-15T08:45:00Z',
    status: 'berhasil',
    confidence_score: 0.96,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-15T08:45:00Z',
  },
  {
    id: 3,
    penghuni_id: 2,
    tipe_akses: 'masuk',
    metode: 'wajah',
    waktu_akses: '2024-06-15T07:15:00Z',
    status: 'berhasil',
    confidence_score: 0.97,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-15T07:15:00Z',
  },
  {
    id: 4,
    penghuni_id: 3,
    tipe_akses: 'masuk',
    metode: 'wajah',
    waktu_akses: '2024-06-15T06:50:00Z',
    status: 'berhasil',
    confidence_score: 0.95,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-15T06:50:00Z',
  },
  {
    id: 5,
    penghuni_id: 1,
    tipe_akses: 'masuk',
    metode: 'wajah',
    waktu_akses: '2024-06-16T07:45:00Z',
    status: 'berhasil',
    confidence_score: 0.99,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-16T07:45:00Z',
  },
  {
    id: 6,
    penghuni_id: 4,
    tipe_akses: 'masuk',
    metode: 'wajah',
    waktu_akses: '2024-06-16T08:00:00Z',
    status: 'berhasil',
    confidence_score: 0.97,
    lokasi: 'Pintu Masuk Utama',
    created_at: '2024-06-16T08:00:00Z',
  },
];

// =====================================================================
// 7. FACE NOTIFICATIONS DATA (Notifikasi Face Recognition)
// =====================================================================
export const dummyFaceNotifications = [
  {
    id: 1,
    penghuni_id: 3,
    tipe_notifikasi: 'wajah_tidak_dikenali',
    pesan: 'Ada akses dari wajah yang tidak terdaftar pada 14:30',
    waktu: '2024-06-15T14:30:00Z',
    sudah_dibaca: false,
    created_at: '2024-06-15T14:30:00Z',
    updated_at: '2024-06-15T14:30:00Z',
  },
  {
    id: 2,
    penghuni_id: 1,
    tipe_notifikasi: 'akses_berhasil',
    pesan: 'Anda berhasil masuk pada 07:30',
    waktu: '2024-06-15T07:30:00Z',
    sudah_dibaca: true,
    created_at: '2024-06-15T07:30:00Z',
    updated_at: '2024-06-15T09:00:00Z',
  },
  {
    id: 3,
    penghuni_id: 2,
    tipe_notifikasi: 'multiple_detection',
    pesan: 'Multiple wajah terdeteksi pada 07:15',
    waktu: '2024-06-15T07:15:00Z',
    sudah_dibaca: false,
    created_at: '2024-06-15T07:15:00Z',
    updated_at: '2024-06-15T07:15:00Z',
  },
  {
    id: 4,
    penghuni_id: 4,
    tipe_notifikasi: 'akses_berhasil',
    pesan: 'Anda berhasil masuk pada 08:00',
    waktu: '2024-06-16T08:00:00Z',
    sudah_dibaca: false,
    created_at: '2024-06-16T08:00:00Z',
    updated_at: '2024-06-16T08:00:00Z',
  },
];

// =====================================================================
// 8. STATISTICS / DASHBOARD DATA
// =====================================================================
export const dummyDashboardStats = {
  totalKamar: 6,
  kamarTerisi: 4,
  kamarKosong: 2,
  totalPenghuni: 4,
  totalTagihan: 6,
  tagihanTerbayar: 4,
  tagihanBelumLunas: 1,
  tagihanOverdue: 1,
  totalReminder: 6,
  reminderAktif: 5,
  reminderSelesai: 1,
  aksesBulanIni: 12,
  aksesHariIni: 6,
  notifikasiNotif: 3,
};

// =====================================================================
// HELPER FUNCTION TO GET ALL DUMMY DATA
// =====================================================================
export const getAllDummyData = () => ({
  auth: dummyAuthData,
  rooms: dummyRooms,
  tenants: dummyTenants,
  billings: dummyBillings,
  reminders: dummyReminders,
  accessLogs: dummyAccessLogs,
  faceNotifications: dummyFaceNotifications,
  stats: dummyDashboardStats,
});

// =====================================================================
// HELPER FUNCTION TO GET DATA BY FEATURE
// =====================================================================
export const getDummyDataByFeature = (feature) => {
  const allData = getAllDummyData();
  return allData[feature] || null;
};

export default {
  dummyAuthData,
  dummyRooms,
  dummyTenants,
  dummyBillings,
  dummyReminders,
  dummyAccessLogs,
  dummyFaceNotifications,
  dummyDashboardStats,
  getAllDummyData,
  getDummyDataByFeature,
};
