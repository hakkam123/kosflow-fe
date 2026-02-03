import React from 'react';
import {
    DoorOpen,
    Users,
    KeyRound,
    Wallet,
    AlertCircle,
    Bell,
    Plus,
    CreditCard,
    UserPlus,
    FileText,
    Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data - replace with actual API data
const statsData = [
    {
        id: 1,
        title: 'Total Kamar',
        value: '42',
        icon: DoorOpen,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500',
        hasMenu: true,
    },
    {
        id: 2,
        title: 'Penghuni Aktif',
        value: '35',
        icon: Users,
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-500',
    },
    {
        id: 3,
        title: 'Kamar Kosong',
        value: '7',
        subtitle: 'Siap huni',
        icon: KeyRound,
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        id: 4,
        title: 'Pendapatan Bulan Ini',
        value: 'Rp 45jt',
        icon: Wallet,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        id: 5,
        title: 'Menunggu Pembayaran',
        value: 'Rp 5.2jt',
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        iconColor: 'text-red-500',
        highlighted: true,
    },
];

const overduePayments = [
    {
        id: 1,
        name: 'Sarah Wijaya',
        room: 'Kamar 102 (AC Deluxe)',
        amount: 'Rp 1.500.000',
        status: 'Terlambat 3 Hari',
        statusColor: 'bg-red-500',
        avatar: 'SW',
    },
    {
        id: 2,
        name: 'Rizky Pratama',
        room: 'Kamar 205 (Standard)',
        amount: 'Rp 900.000',
        status: 'Terlambat 1 Hari',
        statusColor: 'bg-orange-500',
        avatar: 'RP',
    },
    {
        id: 3,
        name: 'Linda Kusuma',
        room: 'Kamar 105 (AC Standard)',
        amount: 'Rp 1.200.000',
        status: 'Hari Ini',
        statusColor: 'bg-green-500',
        avatar: 'LK',
    },
];

const recentActivities = [
    {
        id: 1,
        icon: CreditCard,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        title: 'Pembayaran Diterima dari Dimas Anggara sebesar Rp 1.500.000',
        time: '2 menit yang lalu',
    },
    {
        id: 2,
        icon: UserPlus,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'Penghuni Baru terdaftar di Kamar 201: Siti Aminah',
        time: '1 jam yang lalu',
    },
    {
        id: 3,
        icon: FileText,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: 'Tagihan bulan November diterbitkan otomatis untuk 35 penghuni',
        time: '5 jam yang lalu',
    },
    {
        id: 4,
        icon: Wrench,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'Status Kamar 104 diubah menjadi Maintenance (Perbaikan AC)',
        time: 'Kemarin, 14:30',
    },
];

// Stats Card Component
const StatsCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
        <div
            className={`bg-white rounded-xl p-5 shadow-sm border ${stat.highlighted
                ? 'border-red-200 ring-2 ring-red-100'
                : 'border-gray-100'
                } relative`}
        >
            {stat.hasMenu && (
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <span className="text-xl leading-none">⋯</span>
                </button>
            )}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bgColor} mb-3`}
                    >
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                    {stat.subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Overdue Payment Item Component
const OverduePaymentItem = ({ payment }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {payment.avatar}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{payment.name}</p>
                    <p className="text-sm text-gray-500">{payment.room}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white ${payment.statusColor}`}
                >
                    {payment.status}
                </span>
                <p className="font-semibold text-gray-900 min-w-25 text-right">
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
        <div className="flex items-start gap-3 py-3">
            <div
                className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}
            >
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">
                        Selamat datang kembali, berikut ringkasan properti Anda hari ini.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifikasi
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                {statsData.map((stat) => (
                    <StatsCard key={stat.id} stat={stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Urgency Alerts Section */}
                <div className="lg:col-span-2">
                    <Card className="shadow-sm border-gray-100">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Urgency Alerts: Tagihan Terlambat
                                </CardTitle>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Lihat Semua
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-gray-100">
                                {overduePayments.map((payment) => (
                                    <OverduePaymentItem key={payment.id} payment={payment} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Section */}
                <div className="lg:col-span-1">
                    <Card className="shadow-sm border-gray-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {recentActivities.map((activity) => (
                                    <ActivityItem key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
