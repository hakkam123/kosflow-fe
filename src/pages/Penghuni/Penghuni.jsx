import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Phone,
  Mail,
  User,
  MessageCircle,
  Camera,
  Trash2,
  Upload,
} from "lucide-react";
import { useTenantStore, useRoomStore } from "../../context";
import { useFaceStore } from "../../context/faceStore";
import faceService from "../../services/faceService";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlashAlert from "../../components/FlashAlert";

const UPLOADS_URL = faceService.getUploadsUrl();

/**
 * Komponen Penghuni - Halaman manajemen pengguna/penghuni kos.
 * Memungkinkan admin untuk mengelola data penghuni, alokasi kamar, serta foto wajah untuk deteksi.
 *
 * @returns {JSX.Element} Halaman Manajemen Penghuni.
 */
const Penghuni = () => {
  const { toast } = useToast();
  const {
    tenants,
    fetchTenants,
    addTenant,
    updateTenant,
    deleteTenant,
    isLoading,
  } = useTenantStore();
  const { rooms, fetchRooms } = useRoomStore();
  const { uploadFace, removeFace } = useFaceStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceTenant, setFaceTenant] = useState(null);
  const [faceFile, setFaceFile] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [isUploadingFace, setIsUploadingFace] = useState(false);
  const faceInputRef = useRef(null);
  const [pageAlert, setPageAlert] = useState(null);

  const [addForm, setAddForm] = useState({
    nama_penghuni: "",
    nomor_kontak: "",
    email: "",
    no_ktp: "",
    kamar_id: "",
    tanggal_masuk: new Date().toISOString().split("T")[0],
    telegram_chat_id: "",
  });

  const [editForm, setEditForm] = useState({
    nama_penghuni: "",
    nomor_kontak: "",
    email: "",
    no_ktp: "",
    kamar_id: "",
    telegram_chat_id: "",
  });

  const [errors, setErrors] = useState({});

  const validateAddForm = (form) => {
    const newErrors = {};
    if (!form.nama_penghuni.trim()) {
      newErrors.nama_penghuni = "Nama lengkap wajib diisi";
    }

    if (!form.nomor_kontak.trim()) {
      newErrors.nomor_kontak = "No WhatsApp wajib diisi";
    } else if (!/^\d+$/.test(form.nomor_kontak)) {
      newErrors.nomor_kontak = "No WhatsApp harus berupa angka";
    } else if (form.nomor_kontak.length < 10) {
      newErrors.nomor_kontak = "No WhatsApp minimal 10 digit";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.no_ktp.trim()) {
      newErrors.no_ktp = "No KTP wajib diisi";
    } else if (!/^\d{16}$/.test(form.no_ktp)) {
      newErrors.no_ktp = "No KTP harus 16 digit angka";
    }

    if (!form.kamar_id) {
      newErrors.kamar_id = "Kamar wajib dipilih";
    }

    if (!form.tanggal_masuk) {
      newErrors.tanggal_masuk = "Tanggal masuk wajib diisi";
    }

    if (!form.telegram_chat_id.trim()) {
      newErrors.telegram_chat_id = "Telegram Chat ID wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = (form) => {
    const newErrors = {};
    if (!form.nama_penghuni.trim()) {
      newErrors.nama_penghuni = "Nama lengkap wajib diisi";
    }

    if (!form.nomor_kontak.trim()) {
      newErrors.nomor_kontak = "No WhatsApp wajib diisi";
    } else if (!/^\d+$/.test(form.nomor_kontak)) {
      newErrors.nomor_kontak = "No WhatsApp harus berupa angka";
    } else if (form.nomor_kontak.length < 10) {
      newErrors.nomor_kontak = "No WhatsApp minimal 10 digit";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (form.no_ktp && !/^\d{16}$/.test(form.no_ktp)) {
      newErrors.no_ktp = "No KTP harus 16 digit angka";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchTenants();
    fetchRooms();
  }, []);

  /**
   * Mendapatkan objek kamar berdasarkan ID kamar.
   *
   * @param {number|string} id - ID Kamar.
   * @returns {Object|undefined} Objek kamar yang cocok.
   */
  const getRoomById = (id) => rooms.find((r) => r.id === id);

  /**
   * Membuka modal form tambah penghuni dan mereset nilai form.
   */
  const handleOpenAddModal = () => {
    setAddForm({
      nama_penghuni: "",
      nomor_kontak: "",
      email: "",
      no_ktp: "",
      kamar_id: "",
      tanggal_masuk: new Date().toISOString().split("T")[0],
      telegram_chat_id: "",
    });
    setErrors({});
    setIsAddModalOpen(true);
  };

  /**
   * Membuka modal edit penghuni dan mengisi data form dengan tenant terpilih.
   *
   * @param {Object} tenant - Objek tenant yang akan diedit.
   */
  const handleOpenEditModal = (tenant) => {
    setEditingTenant(tenant);
    setEditForm({
      nama_penghuni: tenant.nama_penghuni,
      nomor_kontak: tenant.nomor_kontak,
      email: tenant.email || "",
      no_ktp: tenant.no_ktp || "",
      kamar_id: tenant.kamar_id ? tenant.kamar_id.toString() : "",
      telegram_chat_id: tenant.telegram_chat_id || "",
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  /**
   * Menangani proses penambahan data penghuni ke server.
   *
   * @async
   */
  const handleAddTenant = async () => {
    if (!validateAddForm(addForm)) {
      setPageAlert({
        variant: "warning",
        title: "Lengkapi data penghuni",
        description:
          "Semua field wajib diisi: nama, WhatsApp, email, No KTP, kamar, tanggal masuk, dan Telegram Chat ID.",
      });
      return;
    }

    setPageAlert(null);

    const data = {
      ...addForm,
      kamar_id: parseInt(addForm.kamar_id),
    };

    const result = await addTenant(data);
    if (result.success) {
      setPageAlert({
        variant: "success",
        title: "Berhasil tambah penghuni",
        description: "Data penghuni baru berhasil disimpan.",
      });
      setIsAddModalOpen(false);
    } else {
      setPageAlert({
        variant: "error",
        title: "Gagal tambah penghuni",
        description: result.error || "Data penghuni gagal disimpan.",
      });
    }
  };

  /**
   * Menangani proses pembaruan data penghuni yang sudah ada.
   *
   * @async
   */
  const handleEditTenant = async () => {
    if (!validateEditForm(editForm)) return;

    const data = {
      ...editForm,
      kamar_id: editForm.kamar_id ? parseInt(editForm.kamar_id) : null,
    };
    const result = await updateTenant(editingTenant.id, data);
    if (result.success) {
      toast.success({
        title: "Berhasil!",
        description: "Data penghuni telah diperbarui",
      });
      setIsEditModalOpen(false);
    } else {
      toast.error({
        title: "Gagal",
        description: result.error || "Gagal memperbarui penghuni",
      });
    }
  };

  /**
   * Menangani proses penghapusan data penghuni setelah konfirmasi.
   *
   * @async
   * @param {number|string} id - ID tenant.
   * @param {string} name - Nama tenant untuk konfirmasi.
   */
  const handleDeleteTenant = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      await deleteTenant(id);
      toast.success({
        title: "Berhasil!",
        description: "Penghuni telah dihapus",
      });
    }
  };

  /**
   * Membuka modal unggah/edit foto wajah untuk keperluan Face Recognition.
   *
   * @param {Object} tenant - Objek tenant terkait.
   */
  const handleOpenFaceModal = (tenant) => {
    setFaceTenant(tenant);
    setFaceFile(null);
    setFacePreview(null);
    setIsFaceModalOpen(true);
  };

  /**
   * Menangani perubahan file pada input upload foto wajah.
   * Akan menampilkan preview gambar lokal.
   *
   * @param {Event} e - Event onChange input file.
   */
  const handleFaceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFacePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Menangani proses upload foto wajah ke server.
   * Data foto akan diproses untuk encoding wajah (face recognition).
   *
   * @async
   */
  const handleUploadFace = async () => {
    if (!faceFile || !faceTenant) return;
    setIsUploadingFace(true);
    try {
      const result = await uploadFace(faceTenant.id, faceFile);
      if (result.success) {
        toast.success({
          title: "Berhasil!",
          description: "Foto wajah berhasil diupload dan di-encode",
        });
        await fetchTenants();
        setIsFaceModalOpen(false);
      } else {
        toast.error({ title: "Gagal", description: result.error });
      }
    } catch (err) {
      toast.error({ title: "Error", description: "Gagal upload foto wajah" });
    } finally {
      setIsUploadingFace(false);
    }
  };

  /**
   * Menghapus data foto dan encoding wajah milik penghuni.
   *
   * @async
   * @param {Object} tenant - Objek tenant yang wajahnya akan dihapus.
   */
  const handleRemoveFace = async (tenant) => {
    if (!window.confirm(`Hapus data wajah ${tenant.nama_penghuni}?`)) return;
    const result = await removeFace(tenant.id);
    if (result.success) {
      toast.success({
        title: "Berhasil!",
        description: "Data wajah berhasil dihapus",
      });
      await fetchTenants();
    } else {
      toast.error({ title: "Gagal", description: result.error });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {pageAlert && (
        <div className="mb-6">
          <FlashAlert
            variant={pageAlert.variant || "info"}
            title={pageAlert.title}
            description={pageAlert.description}
            onClose={() => setPageAlert(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penghuni</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data penghuni kos</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Penghuni
        </button>
      </div>

      {/* Tenant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => {
          const room = tenant.room || getRoomById(tenant.kamar_id);

          return (
            <div
              key={tenant.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              {/* Header with Icon/Photo and Name */}
              <div className="flex items-start gap-3 mb-4">
                {tenant.foto_wajah ? (
                  <img
                    src={`${UPLOADS_URL}/${tenant.foto_wajah}`}
                    alt={tenant.nama_penghuni}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#059669]/10 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-[#059669]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {tenant.nama_penghuni}
                  </h3>
                  <p className="text-sm text-[#059669] font-medium">
                    {room?.nomor_kamar || "Belum ada kamar"}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="truncate">{tenant.nomor_kontak}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{tenant.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 shrink-0" />
                  {tenant.email ? (
                    <span className="text-[#059669] font-medium">
                      Notifikasi email aktif
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Notifikasi email belum aktif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {tenant.telegram_chat_id ? (
                    <span className="text-[#059669] font-medium">
                      Telegram terhubung
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Telegram belum terhubung
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Camera className="h-4 w-4 shrink-0" />
                  {tenant.face_encoding ? (
                    <span className="text-[#059669] font-medium">
                      Wajah terdaftar
                    </span>
                  ) : (
                    <span className="text-gray-400">Wajah belum terdaftar</span>
                  )}
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mb-4">
                Masuk:{" "}
                {new Date(tenant.tanggal_masuk).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenFaceModal(tenant)}
                  className={`px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-all ${
                    tenant.face_encoding
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-white hover:bg-blue-50 text-blue-600"
                  }`}
                  title={
                    tenant.face_encoding
                      ? "Update Foto Wajah"
                      : "Upload Foto Wajah"
                  }
                >
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenEditModal(tenant)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDeleteTenant(tenant.id, tenant.nama_penghuni)
                  }
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {tenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada penghuni ditemukan</p>
        </div>
      )}

      {/* Add Tenant Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Penghuni</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                value={addForm.nama_penghuni}
                onChange={(e) =>
                  setAddForm({ ...addForm, nama_penghuni: e.target.value })
                }
                className={`mt-2 ${errors.nama_penghuni ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.nama_penghuni && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nama_penghuni}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp">No. WhatsApp*</Label>
              <Input
                id="whatsapp"
                placeholder="08xxxxxxxxxx"
                value={addForm.nomor_kontak}
                onChange={(e) =>
                  setAddForm({ ...addForm, nomor_kontak: e.target.value })
                }
                className={`mt-2 ${errors.nomor_kontak ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.nomor_kontak && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nomor_kontak}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm({ ...addForm, email: e.target.value })
                  }
                  className={`mt-2 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ktp">No. KTP</Label>
                <Input
                  id="ktp"
                  placeholder="16 digit"
                  value={addForm.no_ktp}
                  onChange={(e) =>
                    setAddForm({ ...addForm, no_ktp: e.target.value })
                  }
                  className={`mt-2 ${errors.no_ktp ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.no_ktp && (
                  <p className="text-red-500 text-xs mt-1">{errors.no_ktp}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="kamar">Kamar</Label>
              <select
                id="kamar"
                value={addForm.kamar_id}
                onChange={(e) =>
                  setAddForm({ ...addForm, kamar_id: e.target.value })
                }
                className={`mt-2 block w-full px-4 py-2.5 bg-white border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all ${errors.kamar_id ? "border-red-500 ring-red-500" : "border-gray-200"}`}
              >
                <option value="">Pilih Kamar</option>
                {rooms
                  .filter((r) => r.status_kamar === "Kosong")
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.nomor_kamar} — {room.tipe_kamar}
                    </option>
                  ))}
              </select>
              {errors.kamar_id && (
                <p className="text-red-500 text-xs mt-1">{errors.kamar_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telegram">Telegram Chat ID</Label>
              <Input
                id="telegram"
                placeholder="Dapatkan dari bot Telegram dengan /start"
                value={addForm.telegram_chat_id}
                onChange={(e) =>
                  setAddForm({ ...addForm, telegram_chat_id: e.target.value })
                }
                className="mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Penghuni harus kirim /start ke bot Telegram untuk mendapatkan
                Chat ID
              </p>
              {errors.telegram_chat_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.telegram_chat_id}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAddTenant}
              className="bg-[#059669] hover:bg-[#047857]"
            >
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Penghuni</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="editNama">Nama Lengkap</Label>
              <Input
                id="editNama"
                placeholder="Masukkan nama lengkap"
                value={editForm.nama_penghuni}
                onChange={(e) =>
                  setEditForm({ ...editForm, nama_penghuni: e.target.value })
                }
                className={`mt-2 ${errors.nama_penghuni ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.nama_penghuni && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nama_penghuni}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="editWhatsapp">No. WhatsApp*</Label>
              <Input
                id="editWhatsapp"
                placeholder="08xxxxxxxxxx"
                value={editForm.nomor_kontak}
                onChange={(e) =>
                  setEditForm({ ...editForm, nomor_kontak: e.target.value })
                }
                className={`mt-2 ${errors.nomor_kontak ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.nomor_kontak && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nomor_kontak}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className={`mt-2 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="editKtp">No. KTP</Label>
                <Input
                  id="editKtp"
                  placeholder="16 digit"
                  value={editForm.no_ktp}
                  onChange={(e) =>
                    setEditForm({ ...editForm, no_ktp: e.target.value })
                  }
                  className={`mt-2 ${errors.no_ktp ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.no_ktp && (
                  <p className="text-red-500 text-xs mt-1">{errors.no_ktp}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="editKamar">Kamar</Label>
              <select
                id="editKamar"
                value={editForm.kamar_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, kamar_id: e.target.value })
                }
                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
              >
                <option value="">Tanpa Kamar</option>
                {rooms
                  .filter(
                    (r) =>
                      r.status_kamar === "Kosong" ||
                      (editingTenant && r.id === editingTenant.kamar_id),
                  )
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.nomor_kamar} — {room.tipe_kamar}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Label htmlFor="editTelegram">Telegram Chat ID</Label>
              <Input
                id="editTelegram"
                placeholder="Dapatkan dari bot Telegram dengan /start"
                value={editForm.telegram_chat_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, telegram_chat_id: e.target.value })
                }
                className="mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Penghuni harus kirim /start ke bot Telegram untuk mendapatkan
                Chat ID
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleEditTenant}
              className="bg-[#059669] hover:bg-[#047857]"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Face Photo Upload Modal */}
      <Dialog open={isFaceModalOpen} onOpenChange={setIsFaceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {faceTenant?.face_encoding
                ? "Update Foto Wajah"
                : "Upload Foto Wajah"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {faceTenant?.nama_penghuni} — Upload foto wajah untuk face
              recognition di pintu kos.
            </p>

            {/* Current Face Photo */}
            {faceTenant?.foto_wajah && !facePreview && (
              <div className="text-center">
                <img
                  src={`${UPLOADS_URL}/${faceTenant.foto_wajah}`}
                  alt="Foto wajah saat ini"
                  className="w-32 h-32 rounded-xl object-cover mx-auto border-2 border-green-200"
                />
                <p className="text-xs text-green-600 mt-2 font-medium">
                  Foto wajah saat ini
                </p>
              </div>
            )}

            {/* Preview New Photo */}
            {facePreview && (
              <div className="text-center">
                <img
                  src={facePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-xl object-cover mx-auto border-2 border-blue-200"
                />
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Foto baru
                </p>
              </div>
            )}

            {/* File Input */}
            <div>
              <input
                ref={faceInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFaceFileChange}
                className="hidden"
              />
              <button
                onClick={() => faceInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-[#059669] rounded-xl text-sm text-gray-600 hover:text-[#059669] transition-all"
              >
                <Upload className="h-4 w-4" />
                {faceFile ? faceFile.name : "Pilih foto wajah (JPG, PNG)"}
              </button>
              <p className="text-xs text-gray-400 mt-1">
                Pastikan foto menampilkan wajah dengan jelas. Maks 10MB.
              </p>
            </div>
          </div>

          <DialogFooter>
            {faceTenant?.face_encoding && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleRemoveFace(faceTenant);
                  setIsFaceModalOpen(false);
                }}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Hapus Wajah
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsFaceModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleUploadFace}
              disabled={!faceFile || isUploadingFace}
              className="bg-[#059669] hover:bg-[#047857]"
            >
              {isUploadingFace ? "Memproses..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Penghuni;
