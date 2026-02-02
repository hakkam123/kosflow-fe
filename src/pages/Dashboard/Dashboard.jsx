import React, { useEffect } from 'react';
import {
    Building2,
    Users,
    Receipt,
    AlertTriangle,
    TrendingUp,
    CheckCircle2,
    Clock,
    Activity,
} from 'lucide-react';
import { MetricCard, Card } from '../../components';
import { useRoomStore, useTenantStore, useBillingStore } from '../../context';
import { formatRupiah } from '../../utils/formatRupiah';
import { getCurrentMonthName } from '../../utils/formatDate';
import { ROOM_STATUS, BILLING_STATUS } from '../../config/constants';

const Dashboard = () => {
    const { rooms, fetchRooms } = useRoomStore();
    const { tenants, fetchTenants } = useTenantStore();
    const { billings, fetchBillings } = useBillingStore();

    useEffect(() => {
        fetchRooms();
        fetchTenants();
        fetchBillings();
    }, []);

    // Calculate metrics
    const totalRooms = rooms.length;
    const totalTenants = tenants.length;
    const availableRooms = rooms.filter((r) => r.status_kamar === ROOM_STATUS.AVAILABLE).length;
    const pendingBillings = billings.filter((b) => b.status_tagihan === BILLING_STATUS.UNPAID);
    const pendingAmount = pendingBillings.reduce((sum, b) => sum + b.total_tagihan, 0);

    // Calculate monthly income (paid bills this month)
    const monthlyIncome = billings
        .filter((b) => b.status_tagihan === BILLING_STATUS.PAID)
        .reduce((sum, b) => sum + b.total_tagihan, 0);

    // Get tenant name by ID
    const getTenantName = (tenantId) => {
        const tenant = tenants.find((t) => t.id === tenantId);
        return tenant?.nama_penghuni || 'Unknown';
    };

    // Get room name by tenant's room ID
    const getRoomName = (tenantId) => {
        const tenant = tenants.find((t) => t.id === tenantId);
        if (!tenant) return '-';
        const room = rooms.find((r) => r.id === tenant.kamar_id);
        return room?.nomor_kamar || '-';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Selamat datang di KosFlow</p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Kamar"
                    value={totalRooms}
                    subtitle={`${totalRooms} dihuni`}
                    icon={Building2}
                    color="primary"
                />
                <MetricCard
                    title="Penghuni"
                    value={totalTenants}
                    subtitle="Aktif"
                    icon={Users}
                    color="info"
                />
                <MetricCard
                    title="Menunggu Bayar"
                    value={formatRupiah(pendingAmount)}
                    subtitle={`${pendingBillings.length} tagihan`}
                    icon={Receipt}
                    color="warning"
                />
                <MetricCard
                    title="Terlambat"
                    value={formatRupiah(0)}
                    subtitle="Belum dibayar"
                    icon={AlertTriangle}
                    color="danger"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pendapatan Bulan Ini</p>
                        <p className="text-2xl font-bold text-green-600">{formatRupiah(monthlyIncome)}</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Ketersediaan Kamar</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {availableRooms} <span className="text-sm font-normal text-gray-400">dari {totalRooms} kamar tersedia</span>
                        </p>
                    </div>
                </Card>
            </div>

            {/* Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Due Soon */}
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-gray-900">Jatuh Tempo Segera</h3>
                    </div>
                    {pendingBillings.length === 0 ? (
                        <p className="text-gray-400 text-sm">Tidak ada tagihan yang jatuh tempo dalam 7 hari</p>
                    ) : (
                        <div className="space-y-3">
                            {pendingBillings.slice(0, 3).map((billing) => (
                                <div key={billing.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{getTenantName(billing.penghuni_id)}</p>
                                        <p className="text-sm text-gray-400">{getRoomName(billing.penghuni_id)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatRupiah(billing.total_tagihan)}</p>
                                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                                            Menunggu
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Recent Activity */}
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-primary-500" />
                        <h3 className="font-semibold text-gray-900">Aktivitas Terbaru</h3>
                    </div>
                    {pendingBillings.length === 0 && tenants.length === 0 ? (
                        <p className="text-gray-400 text-sm">Belum ada aktivitas terbaru</p>
                    ) : (
                        <div className="space-y-3">
                            {pendingBillings.slice(0, 3).map((billing) => (
                                <div key={billing.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <Receipt className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{getTenantName(billing.penghuni_id)}</p>
                                            <p className="text-sm text-gray-400">{getRoomName(billing.penghuni_id)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatRupiah(billing.total_tagihan)}</p>
                                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                                            Menunggu
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
