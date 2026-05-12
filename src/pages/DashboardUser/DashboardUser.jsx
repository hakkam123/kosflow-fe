import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Bell,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuthStore } from "../../context/authStore";
import { useBillingStore } from "../../context/billingStore";
import { formatRupiah } from "../../utils/formatRupiah";
import { formatDate } from "../../utils/formatDate";
import FlashAlert from "../../components/FlashAlert";
import { consumeFlashAlert, setFlashAlert } from "../../utils/flashAlert";

/**
 * Komponen DashboardUser - Menampilkan halaman dashboard khusus untuk penghuni (tenant).
 */
const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore();
  const { billings, fetchBillings, isLoading } = useBillingStore();
  const [flashAlert, setFlashAlertState] = useState(null);

  const user = authUser || location.state?.user || null;

  useEffect(() => {
    fetchBillings();
  }, [fetchBillings]);

  useEffect(() => {
    setFlashAlertState(consumeFlashAlert());
  }, []);

  // Derived Data for specific tenant
  const tenantBillings = useMemo(() => {
    // In a real app, we filter by user's tenant ID.
    // Here we might need to find which tenant matches the user email if ID isn't directly linked.
    // For demo/mock, we'll assume user.id matches penghuni_id or just show all if it's a tenant login.
    return billings.filter(
      (b) => b.penghuni_id === user?.id || b.penghuni?.email === user?.email,
    );
  }, [billings, user]);

  const latestBill = useMemo(() => {
    return (
      tenantBillings.find(
        (b) =>
          b.status_tagihan === "Belum Bayar" ||
          b.status_pembayaran === "Belum Lunas" ||
          b.status_pembayaran === "Overdue",
      ) || tenantBillings[0]
    );
  }, [tenantBillings]);

  const paymentHistory = useMemo(() => {
    return tenantBillings.filter(
      (b) => b.status_tagihan === "Lunas" || b.status_pembayaran === "Terbayar",
    );
  }, [tenantBillings]);

  const handlePayment = () => {
    if (latestBill) {
      alert(
        `Memproses pembayaran untuk ${latestBill.bulan} ${latestBill.tahun} sebesar ${formatRupiah(latestBill.total_tagihan || latestBill.jumlah_tagihan)}`,
      );
    }
  };

  const handleLogout = () => {
    setFlashAlert({
      variant: "success",
      title: "Berhasil logout",
      description: "Anda telah keluar dari dashboard penghuni.",
    });
    logout();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading user profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-0 md:p-4">
      {flashAlert && (
        <div className="w-full max-w-112.5 px-4 pt-4">
          <FlashAlert
            variant={flashAlert.variant || "success"}
            title={flashAlert.title}
            description={flashAlert.description}
            onClose={() => setFlashAlertState(null)}
          />
        </div>
      )}

      {/* Mobile Container */}
      <div className="w-full max-w-112.5 bg-white min-h-screen md:min-h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="bg-primary-600 p-6 text-white pt-10 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-primary-100 text-sm font-medium">
                Selamat Datang,
              </p>
              <h1 className="text-2xl font-bold">
                {user.nama_lengkap || user.username}
              </h1>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                <Home className="w-3 h-3" />
                {user.kamar_id ? `Kamar ${user.kamar_id}` : "Belum Ada Kamar"}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Overlapping Area */}
        <div className="flex-1 px-5 -mt-6 relative z-20 pb-24 overflow-y-auto">
          {isLoading && tenantBillings.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center mt-10">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Memuat data...</p>
            </div>
          ) : activeTab === "home" ? (
            <>
              {/* Latest Billing Section */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-primary-600 font-bold uppercase tracking-widest">
                    Tagihan Aktif
                  </span>
                </div>

                {latestBill ? (
                  <Card className="p-0 border-none overflow-hidden bg-linear-to-br from-white to-slate-50 shadow-xl border border-slate-100">
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-primary-600" />
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 ${
                            latestBill.status_pembayaran === "Overdue" ||
                            latestBill.status_tagihan === "Terlambat"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {latestBill.status_tagihan ||
                            latestBill.status_pembayaran}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          Tagihan {latestBill.bulan} {latestBill.tahun}
                        </p>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                          {formatRupiah(
                            latestBill.total_tagihan ||
                              latestBill.jumlah_tagihan,
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          Jatuh tempo:{" "}
                          <span className="font-bold text-slate-700">
                            {formatDate(latestBill.tanggal_jatuh_tempo)}
                          </span>
                        </div>
                      </div>

                      {(latestBill.status_tagihan === "Belum Bayar" ||
                        latestBill.status_pembayaran === "Belum Lunas" ||
                        latestBill.status_pembayaran === "Overdue") && (
                        <Button
                          onClick={handlePayment}
                          className="w-full py-4 rounded-xl font-bold shadow-lg shadow-primary-500/20 mt-2"
                        >
                          Bayar Sekarang
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-10 h-10 text-success mb-2 opacity-20" />
                    <p className="text-sm font-medium text-slate-400">
                      Tidak ada tagihan aktif
                    </p>
                  </div>
                )}
              </div>

              {/* Occupancy Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Masuk Sejak
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user.created_at ? formatDate(user.created_at) : "-"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <p className="text-sm font-bold text-success capitalize">
                    {user.role || "Penghuni"}
                  </p>
                </div>
              </div>

              {/* Quick History Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Riwayat Terakhir
                  </h2>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-xs text-primary-600 font-bold"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentHistory.length > 0 ? (
                    paymentHistory.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">
                              {item.bulan} {item.tahun}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {item.tanggal_bayar
                                ? formatDate(item.tanggal_bayar)
                                : "Lunas"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">
                            {formatRupiah(
                              item.total_tagihan || item.jumlah_tagihan,
                            )}
                          </p>
                          <p className="text-[10px] text-success font-bold uppercase tracking-tighter">
                            Lunas
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center text-slate-400 py-4">
                      Belum ada riwayat pembayaran
                    </p>
                  )}
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
                  <h2 className="text-lg font-bold text-slate-800">
                    Semua Riwayat
                  </h2>
                  <p className="text-xs text-slate-500">
                    Daftar lengkap pembayaran Anda
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            {item.bulan} {item.tahun}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {item.tanggal_bayar
                              ? formatDate(item.tanggal_bayar)
                              : "Lunas"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">
                          {formatRupiah(
                            item.total_tagihan || item.jumlah_tagihan,
                          )}
                        </p>
                        <p className="text-[10px] text-success font-bold uppercase tracking-tighter">
                          Lunas
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-slate-400 py-10">
                    Belum ada riwayat pembayaran
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto bg-white border-t border-slate-100 px-12 py-4 flex justify-around items-center absolute bottom-0 w-full max-w-112.5">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "home" ? "text-primary-600" : "text-slate-300"}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "history" ? "text-primary-600" : "text-slate-300"}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Riwayat
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
