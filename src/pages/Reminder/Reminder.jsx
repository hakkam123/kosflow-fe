import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Send } from 'lucide-react';
import { useTenantStore, useRoomStore } from '../../context';
import { useReminderStore } from '../../context/reminderStore';
import { useToast } from '@/components/ui/toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Reminder = () => {
    const { toast } = useToast();
    const { tenants, fetchTenants } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();
    const {
        reminders, fetchReminders, createReminder, updateReminder, deleteReminder, isLoading,
    } = useReminderStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        hari_sebelum_jatuh_tempo: '',
        pesan_custom: '',
        aktif: true,
    });
    const [testingId, setTestingId] = useState(null);

    useEffect(() => {
        fetchTenants();
        fetchRooms();
        fetchReminders();
    }, []);

    const getRoomForTenant = (tenant) => {
        return rooms.find(r => r.id === tenant.kamar_id);
    };

    const getRemindersForTenant = (tenantId) => {
        return reminders.filter(r => r.penghuni_id === tenantId);
    };

    const filteredTenants = tenants.filter(t => {
        if (!searchQuery) return true;
        const room = getRoomForTenant(t);
        const q = searchQuery.toLowerCase();
        return (
            t.nama_penghuni.toLowerCase().includes(q) ||
            (room?.nomor_kamar || '').toLowerCase().includes(q)
        );
    });

    const openAddModal = (tenant) => {
        setSelectedTenant(tenant);
        setIsEditing(false);
        setSelectedReminder(null);
        setForm({ hari_sebelum_jatuh_tempo: '', pesan_custom: '', aktif: true });
        setIsModalOpen(true);
    };

    const openEditModal = (tenant, reminder) => {
        setSelectedTenant(tenant);
        setIsEditing(true);
        setSelectedReminder(reminder);
        setForm({
            hari_sebelum_jatuh_tempo: String(reminder.hari_sebelum_jatuh_tempo),
            pesan_custom: reminder.pesan_custom || '',
            aktif: reminder.aktif,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.hari_sebelum_jatuh_tempo) {
            toast.error({ title: 'Error', description: 'Hari sebelum jatuh tempo wajib diisi' });
            return;
        }

        const data = {
            penghuni_id: selectedTenant.id,
            hari_sebelum_jatuh_tempo: parseInt(form.hari_sebelum_jatuh_tempo),
            pesan_custom: form.pesan_custom || null,
            aktif: form.aktif,
        };

        let result;
        if (isEditing && selectedReminder) {
            result = await updateReminder(selectedReminder.id, data);
        } else {
            result = await createReminder(data);
        }

        if (result.success) {
            toast.success({
                title: 'Berhasil',
                description: isEditing ? 'Reminder berhasil diperbarui' : 'Reminder berhasil ditambahkan',
            });
            setIsModalOpen(false);
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
    };

    const handleDelete = async () => {
        if (!selectedReminder) return;
        const result = await deleteReminder(selectedReminder.id);
        if (result.success) {
            toast.success({ title: 'Berhasil', description: 'Reminder berhasil dihapus' });
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
        setIsDeleteModalOpen(false);
        setSelectedReminder(null);
    };

    const handleTestSend = async (reminder) => {
        setTestingId(reminder.id);
        try {
            const { default: reminderService } = await import('../../services/reminderService');
            const result = await reminderService.testSend(reminder.id);
            if (result.success) {
                toast.success({ title: 'Berhasil', description: result.message });
            } else {
                toast.error({ title: 'Gagal', description: result.message });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal mengirim test reminder';
            toast.error({ title: 'Gagal', description: msg });
        } finally {
            setTestingId(null);
        }
    };

    const handleToggleActive = async (reminder) => {
        const result = await updateReminder(reminder.id, { aktif: !reminder.aktif });
        if (result.success) {
            toast.success({
                title: 'Berhasil',
                description: `Reminder ${!reminder.aktif ? 'diaktifkan' : 'dinonaktifkan'}`,
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reminder</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Kelola pengingat tagihan via Telegram per penghuni
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari penghuni atau kamar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                />
            </div>

            {/* Tenant Cards with Reminders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTenants.map((tenant) => {
                    const room = getRoomForTenant(tenant);
                    const tenantReminders = getRemindersForTenant(tenant.id);

                    return (
                        <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Tenant Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{tenant.nama_penghuni}</h3>
                                        <p className="text-sm text-gray-500">
                                            Kamar {room?.nomor_kamar || '-'}
                                            {tenant.telegram_chat_id
                                                ? <span className="ml-2 text-green-600 text-xs">● Telegram aktif</span>
                                                : <span className="ml-2 text-orange-500 text-xs">● Telegram belum terhubung</span>
                                            }
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => openAddModal(tenant)}
                                        className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                        title="Tambah Reminder"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Reminder List */}
                            <div className="divide-y divide-gray-50">
                                {tenantReminders.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Belum ada reminder</p>
                                    </div>
                                ) : (
                                    tenantReminders.map((reminder) => (
                                        <div key={reminder.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleToggleActive(reminder)}
                                                    className="flex-shrink-0"
                                                    title={reminder.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {reminder.aktif ? (
                                                        <ToggleRight className="h-6 w-6 text-green-500" />
                                                    ) : (
                                                        <ToggleLeft className="h-6 w-6 text-gray-300" />
                                                    )}
                                                </button>
                                                <div>
                                                    <p className={`text-sm font-medium ${reminder.aktif ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        H-{reminder.hari_sebelum_jatuh_tempo}
                                                    </p>
                                                    {reminder.pesan_custom && (
                                                        <p className="text-xs text-gray-400 truncate max-w-[140px]">
                                                            {reminder.pesan_custom}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleTestSend(reminder)}
                                                    disabled={testingId === reminder.id}
                                                    className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
                                                    title="Test kirim ke Telegram"
                                                >
                                                    <Send className={`h-3.5 w-3.5 ${testingId === reminder.id ? 'animate-pulse' : ''}`} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(tenant, reminder)}
                                                    className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedReminder(reminder); setIsDeleteModalOpen(true); }}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredTenants.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada penghuni ditemukan</p>
                </div>
            )}

            {/* Add/Edit Reminder Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit Reminder' : 'Tambah Reminder'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedTenant?.nama_penghuni} — Kamar {getRoomForTenant(selectedTenant || {})?.nomor_kamar || '-'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="hari">Hari Sebelum Jatuh Tempo (H-X)*</Label>
                            <Input
                                id="hari"
                                type="number"
                                min="0"
                                max="30"
                                placeholder="Contoh: 5 (untuk H-5)"
                                value={form.hari_sebelum_jatuh_tempo}
                                onChange={(e) => setForm({ ...form, hari_sebelum_jatuh_tempo: e.target.value })}
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                0 = hari jatuh tempo, 1 = H-1, 3 = H-3, dst.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="pesan">Pesan Custom (opsional)</Label>
                            <textarea
                                id="pesan"
                                rows={3}
                                placeholder="Kosongkan untuk pesan default. Variabel: {nama}, {kamar}, {bulan}, {total}, {jatuh_tempo}, {hari}"
                                value={form.pesan_custom}
                                onChange={(e) => setForm({ ...form, pesan_custom: e.target.value })}
                                className="mt-2 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Label htmlFor="aktif" className="flex-1">Aktifkan Reminder</Label>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, aktif: !form.aktif })}
                                className="flex-shrink-0"
                            >
                                {form.aktif ? (
                                    <ToggleRight className="h-8 w-8 text-green-500" />
                                ) : (
                                    <ToggleLeft className="h-8 w-8 text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#059669] hover:bg-[#047857]">
                            {isLoading ? 'Memproses...' : isEditing ? 'Simpan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Reminder</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus reminder H-{selectedReminder?.hari_sebelum_jatuh_tempo} ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Reminder;
