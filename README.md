# KosFlow Frontend

Frontend aplikasi manajemen kos-kosan KosFlow.

## Konfigurasi API (Penting!)

Aplikasi ini sudah diatur untuk terhubung **100% langsung ke backend API** tanpa menggunakan *mock/dummy data* lagi. Semua file dan *logic mock data* lama telah sepenuhnya dihapus dari *source code*.

### Menghubungkan ke API Ngrok
Untuk mengatur URL tujuan API (misal menggunakan Ngrok saat *development*), ubah URL pada file `.env` di *root* folder proyek ini:

```env
VITE_API_URL=https://<alamat-ngrok-anda>.ngrok-free.dev/api
```

> [!WARNING]
> Setiap kali Anda mengubah file `.env`, Anda wajib **menghentikan server Vite (`Ctrl+C`)** dan menjalankannya kembali dengan perintah `npm run dev`.

### Mengapa GET Request Gagal/CORS Error di Ngrok?
Jika Anda menggunakan **Ngrok versi gratis**, Ngrok biasanya akan menampilkan "Browser Warning Page" untuk *request* berjenis `GET`. Karena halaman *warning* ini berupa HTML (bukan JSON) dan tidak memiliki *header* CORS, maka *request* dari *frontend* akan ditolak (*Blocked by CORS* / warna merah di Network Tab).
Sedangkan *request* `POST`, `PUT`, dan `DELETE` biasanya secara otomatis dibiarkan lewat oleh Ngrok tanpa menampilkan *warning*. 

> [!TIP]
> **Solusi:** Kami sudah menyematkan *header* `ngrok-skip-browser-warning: true` ke dalam konfigurasi Axios (`src/services/api.js`). Dengan *header* ini, API akan secara otomatis mengabaikan halaman peringatan Ngrok dan langsung mendapatkan data JSON dari *backend*, menyelesaikan masalah gagal *fetch* pada daftar kamar/penghuni.
