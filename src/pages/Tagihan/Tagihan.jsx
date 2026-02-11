import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBillingStore, useTenantStore, useRoomStore } from '../../context';
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

const Tagihan = () => {
    const { toast } = useToast();
    const { billings, fetchBillings, generateInvoice, isLoading } = useBillingStore();
    const { tenants, fetchTenants } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();

    const [statusFilter, setStatusFilter] = useState('all');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    // Generate Otomatis form
    const [generateForm, setGenerateForm] = useState({
        periode: '',
        tanggalJatuhTempo: '',
    });

    // Manual form
    const [manualForm, setManualForm] = useState({
        penghuni: '',
        jumlah: '',
        jatuhTempo: '',
        periode: '',
    });

    useEffect(() => {
        fetchBillings();
        fetchTenants();
        fetchRooms();
    }, []);

    const getTenantById = (id) => tenants.find((t) => t.id === id);
    const getRoomById = (id) => rooms.find((r) => r.id === id);

    // Calculate stats
    const stats = {
        menunggu: billings.filter(b => b.status_tagihan === 'Belum Bayar').length,
        lunas: billings.filter(b => b.status_tagihan === 'Lunas').length,
        terlambat: 0, // TODO: Calculate based on due date
    };

    // Filter billings
    const filteredBillings = billings.filter((billing) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'menunggu') return billing.status_tagihan === 'Belum Bayar';
        if (statusFilter === 'lunas') return billing.status_tagihan === 'Lunas';
        if (statusFilter === 'terlambat') return false; // TODO: Implement overdue logic
        return true;
    });

    const handleGenerateOtomatis = async () => {
        // TODO: Implement generate otomatis logic
        toast.success({
            title: 'Berhasil!',
            description: 'Tagihan otomatis telah dibuat untuk semua penghuni',
        });
        setIsGenerateModalOpen(false);
        setGenerateForm({ periode: '', tanggalJatuhTempo: '' });
    };

    const handleTambahManual = async () => {
        // TODO: Implement manual billing creation
        toast.success({
            title: 'Berhasil!',
            description: 'Tagihan manual telah ditambahkan',
        });
        setIsManualModalOpen(false);
        setManualForm({ penghuni: '', jumlah: '', jatuhTempo: '', periode: '' });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tagihan</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola Tagihan Bulanan</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsGenerateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all"
                    >
                        <Sparkles className="h-4 w-4" />
                        Generate Otomatis
                    </button>
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Tagihan
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Menunggu</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.menunggu}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Lunas</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.lunas}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Terlambat</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.terlambat}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Filter Tabs */}
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Daftar Tagihan</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setStatusFilter('menunggu')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'menunggu'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Menunggu
                            </button>
                            <button
                                onClick={() => setStatusFilter('lunas')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'lunas'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Lunas
                            </button>
                            <button
                                onClick={() => setStatusFilter('terlambat')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'terlambat'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Terlambat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Billing Items */}
                <div className="divide-y divide-gray-100">
                    {filteredBillings.map((billing) => {
                        const tenant = getTenantById(billing.penghuni_id);
                        const room = tenant ? getRoomById(tenant.kamar_id) : null;
                        const isPaid = billing.status_tagihan === 'Lunas';

                        return (
                            <div key={billing.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{tenant?.nama_penghuni || 'Unknown'}</h4>
                                        <p className="text-sm text-gray-500">
                                            {room?.nomor_kamar || '-'} - {billing.bulan_tagihan}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">Rp {billing.total_tagihan.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-500">Jatuh tempo: {billing.tanggal_jatuh_tempo || '25 Januari 2026'}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${isPaid
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}
                                        >
                                            {isPaid ? 'Lunas' : 'Menunggu'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredBillings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Tidak ada tagihan ditemukan</p>
                    </div>
                )}
            </div>

            {/* Generate Otomatis Modal */}
            <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate Tagihan Otomatis</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="periode">Periode*</Label>
                            <Input
                                id="periode"
                                type="month"
                                value={generateForm.periode}
                                onChange={(e) => setGenerateForm({ ...generateForm, periode: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="tanggalJatuhTempo">Tanggal Jatuh Tempo*</Label>
                            <Input
                                id="tanggalJatuhTempo"
                                type="date"
                                value={generateForm.tanggalJatuhTempo}
                                onChange={(e) => setGenerateForm({ ...generateForm, tanggalJatuhTempo: e.target.value })}
                                className="mt-2"
                            />
                        </div>

                        <p className="text-sm text-gray-500">
                            Tagihan akan dibuat untuk semua penghuni aktif dengan harga sesuai kamar masing-masing
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleGenerateOtomatis} className="bg-[#059669] hover:bg-[#047857]">
                            Generate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Tambah Tagihan Manual Modal */}
            <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Tagihan Manual</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="penghuni">Penghuni*</Label>
                            <select
                                id="penghuni"
                                value={manualForm.penghuni}
                                onChange={(e) => setManualForm({ ...manualForm, penghuni: e.target.value })}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="">Pilih Penghuni</option>
                                {tenants.map((tenant) => {
                                    const room = getRoomById(tenant.kamar_id);
                                    return (
                                        <option key={tenant.id} value={tenant.id}>
                                            {tenant.nama_penghuni} - {room?.nomor_kamar || '-'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="jumlah">Jumlah*</Label>
                                <Input
                                    id="jumlah"
                                    type="number"
                                    placeholder="800000"
                                    value={manualForm.jumlah}
                                    onChange={(e) => setManualForm({ ...manualForm, jumlah: e.target.value })}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="jatuhTempo">Jatuh Tempo*</Label>
                                <Input
                                    id="jatuhTempo"
                                    type="date"
                                    value={manualForm.jatuhTempo}
                                    onChange={(e) => setManualForm({ ...manualForm, jatuhTempo: e.target.value })}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="periodeManual">Periode*</Label>
                            <Input
                                id="periodeManual"
                                type="month"
                                value={manualForm.periode}
                                onChange={(e) => setManualForm({ ...manualForm, periode: e.target.value })}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsManualModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleTambahManual} className="bg-[#059669] hover:bg-[#047857]">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Tagihan;