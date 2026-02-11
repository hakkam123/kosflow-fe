import React, { useState, useEffect } from 'react';
import { Plus, Home } from 'lucide-react';
import { useRoomStore, useTenantStore } from '../../context';
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
import { formatRupiah } from '../../utils/formatRupiah';

const Kamar = () => {
    const { toast } = useToast();
    const { rooms, fetchRooms, addRoom, updateRoom, deleteRoom, isLoading } = useRoomStore();
    const { tenants } = useTenantStore();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const [addForm, setAddForm] = useState({
        nomor_kamar: '',
        tipe_kamar: 'Standard',
        harga_per_bulan: '',
    });

    const [editForm, setEditForm] = useState({
        nomor_kamar: '',
        tipe_kamar: 'Standard',
        harga_per_bulan: '',
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const getTenantByRoomId = (roomId) => {
        return tenants.find((t) => t.kamar_id === roomId);
    };

    const handleOpenAddModal = () => {
        setAddForm({
            nomor_kamar: '',
            tipe_kamar: 'Standard',
            harga_per_bulan: '',
        });
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (room) => {
        setEditingRoom(room);
        setEditForm({
            nomor_kamar: room.nomor_kamar,
            tipe_kamar: room.tipe_kamar,
            harga_per_bulan: room.harga_per_bulan.toString(),
        });
        setIsEditModalOpen(true);
    };

    const handleAddRoom = async () => {
        const data = {
            ...addForm,
            harga_per_bulan: parseInt(addForm.harga_per_bulan),
        };

        await addRoom(data);
        toast.success({
            title: 'Berhasil!',
            description: 'Kamar baru telah ditambahkan',
        });
        setIsAddModalOpen(false);
    };

    const handleEditRoom = async () => {
        const data = {
            ...editForm,
            harga_per_bulan: parseInt(editForm.harga_per_bulan),
        };

        await updateRoom(editingRoom.id, data);
        toast.success({
            title: 'Berhasil!',
            description: 'Data kamar telah diperbarui',
        });
        setIsEditModalOpen(false);
    };

    const handleDeleteRoom = async (id, roomNumber) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${roomNumber}?`)) {
            await deleteRoom(id);
            toast.success({
                title: 'Berhasil!',
                description: 'Kamar telah dihapus',
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kamar</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola data kamar kos</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kamar
                </button>
            </div>

            {/* Room Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => {
                    const tenant = getTenantByRoomId(room.id);
                    const isOccupied = room.status_kamar === 'Terisi';

                    return (
                        <div key={room.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {/* Header with Icon and Room Number */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-[#059669]/10 flex items-center justify-center flex-shrink-0">
                                        <Home className="h-6 w-6 text-[#059669]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{room.nomor_kamar}</h3>
                                        <p className="text-sm text-gray-500">{room.tipe_kamar}</p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${isOccupied
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}
                                >
                                    {room.status_kamar}
                                </span>
                            </div>

                            {/* Room Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Harga/bulan</span>
                                    <span className="font-semibold text-gray-900">{formatRupiah(room.harga_per_bulan)}</span>
                                </div>
                                {tenant && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Penghuni</span>
                                        <span className="font-medium text-gray-900">{tenant.nama_penghuni}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleOpenEditModal(room)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRoom(room.id, room.nomor_kamar)}
                                    disabled={isOccupied}
                                    className="px-4 py-2 bg-white border border-gray-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {rooms.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada kamar ditemukan</p>
                </div>
            )}

            {/* Add Room Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Kamar Baru</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="nomorKamar">Nomor Kamar*</Label>
                            <Input
                                id="nomorKamar"
                                placeholder="Contoh: Kamar 01"
                                value={addForm.nomor_kamar}
                                onChange={(e) => setAddForm({ ...addForm, nomor_kamar: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="tipeKamar">Tipe Kamar*</Label>
                            <select
                                id="tipeKamar"
                                value={addForm.tipe_kamar}
                                onChange={(e) => setAddForm({ ...addForm, tipe_kamar: e.target.value })}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="harga">Harga per Bulan*</Label>
                            <Input
                                id="harga"
                                type="number"
                                placeholder="800000"
                                value={addForm.harga_per_bulan}
                                onChange={(e) => setAddForm({ ...addForm, harga_per_bulan: e.target.value })}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleAddRoom} className="bg-[#059669] hover:bg-[#047857]">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Room Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Kamar</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="editNomorKamar">Nomor Kamar*</Label>
                            <Input
                                id="editNomorKamar"
                                placeholder="Contoh: Kamar 01"
                                value={editForm.nomor_kamar}
                                onChange={(e) => setEditForm({ ...editForm, nomor_kamar: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="editTipeKamar">Tipe Kamar*</Label>
                            <select
                                id="editTipeKamar"
                                value={editForm.tipe_kamar}
                                onChange={(e) => setEditForm({ ...editForm, tipe_kamar: e.target.value })}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="editHarga">Harga per Bulan*</Label>
                            <Input
                                id="editHarga"
                                type="number"
                                placeholder="800000"
                                value={editForm.harga_per_bulan}
                                onChange={(e) => setEditForm({ ...editForm, harga_per_bulan: e.target.value })}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEditRoom} className="bg-[#059669] hover:bg-[#047857]">
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Kamar;