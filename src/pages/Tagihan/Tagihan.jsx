import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button, Card, Input, Modal } from '../../components';
import { useBillingStore, useTenantStore, useRoomStore } from '../../context';
import { formatRupiah } from '../../utils/formatRupiah';
import { formatDateShort, getCurrentMonthName } from '../../utils/formatDate';
import { BILLING_STATUS, PAYMENT_METHODS } from '../../config/constants';

const Tagihan = () => {
    const { billings, fetchBillings, generateInvoice, recordPayment, hasBillingForCurrentMonth, isLoading } = useBillingStore();
    const { tenants, fetchTenants } = useTenantStore();
    const { rooms, fetchRooms } = useRoomStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [paymentData, setPaymentData] = useState({
        jumlah_bayar: '',
        metode_bayar: 'transfer',
        bukti_bayar: '',
    });
    const [selectedTenantForInvoice, setSelectedTenantForInvoice] = useState('');

    useEffect(() => {
        fetchBillings();
        fetchTenants();
        fetchRooms();
    }, []);

    // Get tenants without billing for current month
    const tenantsWithoutInvoice = tenants.filter((t) => !hasBillingForCurrentMonth(t.id));

    const getTenantById = (id) => tenants.find((t) => t.id === id);
    const getRoomById = (id) => rooms.find((r) => r.id === id);

    const filteredBillings = billings.filter((billing) => {
        const tenant = getTenantById(billing.penghuni_id);
        const matchesSearch = tenant?.nama_penghuni.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'unpaid' && billing.status_tagihan === BILLING_STATUS.UNPAID) ||
            (statusFilter === 'paid' && billing.status_tagihan === BILLING_STATUS.PAID);
        return matchesSearch && matchesStatus;
    });

    const handleOpenPaymentModal = (billing) => {
        setSelectedBilling(billing);
        setPaymentData({
            jumlah_bayar: billing.total_tagihan.toString(),
            metode_bayar: 'transfer',
            bukti_bayar: '',
        });
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedBilling(null);
        setPaymentData({ jumlah_bayar: '', metode_bayar: 'transfer', bukti_bayar: '' });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        await recordPayment({
            tagihan_id: selectedBilling.id,
            jumlah_bayar: parseInt(paymentData.jumlah_bayar),
            metode_bayar: paymentData.metode_bayar,
            bukti_bayar: paymentData.bukti_bayar,
        });
        handleClosePaymentModal();
    };

    const handleGenerateInvoice = async () => {
        if (!selectedTenantForInvoice) return;

        const tenant = tenants.find((t) => t.id === parseInt(selectedTenantForInvoice));
        const room = rooms.find((r) => r.id === tenant?.kamar_id);

        if (room) {
            await generateInvoice(tenant.id, room.harga_per_bulan);
        }

        setIsGenerateModalOpen(false);
        setSelectedTenantForInvoice('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tagihan</h1>
                    <p className="text-gray-500">Kelola tagihan dan pembayaran</p>
                </div>
                {tenantsWithoutInvoice.length > 0 && (
                    <Button icon={Plus} onClick={() => setIsGenerateModalOpen(true)}>
                        Generate Tagihan
                    </Button>
                )}
            </div>

            {/* Invoice Generation Alert */}
            {tenantsWithoutInvoice.length > 0 && (
                <Card className="bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-900">
                                {tenantsWithoutInvoice.length} penghuni belum memiliki tagihan bulan {getCurrentMonthName()}
                            </p>
                            <p className="text-sm text-amber-700">
                                Klik tombol "Generate Tagihan" untuk membuat tagihan bulanan
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="max-w-md flex-1">
                    <Input
                        placeholder="Cari nama penghuni..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={statusFilter === 'all' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                    >
                        Semua
                    </Button>
                    <Button
                        variant={statusFilter === 'unpaid' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('unpaid')}
                    >
                        Belum Bayar
                    </Button>
                    <Button
                        variant={statusFilter === 'paid' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('paid')}
                    >
                        Lunas
                    </Button>
                </div>
            </div>

            {/* Billing List */}
            <div className="space-y-3">
                {filteredBillings.map((billing) => {
                    const tenant = getTenantById(billing.penghuni_id);
                    const room = tenant ? getRoomById(tenant.kamar_id) : null;
                    const isPaid = billing.status_tagihan === BILLING_STATUS.PAID;

                    return (
                        <Card key={billing.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isPaid ? 'bg-green-100' : 'bg-amber-100'}`}>
                                    {isPaid ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-amber-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{tenant?.nama_penghuni || 'Unknown'}</h3>
                                    <p className="text-sm text-gray-500">
                                        {room?.nomor_kamar || '-'} • Tagihan {billing.bulan_tagihan}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{formatRupiah(billing.total_tagihan)}</p>
                                    <span
                                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${isPaid
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        {billing.status_tagihan}
                                    </span>
                                </div>
                                {!isPaid && (
                                    <Button
                                        size="sm"
                                        icon={CreditCard}
                                        onClick={() => handleOpenPaymentModal(billing)}
                                    >
                                        Bayar
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredBillings.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada tagihan ditemukan</p>
                </div>
            )}

            {/* Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                title="Catat Pembayaran"
            >
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <Input
                        label="Jumlah Bayar"
                        type="number"
                        value={paymentData.jumlah_bayar}
                        onChange={(e) => setPaymentData({ ...paymentData, jumlah_bayar: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                        <select
                            value={paymentData.metode_bayar}
                            onChange={(e) => setPaymentData({ ...paymentData, metode_bayar: e.target.value })}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {PAYMENT_METHODS.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Bukti Bayar (URL/Catatan)"
                        placeholder="Link bukti pembayaran atau catatan"
                        value={paymentData.bukti_bayar}
                        onChange={(e) => setPaymentData({ ...paymentData, bukti_bayar: e.target.value })}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClosePaymentModal} className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" loading={isLoading} className="flex-1">
                            Konfirmasi Pembayaran
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Generate Invoice Modal */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title={`Generate Tagihan ${getCurrentMonthName()}`}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Pilih penghuni yang akan dibuatkan tagihan bulan ini. Nominal tagihan akan diambil dari harga kamar.
                    </p>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Pilih Penghuni</label>
                        <select
                            value={selectedTenantForInvoice}
                            onChange={(e) => setSelectedTenantForInvoice(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Pilih Penghuni</option>
                            {tenantsWithoutInvoice.map((tenant) => {
                                const room = getRoomById(tenant.kamar_id);
                                return (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.nama_penghuni} - {room?.nomor_kamar || '-'} ({formatRupiah(room?.harga_per_bulan || 0)})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsGenerateModalOpen(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleGenerateInvoice}
                            disabled={!selectedTenantForInvoice}
                            loading={isLoading}
                            className="flex-1"
                        >
                            Generate Tagihan
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Tagihan;