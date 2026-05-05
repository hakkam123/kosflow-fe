import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Loader2, CreditCard, AlertTriangle } from 'lucide-react';
import billingService from '../../services/billingService';

/**
 * PaymentStatusPublic Component
 * 
 * Halaman PUBLIC untuk penghuni melihat status pembayaran
 * Accessible dari email/telegram link: /payment-status-public?id=123
 * Tidak memerlukan login
 * 
 * Flow:
 * 1. Penghuni klik link dari email/telegram
 * 2. Redirect ke halaman ini dengan query param id
 * 3. Halaman polling status pembayaran setiap 2 detik
 * 4. Penghuni bisa klik "Bayar" untuk buka Midtrans
 * 5. Setelah bayar, status auto-update (jika webhook berhasil)
 */
const PaymentStatusPublic = () => {
  const [searchParams] = useSearchParams();
  const billingId = searchParams.get('id');
  const successParam = searchParams.get('status');

  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingActive, setPollingActive] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const maxPolls = 60; // 2 menit

  const formatRupiah = (amount) => {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Fetch billing status
  const fetchBillingStatus = async () => {
    try {
      const response = await billingService.checkPaymentStatus(billingId);
      const billData = response.data;
      setBilling(billData);
      setError(null);
      setLoading(false);

      // Stop polling jika sudah Lunas
      if (billData.status_tagihan === 'Lunas') {
        setPollingActive(false);
      }
    } catch (err) {
      console.error('Error fetching billing status:', err);
      setError('Gagal memuat data tagihan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!billingId) {
      setError('ID Tagihan tidak ditemukan');
      setLoading(false);
      return;
    }
    fetchBillingStatus();
  }, [billingId]);

  // Polling effect
  useEffect(() => {
    if (!pollingActive || pollCount >= maxPolls) {
      if (pollCount >= maxPolls && billing?.status_tagihan !== 'Lunas') {
        setPollingActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setPollCount((prev) => {
        const newCount = prev + 1;
        if (newCount < maxPolls) {
          fetchBillingStatus();
        }
        return newCount;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [pollingActive, pollCount, billing?.status_tagihan]);

  // Open Midtrans payment
  const handleOpenPayment = async () => {
    if (!billing || !billingId) return;

    setPaymentProcessing(true);
    try {
      // Create payment with source='tenant' so Midtrans redirects to this page
      const result = await billingService.createPayment(billingId, { source: 'tenant' });
      if (result.success && result.data?.payment_url) {
        window.open(result.data.payment_url, '_blank');
        // Mulai polling setelah tab Midtrans dibuka
        setPollingActive(true);
        setPollCount(0);
      } else {
        alert('Gagal membuat link pembayaran. Silakan coba lagi.');
      }
    } catch (err) {
      alert('Gagal membuka halaman pembayaran: ' + err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Loading state
  if (loading && !billing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Memuat Data Tagihan</h1>
          <p className="text-gray-600">Mohon tunggu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !billing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Tagihan Tidak Ditemukan</h1>
          <p className="text-gray-600">{error || 'Data tagihan tidak tersedia'}</p>
          <p className="text-sm text-gray-500 mt-4">Hubungi pengelola kos jika masalah berlanjut.</p>
        </div>
      </div>
    );
  }

  const isPaid = billing.status_tagihan === 'Lunas';
  const isPending = billing.status_tagihan === 'Belum Bayar';
  const isOverdue = billing.status_tagihan === 'Terlambat';

  // Determine styling
  let bgGradient = 'from-blue-50 to-indigo-100';
  let headerBg = 'bg-blue-600';
  let statusIcon = <Clock className="h-16 w-16 text-blue-600 animate-spin" />;
  let statusTitle = 'Pembayaran Menunggu';
  let statusMessage = 'Silakan lakukan pembayaran sebelum jatuh tempo';

  if (isPaid) {
    bgGradient = 'from-green-50 to-emerald-100';
    headerBg = 'bg-green-600';
    statusIcon = <CheckCircle2 className="h-16 w-16 text-green-600" />;
    statusTitle = '✅ Pembayaran Berhasil';
    statusMessage = 'Tagihan Anda telah terbayar. Terima kasih!';
  } else if (isOverdue) {
    bgGradient = 'from-red-50 to-orange-100';
    headerBg = 'bg-red-600';
    statusIcon = <AlertTriangle className="h-16 w-16 text-red-600" />;
    statusTitle = '⚠️ Tagihan Terlambat';
    statusMessage = 'Silakan segera lakukan pembayaran untuk menghindari denda';
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4 py-8`}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`${headerBg} text-white p-8 text-center`}>
          {statusIcon}
          <h1 className="text-2xl font-bold mt-4 mb-2">{statusTitle}</h1>
          <p className="text-gray-100 text-sm">{statusMessage}</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Tagihan Details */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Periode Tagihan</p>
              <p className="text-lg font-semibold text-gray-900">{billing.bulan_tagihan || '-'}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Jumlah Tagihan</p>
              <p className="text-2xl font-bold text-gray-900">{formatRupiah(billing.total_tagihan)}</p>
            </div>

            {billing.tenant && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nama Penghuni</p>
                <p className="text-sm font-medium text-gray-900">{billing.tenant.nama_penghuni || '-'}</p>
              </div>
            )}

            {billing.tenant?.room && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nomor Kamar</p>
                <p className="text-sm font-medium text-gray-900">Kamar {billing.tenant.room.nomor_kamar}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Jatuh Tempo</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(billing.tanggal_jatuh_tempo)}</p>
            </div>

            {isPaid && billing.tanggal_bayar && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal Pembayaran</p>
                <p className="text-sm font-medium text-green-700">{formatDate(billing.tanggal_bayar)}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  isPaid
                    ? 'bg-green-100 text-green-700'
                    : isOverdue
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {billing.status_tagihan}
              </span>
            </div>
          </div>

          {/* Info Message */}
          {isPending && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">📌 Instruksi:</span> Klik tombol "Bayar Sekarang" di bawah untuk melakukan pembayaran via Midtrans. Anda dapat menggunakan kartu kredit, e-wallet, atau metode pembayaran lainnya.
              </p>
            </div>
          )}

          {isPaid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <span className="font-semibold">✓ Terima Kasih:</span> Pembayaran Anda telah diterima dan diproses. Bukti pembayaran dapat dilihat melalui dashboard sistem.
              </p>
            </div>
          )}

          {isOverdue && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                <span className="font-semibold">⚠️ Penting:</span> Tagihan ini sudah melewati jatuh tempo. Segera lakukan pembayaran untuk menghindari denda keterlambatan.
              </p>
            </div>
          )}

          {/* Poll Status Indicator */}
          {isPending && pollingActive && pollCount > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                <p className="text-xs text-blue-700 font-medium">
                  Pemeriksaan: {pollCount}/{maxPolls}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isPaid && (
              <button
                onClick={handleOpenPayment}
                disabled={paymentProcessing}
                className="flex-1 px-4 py-3 bg-[#059669] hover:bg-[#047857] disabled:bg-gray-300 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Membuka...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Bayar Sekarang
                  </>
                )}
              </button>
            )}

            {isPaid && (
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all"
              >
                Kembali
              </button>
            )}
          </div>

          {/* Footer Info */}
          <p className="text-xs text-gray-500 text-center">
            💡 Halaman ini aman. Midtrans menangani semua transaksi pembayaran dengan enkripsi tingkat bank.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPublic;
