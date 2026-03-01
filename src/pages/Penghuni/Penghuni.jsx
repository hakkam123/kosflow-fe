import React, { useState, useEffect } from 'react';
import { Plus, Phone, Mail, User, MessageCircle } from 'lucide-react';
import { useTenantStore, useRoomStore } from '../../context';
import { useToast } from '@/components/ui/toast';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Penghuni = () => {
    const { toast } = useToast();
    const { tenants, fetchTenants, addTenant, updateTenant, deleteTenant, isLoading } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);

    const [addForm, setAddForm] = useState({
        nama_penghuni: '',
        nomor_kontak: '',
        email: '',
        no_ktp: '',
        kamar_id: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        telegram_chat_id: '',
    });

    const [editForm, setEditForm] = useState({
        nama_penghuni: '',
        nomor_kontak: '',
        email: '',
        no_ktp: '',
        kamar_id: '',
        telegram_chat_id: '',
    });

    useEffect(() => {
        fetchTenants();
        fetchRooms();
    }, []);

    const getRoomById = (id) => rooms.find((r) => r.id === id);

    const handleOpenAddModal = () => {
        setAddForm({
            nama_penghuni: '',
            nomor_kontak: '',
            email: '',
            no_ktp: '',
            kamar_id: '',
            tanggal_masuk: new Date().toISOString().split('T')[0],
            telegram_chat_id: '',
        });
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (tenant) => {
        setEditingTenant(tenant);
        setEditForm({
            nama_penghuni: tenant.nama_penghuni,
            nomor_kontak: tenant.nomor_kontak,
            email: tenant.email || '',
            no_ktp: tenant.no_ktp || '',
            kamar_id: tenant.kamar_id ? tenant.kamar_id.toString() : '',
            telegram_chat_id: tenant.telegram_chat_id || '',
        });
        setIsEditModalOpen(true);
    };

    const handleAddTenant = async () => {
        const data = {
            ...addForm,
            kamar_id: parseInt(addForm.kamar_id),
        };

        await addTenant(data);
        toast.success({
            title: 'Berhasil!',
            description: 'Penghuni baru telah ditambahkan',
        });
        setIsAddModalOpen(false);
    };

    const handleEditTenant = async () => {
        const data = {
            ...editForm,
            kamar_id: editForm.kamar_id ? parseInt(editForm.kamar_id) : null,
        };
        await updateTenant(editingTenant.id, data);
        toast.success({
            title: 'Berhasil!',
            description: 'Data penghuni telah diperbarui',
        });
        setIsEditModalOpen(false);
    };

    const handleDeleteTenant = async (id, name) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
            await deleteTenant(id);
            toast.success({
                title: 'Berhasil!',
                description: 'Penghuni telah dihapus',
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
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
                        <div key={tenant.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {/* Header with Icon and Name */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-[#059669]/10 flex items-center justify-center flex-shrink-0">
                                    <User className="h-6 w-6 text-[#059669]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{tenant.nama_penghuni}</h3>
                                    <p className="text-sm text-[#059669] font-medium">{room?.nomor_kamar || 'Belum ada kamar'}</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{tenant.nomor_kontak}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{tenant.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                                    {tenant.telegram_chat_id ? (
                                        <span className="text-[#059669] font-medium">Telegram terhubung</span>
                                    ) : (
                                        <span className="text-gray-400">Telegram belum terhubung</span>
                                    )}
                                </div>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-gray-400 mb-4">
                                Masuk: {new Date(tenant.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleOpenEditModal(tenant)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteTenant(tenant.id, tenant.nama_penghuni)}
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
                                onChange={(e) => setAddForm({ ...addForm, nama_penghuni: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="whatsapp">No. WhatsApp*</Label>
                            <Input
                                id="whatsapp"
                                placeholder="08xxxxxxxxxx"
                                value={addForm.nomor_kontak}
                                onChange={(e) => setAddForm({ ...addForm, nomor_kontak: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="ktp">No. KTP</Label>
                                <Input
                                    id="ktp"
                                    placeholder="16 digit"
                                    value={addForm.no_ktp}
                                    onChange={(e) => setAddForm({ ...addForm, no_ktp: e.target.value })}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="kamar">Kamar</Label>
                            <select
                                id="kamar"
                                value={addForm.kamar_id}
                                onChange={(e) => setAddForm({ ...addForm, kamar_id: e.target.value })}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="">Pilih Kamar</option>
                                {rooms.filter(r => r.status_kamar === 'Kosong').map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.nomor_kamar} — {room.tipe_kamar}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="telegram">Telegram Chat ID</Label>
                            <Input
                                id="telegram"
                                placeholder="Dapatkan dari bot Telegram dengan /start"
                                value={addForm.telegram_chat_id}
                                onChange={(e) => setAddForm({ ...addForm, telegram_chat_id: e.target.value })}
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-400 mt-1">Penghuni harus kirim /start ke bot Telegram untuk mendapatkan Chat ID</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleAddTenant} className="bg-[#059669] hover:bg-[#047857]">
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
                                onChange={(e) => setEditForm({ ...editForm, nama_penghuni: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="editWhatsapp">No. WhatsApp*</Label>
                            <Input
                                id="editWhatsapp"
                                placeholder="08xxxxxxxxxx"
                                value={editForm.nomor_kontak}
                                onChange={(e) => setEditForm({ ...editForm, nomor_kontak: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editEmail">Email</Label>
                                <Input
                                    id="editEmail"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="editKtp">No. KTP</Label>
                                <Input
                                    id="editKtp"
                                    placeholder="16 digit"
                                    value={editForm.no_ktp}
                                    onChange={(e) => setEditForm({ ...editForm, no_ktp: e.target.value })}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="editKamar">Kamar</Label>
                            <select
                                id="editKamar"
                                value={editForm.kamar_id}
                                onChange={(e) => setEditForm({ ...editForm, kamar_id: e.target.value })}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="">Tanpa Kamar</option>
                                {rooms
                                    .filter(r => r.status_kamar === 'Kosong' || (editingTenant && r.id === editingTenant.kamar_id))
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
                                onChange={(e) => setEditForm({ ...editForm, telegram_chat_id: e.target.value })}
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-400 mt-1">Penghuni harus kirim /start ke bot Telegram untuk mendapatkan Chat ID</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEditTenant} className="bg-[#059669] hover:bg-[#047857]">
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Penghuni;