import React, { useEffect, useMemo } from 'react';
import {
    DoorOpen,
    Users,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    Clock,
    UserCheck,
    AlertCircle,
} from 'lucide-react';
import { useRoomStore } from '../../context/roomStore';
import { useTenantStore } from '../../context/tenantStore';
import { useBillingStore } from '../../context/billingStore';
import { formatRupiah } from '../../utils/formatRupiah';

/**
 * Komponen StatsCard - Menampilkan kartu statistik dengan ikon, nilai, dan judul.
 */
const StatsCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
            </div>
        </div>
    );
};

/**
 * Komponen OverduePaymentItem - Menampilkan baris item untuk pembayaran yang terlambat.
 */
const OverduePaymentItem = ({ payment }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
                <p className="font-medium text-gray-900">{payment.penghuni?.nama_lengkap || 'Penghuni'}</p>
                <p className="text-sm text-gray-500">Kamar {payment.penghuni?.kamar_id || '-'}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700`}>
                    Terlambat
                </span>
                <p className="font-semibold text-gray-900 min-w-[100px] text-right">
                    {formatRupiah(payment.total_tagihan || payment.jumlah_tagihan)}
                </p>
            </div>
        </div>
    );
};

/**
 * Komponen ActivityItem - Menampilkan baris item untuk aktivitas terbaru di sistem.
 */
const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
            <div className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed">{activity.title}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
        </div>
    );
};

/**
 * Komponen Utama Dashboard - Menampilkan ringkasan statistik kos (pendapatan, ketersediaan kamar, tagihan jatuh tempo, aktivitas terbaru).
 * 
 * @returns {JSX.Element} Halaman Dashboard Utama.
 */
const Dashboard = () => {
    const { rooms, fetchRooms } = useRoomStore();
    const { tenants, fetchTenants } = useTenantStore();
    const { billings, fetchBillings } = useBillingStore();

    useEffect(() => {
        fetchRooms();
        fetchTenants();
        fetchBillings();
    }, [fetchRooms, fetchTenants, fetchBillings]);

    // Derived Statistics
    const stats = useMemo(() => {
        const pendingBillings = billings.filter(b => 
            b.status_tagihan === 'Belum Bayar' || b.status_pembayaran === 'Belum Lunas'
        );
        const overdueBillings = billings.filter(b => 
            b.status_tagihan === 'Terlambat' || b.status_pembayaran === 'Overdue'
        );
        
        const totalPendingAmount = pendingBillings.reduce((sum, b) => sum + (b.total_tagihan || b.jumlah_tagihan), 0);
        const totalOverdueAmount = overdueBillings.reduce((sum, b) => sum + (b.total_tagihan || b.jumlah_tagihan), 0);

        return [
            {
                id: 1,
                title: 'Total Kamar',
                value: rooms.length,
                subtitle: 'Kamar Terdaftar',
                icon: DoorOpen,
                iconBg: 'bg-[#059669]/10',
                iconColor: 'text-[#059669]',
            },
            {
                id: 2,
                title: 'Penghuni',
                value: tenants.length,
                subtitle: 'Aktif',
                icon: Users,
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
            },
            {
                id: 3,
                title: 'Menunggu',
                value: formatRupiah(totalPendingAmount),
                subtitle: 'Tagihan Berjalan',
                icon: Wallet,
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-600',
            },
            {
                id: 4,
                title: 'Terlambat',
                value: formatRupiah(totalOverdueAmount),
                subtitle: 'Belum dibayar',
                icon: AlertTriangle,
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
            },
        ];
    }, [rooms, tenants, billings]);

    const overdueList = useMemo(() => {
        return billings.filter(b => b.status_tagihan === 'Terlambat' || b.status_pembayaran === 'Overdue').slice(0, 5);
    }, [billings]);

    // Mock activities for now as there's no activity service yet
    const recentActivities = [
        {
            id: 1,
            icon: CheckCircle2,
            iconBg: 'bg-[#059669]/10',
            iconColor: 'text-[#059669]',
            title: 'Sistem siap digunakan',
            time: 'Baru saja',
        },
    ];

    const occupiedCount = rooms.filter(r => r.status_kamar === 'Terisi').length;
    const incomeThisMonth = billings
        .filter(b => (b.status_tagihan === 'Lunas' || b.status_pembayaran === 'Terbayar'))
        .reduce((sum, b) => sum + (b.total_tagihan || b.jumlah_tagihan), 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Selamat Datang di KosFlow</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <StatsCard key={stat.id} stat={stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Pendapatan Bulan ini */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-[#059669]" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Total Pendapatan Terbayar</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#059669]">{formatRupiah(incomeThisMonth)}</p>
                </div>

                {/* Ketersediaan Kamar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Ketersediaan Kamar</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                        {occupiedCount} <span className="text-gray-400 text-lg">dari {rooms.length} kamar terisi</span>
                    </p>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Jatuh Tempo Segera */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Jatuh Tempo / Terlambat</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="divide-y divide-gray-100">
                            {overdueList.length > 0 ? (
                                overdueList.map((payment) => (
                                    <OverduePaymentItem key={payment.id} payment={payment} />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Tidak ada tagihan terlambat</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Aktivitas Terbaru */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Status Sistem</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-1">
                            {recentActivities.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
