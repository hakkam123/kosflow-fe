# Dokumentasi Fitur Folder `src/pages`

Dokumen ini merangkum fitur yang saat ini tersedia di setiap halaman dalam folder `src/pages`, berdasarkan implementasi komponen yang ada di repo.

## Ringkasan halaman

| Halaman | Route | Tujuan | Status implementasi |
| --- | --- | --- | --- |
| `Dashboard` | `/` | Ringkasan operasional kos untuk admin | UI statis dengan data mock |
| `Kamar` | `/kamar` | Kelola data kamar | Terhubung ke store/API |
| `Penghuni` | `/penghuni` | Kelola data penghuni dan data wajah | Terhubung ke store/API |
| `Tagihan` | `/tagihan` | Kelola tagihan bulanan dan pembayaran | Terhubung ke store/API |
| `Reminder` | `/reminder` | Kelola reminder tagihan per penghuni | Terhubung ke store/API |
| `MonitorKamera` | `/monitor-kamera` | Monitoring kamera dan face recognition real-time | Terhubung ke kamera browser dan service face recognition |
| `LogAkses` | `/log-akses` | Lihat histori deteksi wajah | Terhubung ke store/API |
| `NotifikasiFace` | `/notifikasi-face` | Lihat notifikasi orang tidak dikenal | Terhubung ke store/API |
| `Pengaturan` | `/pengaturan` | Atur konfigurasi penagihan dan template pesan | UI lokal, belum tersimpan ke backend |
| `Login` | `/login` | Login admin/pengelola | Terhubung ke auth store/API |
| `Register` | `/register` | Registrasi akun admin/pengelola | Terhubung ke auth store/API |
| `VerifyEmail` | `/verify-email` | Verifikasi email setelah registrasi | Terhubung ke auth store/API |
| `UserLoginOTP` | `/user/login` | Login penghuni menggunakan OTP | UI simulasi, belum terhubung backend |
| `DashboardUser` | `/user/dashboard` | Dashboard penghuni untuk tagihan dan riwayat | UI statis dengan data mock |

## 1. `Dashboard`

File: `src/pages/Dashboard/Dashboard.jsx`

Fitur yang tersedia:
- Menampilkan kartu statistik ringkas: total kamar, jumlah penghuni, tagihan menunggu, dan tagihan terlambat.
- Menampilkan panel pendapatan bulan ini.
- Menampilkan panel ketersediaan kamar.
- Menampilkan daftar jatuh tempo terdekat.
- Menampilkan aktivitas terbaru.

Catatan implementasi:
- Seluruh data masih berasal dari array lokal di dalam komponen.
- Belum ada integrasi ke store atau API backend.
- Cocok dianggap sebagai dashboard prototype/admin preview.

## 2. `Kamar`

File: `src/pages/Kamar/Kamar.jsx`

Fitur yang tersedia:
- Mengambil daftar kamar dari `useRoomStore`.
- Menampilkan kartu kamar berisi nomor kamar, tipe, status kamar, harga per bulan, dan nama penghuni jika ada.
- Menambah kamar baru melalui modal form.
- Mengubah data kamar melalui modal edit.
- Menghapus kamar dengan konfirmasi browser.
- Menonaktifkan tombol hapus untuk kamar yang sedang terisi.
- Menampilkan toast sukses setelah tambah, edit, atau hapus.

Data dan dependensi:
- Store: `useRoomStore`
- Utilitas: `formatRupiah`

Catatan implementasi:
- Halaman sudah bersifat CRUD dan terhubung ke data aplikasi.

## 3. `Penghuni`

File: `src/pages/Penghuni/Penghuni.jsx`

Fitur yang tersedia:
- Mengambil daftar penghuni dan kamar dari store.
- Menampilkan kartu penghuni berisi identitas dasar, kamar, nomor kontak, email, status Telegram, status wajah, dan tanggal masuk.
- Menambah penghuni baru melalui modal.
- Mengedit data penghuni.
- Menghapus penghuni dengan konfirmasi browser.
- Memilih kamar kosong saat menambah penghuni.
- Memilih kamar kosong atau kamar saat ini ketika mengedit penghuni.
- Menyimpan `telegram_chat_id` penghuni.
- Upload foto wajah penghuni untuk face recognition.
- Preview foto wajah sebelum upload.
- Menampilkan foto wajah yang sudah tersimpan.
- Menghapus data wajah penghuni.
- Refresh daftar penghuni setelah upload atau hapus data wajah.

Data dan dependensi:
- Store: `useTenantStore`, `useRoomStore`, `useFaceStore`
- Service: `faceService`

Catatan implementasi:
- Halaman ini menjadi pusat data master penghuni sekaligus enrollment wajah.

## 4. `Tagihan`

File: `src/pages/Tagihan/Tagihan.jsx`

Fitur yang tersedia:
- Mengambil data tagihan, penghuni, dan kamar saat halaman dibuka.
- Menjalankan pengecekan tagihan overdue saat load halaman.
- Menampilkan statistik jumlah tagihan `Menunggu`, `Lunas`, dan `Terlambat`.
- Filter daftar tagihan berdasarkan status.
- Menampilkan detail tagihan: nama penghuni, kamar, periode, total tagihan, dan tanggal jatuh tempo.
- Generate tagihan otomatis untuk semua penghuni aktif berdasarkan periode dan tanggal jatuh tempo.
- Menambah tagihan manual untuk penghuni tertentu.
- Auto-fill nominal tagihan manual dari harga kamar penghuni yang dipilih.
- Menandai tagihan sebagai lunas.
- Membuat link pembayaran via Midtrans.
- Membuka link pembayaran jika URL Midtrans sudah tersedia.
- Menghapus tagihan dengan modal konfirmasi.
- Menampilkan toast untuk hasil aksi penting.

Data dan dependensi:
- Store: `useBillingStore`, `useTenantStore`, `useRoomStore`
- Utilitas: `formatDate`

Catatan implementasi:
- Halaman sudah mendukung alur penagihan inti, termasuk generate dan pembayaran eksternal.

## 5. `Reminder`

File: `src/pages/Reminder/Reminder.jsx`

Fitur yang tersedia:
- Mengambil data penghuni, kamar, dan reminder saat halaman dibuka.
- Mencari penghuni berdasarkan nama atau nomor kamar.
- Menampilkan daftar reminder per penghuni.
- Menandai status koneksi Telegram penghuni.
- Menambah reminder baru per penghuni.
- Mengedit reminder yang sudah ada.
- Menghapus reminder melalui modal konfirmasi.
- Mengaktifkan atau menonaktifkan reminder dengan toggle.
- Menentukan `hari_sebelum_jatuh_tempo` dalam format H-X.
- Menambahkan pesan custom per reminder.
- Test kirim reminder ke Telegram melalui `reminderService.testSend`.

Data dan dependensi:
- Store: `useTenantStore`, `useRoomStore`, `useReminderStore`
- Service dinamis: `reminderService`

Catatan implementasi:
- Reminder dikonfigurasi per penghuni, bukan hanya global.
- Fokus halaman ini adalah reminder via Telegram.

## 6. `MonitorKamera`

File: `src/pages/MonitorKamera/MonitorKamera.jsx`

Fitur yang tersedia:
- Mengaktifkan kamera browser dengan `getUserMedia`.
- Menghentikan stream kamera.
- Menampilkan status kamera aktif/nonaktif.
- Mengaktifkan dan menghentikan loop deteksi wajah.
- Mengatur interval deteksi 1 sampai 10 detik.
- Meng-capture frame video ke canvas tersembunyi.
- Mengirim frame ke `faceService.recognize`.
- Menggambar bounding box dan label hasil deteksi di atas video.
- Menampilkan hasil deteksi terbaru pada panel samping.
- Menandai deteksi dikenal dan tidak dikenal dengan warna berbeda.
- Memberikan toast alert saat orang tidak dikenal terdeteksi.
- Menerapkan cooldown notifikasi 15 detik untuk unknown detection.
- Memanggil `fetchUnreadCount()` agar jumlah notifikasi wajah ikut diperbarui.

Data dan dependensi:
- Store: `useFaceStore`
- Service: `faceService`
- API browser: kamera, canvas, media stream

Catatan implementasi:
- Ini adalah halaman paling interaktif di folder `pages`.
- Bergantung pada izin kamera browser dan service face recognition yang aktif.

## 7. `LogAkses`

File: `src/pages/LogAkses/LogAkses.jsx`

Fitur yang tersedia:
- Mengambil log deteksi wajah dari `useFaceStore`.
- Filter log berdasarkan status `dikenal` atau `tidak_dikenal`.
- Pencarian berdasarkan `nama_terdeteksi` atau nama penghuni terkait.
- Menampilkan statistik akses hari ini:
  - total akses
  - penghuni dikenal
  - tidak dikenal
- Menampilkan tabel log berisi waktu, nama terdeteksi, status, confidence, dan screenshot.
- Menampilkan modal preview screenshot jika tersedia.
- Menampilkan state loading dan empty state.

Data dan dependensi:
- Store: `useFaceStore`
- Service: `faceService`

Catatan implementasi:
- Halaman ini fokus pada audit trail deteksi, bukan kontrol kamera.

## 8. `NotifikasiFace`

File: `src/pages/NotifikasiFace/NotifikasiFace.jsx`

Fitur yang tersedia:
- Mengambil daftar notifikasi wajah dan unread count saat halaman dibuka.
- Menampilkan badge jumlah notifikasi belum dibaca.
- Filter tampilan: semua, belum dibaca, sudah dibaca.
- Menandai satu notifikasi sebagai sudah dibaca.
- Menandai semua notifikasi sebagai sudah dibaca.
- Menampilkan screenshot notifikasi bila tersedia.
- Menampilkan preview gambar dalam modal.
- Menampilkan tampilan berbeda untuk item yang belum dibaca dan sudah dibaca.

Data dan dependensi:
- Store: `useFaceStore`
- Service: `faceService`

Catatan implementasi:
- Halaman ini menjadi inbox untuk alert deteksi orang tidak dikenal.

## 9. `Pengaturan`

File: `src/pages/Pengaturan/Pengaturan.jsx`

Fitur yang tersedia:
- Mengatur tanggal tagihan bulanan melalui input tanggal.
- Menampilkan preview teks tanggal pembuatan tagihan.
- Mengatur hari pengingat sebelum jatuh tempo.
- Mengatur hari pengingat setelah jatuh tempo.
- Mengelola template pesan WhatsApp untuk beberapa skenario:
  - pesan pengingat
  - pesan jatuh tempo
  - pesan terlambat
  - pesan pembayaran berhasil
  - pesan jumlah tidak sesuai
- Membuka modal editor template pesan.
- Menampilkan daftar variabel yang dapat dipakai di template.
- Menyimpan hasil edit template ke state lokal.
- Menampilkan toast saat tombol simpan ditekan.

Data dan dependensi:
- Tidak memakai store backend untuk persistence
- Komponen UI dialog dan toast

Catatan implementasi:
- Nilai pengaturan masih hidup di state lokal komponen.
- Tombol simpan belum mengirim data ke backend.
- Halaman ini sekarang lebih tepat dianggap sebagai UI konfigurasi yang belum persisten.

## 10. `Login`

File: `src/pages/Login/Login.jsx`

Fitur yang tersedia:
- Form login menggunakan email dan password.
- Toggle tampil/sembunyikan password.
- Menampilkan loading state saat proses login.
- Menampilkan error dari auth store.
- Redirect ke `/` jika login berhasil.
- Link ke halaman registrasi.

Data dan dependensi:
- Store: `useAuthStore`

## 11. `Register`

File: `src/pages/Register/Register.jsx`

Fitur yang tersedia:
- Form registrasi dengan username, email, dan password.
- Toggle tampil/sembunyikan password.
- Menampilkan loading state saat registrasi.
- Menampilkan error dari auth store.
- Redirect ke `/verify-email` dengan membawa email lewat router state jika registrasi berhasil.
- Link kembali ke halaman login.

Data dan dependensi:
- Store: `useAuthStore`

## 12. `VerifyEmail`

File: `src/pages/VerifyEmail/VerifyEmail.jsx`

Fitur yang tersedia:
- Verifikasi email menggunakan kode 6 digit.
- Auto-focus antar input digit.
- Dukungan paste kode OTP ke input.
- Countdown 60 detik untuk resend code.
- Tombol kirim ulang kode setelah timer selesai.
- Menampilkan loading dan error dari auth store.
- Redirect ke `/login` jika verifikasi berhasil.
- Tombol kembali ke halaman sebelumnya.

Data dan dependensi:
- Store: `useAuthStore`

## 13. `UserLoginOTP`

File: `src/pages/DashboardUser/UserLoginOTP.jsx`

Fitur yang tersedia:
- Form OTP 6 digit untuk akses dashboard penghuni.
- Auto-focus ke input berikutnya saat digit terisi.
- Fokus mundur saat backspace di input kosong.
- Tombol submit disabled sampai semua digit terisi.
- Simulasi loading 1.5 detik saat login.
- Redirect ke `/user/dashboard` setelah simulasi selesai.
- Tautan UI untuk kirim ulang kode.

Catatan implementasi:
- Belum terhubung ke backend atau store autentikasi penghuni.
- Saat ini masih berupa alur simulasi.

## 14. `DashboardUser`

File: `src/pages/DashboardUser/DashboardUser.jsx`

Fitur yang tersedia:
- Menampilkan profil singkat penghuni dan informasi kamar.
- Menampilkan tagihan terbaru.
- Tombol `Bayar Sekarang` yang saat ini memunculkan alert browser.
- Menampilkan info tanggal masuk dan total pembayaran.
- Menampilkan preview dua riwayat pembayaran terakhir.
- Tab bawah untuk pindah antara `Beranda` dan `Riwayat`.
- Menampilkan seluruh riwayat pembayaran pada tab riwayat.

Catatan implementasi:
- Data penghuni, tagihan, dan riwayat masih mock data lokal.
- Tombol pembayaran belum terhubung ke sistem pembayaran nyata.

## Catatan tambahan

- Halaman admin yang sudah benar-benar terhubung ke store/API: `Kamar`, `Penghuni`, `Tagihan`, `Reminder`, `MonitorKamera`, `LogAkses`, `NotifikasiFace`, `Login`, `Register`, `VerifyEmail`.
- Halaman yang masih dominan prototype/mock/local state: `Dashboard`, `DashboardUser`, `UserLoginOTP`, `Pengaturan`.
- Route didefinisikan di `src/App.jsx`.
