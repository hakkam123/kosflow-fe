import React from 'react';
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

// Sample data matching the image
const statsData = [
    {
        id: 1,
        title: 'Total Kamar',
        value: '1',
        subtitle: 'Ofhuni',
        icon: DoorOpen,
        iconBg: 'bg-[#059669]/10',
        iconColor: 'text-[#059669]',
    },
    {
        id: 2,
        title: 'Penghuni',
        value: '1',
        subtitle: 'Aktif',
        icon: Users,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        id: 3,
        title: 'Menunggu',
        value: 'Rp 800.000',
        subtitle: 'Tagihan',
        icon: Wallet,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
    },
    {
        id: 4,
        title: 'Terlambat',
        value: 'Rp 800.000',
        subtitle: 'Belum dibayar',
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
    },
];

const overduePayments = [
    {
        id: 1,
        name: 'Muhammad Bilal Abdurrhman',
        room: 'Kamar 01',
        amount: 'Rp 800.000',
        status: 'Terlambat 1 hari',
        statusColor: 'bg-orange-100 text-orange-700',
    },
    {
        id: 2,
        name: 'Muhammad Zaki Alghifari',
        room: 'Kamar 02',
        amount: 'Rp 800.000',
        status: 'Har Ini',
        statusColor: 'bg-gray-100 text-gray-700',
    },
];

const recentActivities = [
    {
        id: 1,
        icon: CheckCircle2,
        iconBg: 'bg-[#059669]/10',
        iconColor: 'text-[#059669]',
        title: 'Pembayaran diterima dari Muhammad Bilal Abdurrhman sebesar Rp 800.000',
        time: '2 menit yang lalu',
    },
    {
        id: 2,
        icon: UserCheck,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'Penghuni baru terdaftar di kamar 201: Wisnu',
        time: '1 jam yang lalu',
    },
    {
        id: 3,
        icon: AlertCircle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        title: 'Pembayaran Terlambat Kamar 101: Muhammad Bilal Abdurrhman',
        time: '2 jam yang lalu',
    },
];

// Stats Card Component
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

// Overdue Payment Item Component
const OverduePaymentItem = ({ payment }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
                <p className="font-medium text-gray-900">{payment.name}</p>
                <p className="text-sm text-gray-500">{payment.room}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.statusColor}`}>
                    {payment.status}
                </span>
                <p className="font-semibold text-gray-900 min-w-[100px] text-right">
                    {payment.amount}
                </p>
            </div>
        </div>
    );
};

// Activity Item Component
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

const Dashboard = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Selamat Datang di KosFlow</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsData.map((stat) => (
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
                        <h3 className="font-semibold text-gray-900">Pendapatan Bulan ini</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#059669]">Rp 800.000</p>
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
                        0 <span className="text-gray-400 text-lg">dari 0 kamar</span>
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
                            <h3 className="font-semibold text-gray-900">Jatuh Tempo Segera</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="divide-y divide-gray-100">
                            {overduePayments.map((payment) => (
                                <OverduePaymentItem key={payment.id} payment={payment} />
                            ))}
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
                            <h3 className="font-semibold text-gray-900">Aktivitas Terbaru</h3>
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
