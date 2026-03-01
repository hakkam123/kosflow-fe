import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Clock, CheckCircle2, AlertTriangle, Trash2, CreditCard, ExternalLink } from 'lucide-react';
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
import { formatDate } from '@/utils/formatDate';

const Tagihan = () => {
    const { toast } = useToast();
    const {
        billings, fetchBillings, generateBillings, createBilling,
        updateBilling, deleteBilling, createPayment, checkOverdue, isLoading,
    } = useBillingStore();
    const { tenants, fetchTenants } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();

    const [statusFilter, setStatusFilter] = useState('all');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);

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
        // Also check for overdue billings on page load
        checkOverdue();
    }, []);

    // Helper: get tenant/room from billing association data (from API) or fallback
    const getTenantName = (billing) => {
        return billing.tenant?.nama_penghuni || 'Unknown';
    };
    const getRoomNumber = (billing) => {
        return billing.tenant?.room?.nomor_kamar || '-';
    };

    // Calculate stats
    const stats = {
        menunggu: billings.filter(b => b.status_tagihan === 'Belum Bayar').length,
        lunas: billings.filter(b => b.status_tagihan === 'Lunas').length,
        terlambat: billings.filter(b => b.status_tagihan === 'Terlambat').length,
    };

    // Filter billings
    const filteredBillings = billings.filter((billing) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'menunggu') return billing.status_tagihan === 'Belum Bayar';
        if (statusFilter === 'lunas') return billing.status_tagihan === 'Lunas';
        if (statusFilter === 'terlambat') return billing.status_tagihan === 'Terlambat';
        return true;
    });

    const handleGenerateOtomatis = async () => {
        if (!generateForm.periode || !generateForm.tanggalJatuhTempo) {
            toast.error({ title: 'Error', description: 'Periode dan tanggal jatuh tempo wajib diisi' });
            return;
        }
        const result = await generateBillings({
            bulan_tagihan: generateForm.periode,
            tanggal_jatuh_tempo: generateForm.tanggalJatuhTempo,
        });
        if (result.success) {
            toast.success({
                title: 'Berhasil!',
                description: result.data?.message || 'Tagihan otomatis telah dibuat untuk semua penghuni',
            });
            setIsGenerateModalOpen(false);
            setGenerateForm({ periode: '', tanggalJatuhTempo: '' });
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
    };

    const handleTambahManual = async () => {
        if (!manualForm.penghuni || !manualForm.jumlah || !manualForm.jatuhTempo || !manualForm.periode) {
            toast.error({ title: 'Error', description: 'Semua field wajib diisi' });
            return;
        }
        const result = await createBilling({
            penghuni_id: parseInt(manualForm.penghuni),
            total_tagihan: parseInt(manualForm.jumlah),
            tanggal_jatuh_tempo: manualForm.jatuhTempo,
            bulan_tagihan: manualForm.periode,
        });
        if (result.success) {
            toast.success({
                title: 'Berhasil!',
                description: 'Tagihan manual telah ditambahkan',
            });
            setIsManualModalOpen(false);
            setManualForm({ penghuni: '', jumlah: '', jatuhTempo: '', periode: '' });
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
    };

    const handleDelete = async () => {
        if (!selectedBilling) return;
        const result = await deleteBilling(selectedBilling.id);
        if (result.success) {
            toast.success({ title: 'Berhasil', description: 'Tagihan berhasil dihapus' });
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
        setIsDeleteModalOpen(false);
        setSelectedBilling(null);
    };

    const handleMarkPaid = async (billing) => {
        const result = await updateBilling(billing.id, { status_tagihan: 'Lunas' });
        if (result.success) {
            toast.success({ title: 'Berhasil', description: 'Tagihan ditandai lunas' });
        } else {
            toast.error({ title: 'Gagal', description: result.error });
        }
    };

    const handlePayMidtrans = async (billing) => {
        const result = await createPayment(billing.id);
        if (result.success && result.data?.payment_url) {
            window.open(result.data.payment_url, '_blank');
        } else {
            toast.error({
                title: 'Gagal',
                description: result.error || 'Gagal membuat link pembayaran. Pastikan Midtrans sudah dikonfigurasi.',
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Lunas':
                return 'bg-blue-100 text-blue-700';
            case 'Terlambat':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-orange-100 text-orange-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Lunas':
                return 'Lunas';
            case 'Terlambat':
                return 'Terlambat';
            default:
                return 'Menunggu';
        }
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
                            {['all', 'menunggu', 'lunas', 'terlambat'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        statusFilter === filter
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter === 'all' ? 'Semua' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Billing Items */}
                <div className="divide-y divide-gray-100">
                    {isLoading && billings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Memuat tagihan...</p>
                        </div>
                    ) : filteredBillings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Tidak ada tagihan ditemukan</p>
                        </div>
                    ) : (
                        filteredBillings.map((billing) => {
                            const isPaid = billing.status_tagihan === 'Lunas';

                            return (
                                <div key={billing.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{getTenantName(billing)}</h4>
                                            <p className="text-sm text-gray-500">
                                                Kamar {getRoomNumber(billing)} — {billing.bulan_tagihan}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    Rp {billing.total_tagihan?.toLocaleString('id-ID')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Jatuh tempo: {formatDate(billing.tanggal_jatuh_tempo)}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(billing.status_tagihan)}`}>
                                                {getStatusLabel(billing.status_tagihan)}
                                            </span>

                                            {/* Action buttons */}
                                            {!isPaid && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleMarkPaid(billing)}
                                                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                        title="Tandai Lunas"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handlePayMidtrans(billing)}
                                                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                                        title="Bayar via Midtrans"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {billing.midtrans_payment_url && !isPaid && (
                                                <a
                                                    href={billing.midtrans_payment_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                                                    title="Buka Link Pembayaran"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => { setSelectedBilling(billing); setIsDeleteModalOpen(true); }}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
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
                        <Button onClick={handleGenerateOtomatis} disabled={isLoading} className="bg-[#059669] hover:bg-[#047857]">
                            {isLoading ? 'Memproses...' : 'Generate'}
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
                                onChange={(e) => {
                                    const tenantId = e.target.value;
                                    setManualForm({ ...manualForm, penghuni: tenantId });
                                    // Auto-fill jumlah from room price
                                    if (tenantId) {
                                        const tenant = tenants.find(t => t.id === parseInt(tenantId));
                                        const room = tenant ? rooms.find(r => r.id === tenant.kamar_id) : null;
                                        if (room) {
                                            setManualForm(prev => ({ ...prev, penghuni: tenantId, jumlah: String(room.harga_per_bulan) }));
                                        }
                                    }
                                }}
                                className="mt-2 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            >
                                <option value="">Pilih Penghuni</option>
                                {tenants.map((tenant) => {
                                    const room = rooms.find(r => r.id === tenant.kamar_id);
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
                        <Button onClick={handleTambahManual} disabled={isLoading} className="bg-[#059669] hover:bg-[#047857]">
                            {isLoading ? 'Memproses...' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Tagihan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan.
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

export default Tagihan;