import React, { useState } from 'react';
import {
  CreditCard,
  History,
  Calendar,
  Home,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Bell
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';

const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Mock data
  const userData = {
    name: "Ahmad Hakkam",
    room: "Kamar 204",
    moveInDate: "12 Januari 2024",
    totalPayments: 4
  };

  const latestBill = {
    month: "April 2024",
    amount: "Rp 1.500.000",
    dueDate: "25 April 2024",
    status: "Belum Bayar",
    id: "INV-2024-004"
  };

  const paymentHistory = [
    { id: 1, month: "Maret 2024", amount: "Rp 1.500.000", date: "24 Maret 2024", status: "Berhasil" },
    { id: 2, month: "Februari 2024", amount: "Rp 1.500.000", date: "23 Februari 2024", status: "Berhasil" },
    { id: 3, month: "Januari 2024", amount: "Rp 1.500.000", date: "20 Januari 2024", status: "Berhasil" },
    { id: 4, month: "Desember 2023", amount: "Rp 1.500.000", date: "22 Desember 2023", status: "Berhasil" },
  ];

  const handlePayment = () => {
    alert(`Memproses pembayaran untuk ${latestBill.month} sebesar ${latestBill.amount}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-0 md:p-4">
      {/* Mobile Container */}
      <div className="w-full max-w-[450px] bg-white min-h-screen md:min-h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">

        {/* Header */}
        <div className="bg-primary-600 p-6 text-white pt-10 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-primary-100 text-sm font-medium">Selamat Datang,</p>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                <Home className="w-3 h-3" />
                {userData.room}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Overlapping Area */}
        <div className="flex-1 px-5 -mt-6 relative z-20 pb-24 overflow-y-auto">

          {activeTab === 'home' ? (
            <>
              {/* Latest Billing Section */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-primary-600 font-bold">Detail</span>
                </div>

                <Card className="p-0 border-none overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-xl border border-slate-100">
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {latestBill.status}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium">Tagihan {latestBill.month}</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-0.5">{latestBill.amount}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        Jatuh tempo: <span className="font-bold text-slate-700">{latestBill.dueDate}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      className="w-full py-4 rounded-xl font-bold shadow-lg shadow-primary-500/20 mt-2"
                    >
                      Bayar Sekarang
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Occupancy Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Masuk Sejak</p>
                  <p className="text-sm font-bold text-slate-800">{userData.moveInDate}</p>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Bayar</p>
                  <p className="text-sm font-bold text-slate-800">{userData.totalPayments} Kali</p>
                </div>
              </div>

              {/* Quick History Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Riwayat Terakhir</h2>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs text-primary-600 font-bold"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentHistory.slice(0, 2).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{item.month}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{item.amount}</p>
                        <p className="text-[10px] text-success font-bold uppercase tracking-tighter">Lunas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Full History View */
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Semua Riwayat</h2>
                  <p className="text-xs text-slate-500">Daftar lengkap pembayaran Anda</p>
                </div>
              </div>

              <div className="space-y-3">
                {paymentHistory.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{item.month}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{item.amount}</p>
                      <p className="text-[10px] text-success font-bold uppercase tracking-tighter">Lunas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto bg-white border-t border-slate-100 px-12 py-4 flex justify-around items-center absolute bottom-0 w-full max-w-[450px]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-primary-600' : 'text-slate-300'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-primary-600' : 'text-slate-300'}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Riwayat</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardUser;
