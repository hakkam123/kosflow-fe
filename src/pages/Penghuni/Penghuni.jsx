import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Phone, Calendar } from 'lucide-react';
import { Button, Card, Input, Modal } from '../../components';
import { useTenantStore, useRoomStore } from '../../context';
import { formatDateShort } from '../../utils/formatDate';
import { ROOM_STATUS } from '../../config/constants';

const Penghuni = () => {
    const { tenants, fetchTenants, addTenant, updateTenant, deleteTenant, isLoading } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [formData, setFormData] = useState({
        nama_penghuni: '',
        nomor_kontak: '',
        tanggal_masuk: '',
        kamar_id: '',
    });

    useEffect(() => {
        fetchTenants();
        fetchRooms();
    }, []);

    const availableRooms = rooms.filter((r) => r.status_kamar === ROOM_STATUS.AVAILABLE);

    const filteredTenants = tenants.filter((tenant) =>
        tenant.nama_penghuni.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoomByTenantId = (kamarId) => {
        return rooms.find((r) => r.id === kamarId);
    };

    const handleOpenModal = (tenant = null) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                nama_penghuni: tenant.nama_penghuni,
                nomor_kontak: tenant.nomor_kontak,
                tanggal_masuk: tenant.tanggal_masuk,
                kamar_id: tenant.kamar_id?.toString() || '',
            });
        } else {
            setEditingTenant(null);
            setFormData({ nama_penghuni: '', nomor_kontak: '', tanggal_masuk: '', kamar_id: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTenant(null);
        setFormData({ nama_penghuni: '', nomor_kontak: '', tanggal_masuk: '', kamar_id: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            kamar_id: parseInt(formData.kamar_id),
        };

        if (editingTenant) {
            await updateTenant(editingTenant.id, data);
        } else {
            await addTenant(data);
        }
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus penghuni ini?')) {
            await deleteTenant(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Penghuni</h1>
                    <p className="text-gray-500">Kelola data penghuni kos</p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()}>
                    Tambah Penghuni
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Cari penghuni..."
                    icon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tenant List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTenants.map((tenant) => {
                    const room = getRoomByTenantId(tenant.kamar_id);

                    return (
                        <Card key={tenant.id}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-lg flex-shrink-0">
                                    {tenant.nama_penghuni.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{tenant.nama_penghuni}</h3>
                                    {room && (
                                        <p className="text-sm text-primary-600 font-medium">{room.nomor_kamar}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone className="h-4 w-4" />
                                    <span>{tenant.nomor_kontak}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Masuk: {formatDateShort(tenant.tanggal_masuk)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    icon={Edit2}
                                    onClick={() => handleOpenModal(tenant)}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={Trash2}
                                    onClick={() => handleDelete(tenant.id)}
                                    className="text-danger hover:bg-red-50"
                                />
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredTenants.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada penghuni ditemukan</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTenant ? 'Edit Penghuni' : 'Tambah Penghuni Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Penghuni"
                        placeholder="Nama lengkap penghuni"
                        value={formData.nama_penghuni}
                        onChange={(e) => setFormData({ ...formData, nama_penghuni: e.target.value })}
                        required
                    />
                    <Input
                        label="Nomor Kontak"
                        placeholder="08xxxxxxxxxx"
                        value={formData.nomor_kontak}
                        onChange={(e) => setFormData({ ...formData, nomor_kontak: e.target.value })}
                        required
                    />
                    <Input
                        label="Tanggal Masuk"
                        type="date"
                        value={formData.tanggal_masuk}
                        onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Kamar</label>
                        <select
                            value={formData.kamar_id}
                            onChange={(e) => setFormData({ ...formData, kamar_id: e.target.value })}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Pilih Kamar</option>
                            {/* Show current room if editing */}
                            {editingTenant && editingTenant.kamar_id && (
                                <option value={editingTenant.kamar_id}>
                                    {rooms.find((r) => r.id === editingTenant.kamar_id)?.nomor_kamar} (Saat ini)
                                </option>
                            )}
                            {availableRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.nomor_kamar} - {room.tipe_kamar}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" loading={isLoading} className="flex-1">
                            {editingTenant ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Penghuni;
