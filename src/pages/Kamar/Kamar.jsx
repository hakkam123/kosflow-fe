import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button, Card, Input, Modal } from '../../components';
import { useRoomStore, useTenantStore } from '../../context';
import { formatRupiah } from '../../utils/formatRupiah';
import { ROOM_STATUS } from '../../config/constants';

const Kamar = () => {
    const { rooms, fetchRooms, addRoom, updateRoom, deleteRoom, isLoading } = useRoomStore();
    const { tenants } = useTenantStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        nomor_kamar: '',
        tipe_kamar: 'Standard',
        harga_per_bulan: '',
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const filteredRooms = rooms.filter((room) =>
        room.nomor_kamar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTenantByRoomId = (roomId) => {
        return tenants.find((t) => t.kamar_id === roomId);
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                nomor_kamar: room.nomor_kamar,
                tipe_kamar: room.tipe_kamar,
                harga_per_bulan: room.harga_per_bulan.toString(),
            });
        } else {
            setEditingRoom(null);
            setFormData({ nomor_kamar: '', tipe_kamar: 'Standard', harga_per_bulan: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
        setFormData({ nomor_kamar: '', tipe_kamar: 'Standard', harga_per_bulan: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            harga_per_bulan: parseInt(formData.harga_per_bulan),
        };

        if (editingRoom) {
            await updateRoom(editingRoom.id, data);
        } else {
            await addRoom(data);
        }
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
            await deleteRoom(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kamar</h1>
                    <p className="text-gray-500">Kelola data kamar kos</p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()}>
                    Tambah Kamar
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Cari kamar..."
                    icon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => {
                    const tenant = getTenantByRoomId(room.id);
                    const isOccupied = room.status_kamar === ROOM_STATUS.OCCUPIED;

                    return (
                        <Card key={room.id} className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{room.nomor_kamar}</h3>
                                    <p className="text-sm text-gray-500">{room.tipe_kamar}</p>
                                </div>
                                <span
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${isOccupied
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}
                                >
                                    {room.status_kamar}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Harga/bulan</span>
                                    <span className="font-medium text-gray-900">
                                        {formatRupiah(room.harga_per_bulan)}
                                    </span>
                                </div>
                                {tenant && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Penghuni</span>
                                        <span className="font-medium text-gray-900">{tenant.nama_penghuni}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    icon={Edit2}
                                    onClick={() => handleOpenModal(room)}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={Trash2}
                                    onClick={() => handleDelete(room.id)}
                                    className="text-danger hover:bg-red-50"
                                    disabled={isOccupied}
                                />
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredRooms.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada kamar ditemukan</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nomor Kamar"
                        placeholder="Contoh: Kamar 01"
                        value={formData.nomor_kamar}
                        onChange={(e) => setFormData({ ...formData, nomor_kamar: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Tipe Kamar</label>
                        <select
                            value={formData.tipe_kamar}
                            onChange={(e) => setFormData({ ...formData, tipe_kamar: e.target.value })}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <Input
                        label="Harga per Bulan"
                        type="number"
                        placeholder="800000"
                        value={formData.harga_per_bulan}
                        onChange={(e) => setFormData({ ...formData, harga_per_bulan: e.target.value })}
                        required
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" loading={isLoading} className="flex-1">
                            {editingRoom ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Kamar;
