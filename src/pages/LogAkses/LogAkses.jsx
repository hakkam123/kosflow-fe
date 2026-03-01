import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, CheckCircle, AlertTriangle, Image } from 'lucide-react';
import { useFaceStore } from '../../context/faceStore';
import faceService from '../../services/faceService';

const UPLOADS_URL = faceService.getUploadsUrl();

const LogAkses = () => {
  const { logs, fetchLogs, isLoading } = useFaceStore();
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchLogs({ status: filterStatus || undefined });
  }, [filterStatus]); // eslint-disable-line

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.nama_terdeteksi.toLowerCase().includes(q) ||
      (log.tenant?.nama_penghuni || '').toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Stats
  const totalToday = logs.filter((l) => {
    const d = new Date(l.waktu);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const knownToday = logs.filter((l) => {
    const d = new Date(l.waktu);
    const today = new Date();
    return d.toDateString() === today.toDateString() && l.status === 'dikenal';
  }).length;

  const unknownToday = logs.filter((l) => {
    const d = new Date(l.waktu);
    const today = new Date();
    return d.toDateString() === today.toDateString() && l.status === 'tidak_dikenal';
  }).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Akses</h1>
          <p className="text-gray-500 text-sm mt-1">Riwayat deteksi wajah di pintu kos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Akses Hari Ini</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalToday}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Penghuni Dikenal</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{knownToday}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tidak Dikenal</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{unknownToday}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
          >
            <option value="">Semua Status</option>
            <option value="dikenal">Dikenal</option>
            <option value="tidak_dikenal">Tidak Dikenal</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nama Terdeteksi
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Screenshot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-[#059669] rounded-full animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    Tidak ada log akses ditemukan
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(log.waktu)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            log.status === 'dikenal'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {log.status === 'dikenal' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {log.nama_terdeteksi}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          log.status === 'dikenal'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {log.status === 'dikenal' ? 'Dikenal' : 'Tidak Dikenal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.confidence ? `${log.confidence}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {log.screenshot_path ? (
                        <button
                          onClick={() =>
                            setPreviewImage(`${UPLOADS_URL}/${log.screenshot_path}`)
                          }
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Image className="h-4 w-4" />
                          Lihat
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Screenshot"
              className="rounded-xl shadow-2xl max-h-[80vh] w-auto"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogAkses;
