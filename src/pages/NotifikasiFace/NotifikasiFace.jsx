import React, { useEffect, useState } from 'react';
import { Bell, BellOff, CheckCheck, Image, Eye, Clock } from 'lucide-react';
import { useFaceStore } from '../../context/faceStore';
import { useToast } from '@/components/ui/toast';
import faceService from '../../services/faceService';

const UPLOADS_URL = faceService.getUploadsUrl();

const NotifikasiFace = () => {
  const { toast } = useToast();
  const {
    notifications,
    fetchNotifications,
    markRead,
    markAllRead,
    unreadCount,
    fetchUnreadCount,
    isLoading,
  } = useFaceStore();

  const [previewImage, setPreviewImage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []); // eslint-disable-line

  const handleMarkRead = async (id) => {
    const result = await markRead(id);
    if (result.success) {
      toast.success({ title: 'Berhasil', description: 'Notifikasi ditandai sudah dibaca' });
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllRead();
    if (result.success) {
      toast.success({ title: 'Berhasil', description: 'Semua notifikasi ditandai sudah dibaca' });
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.sudah_dibaca;
    if (filter === 'read') return n.sudah_dibaca;
    return true;
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
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi Wajah</h1>
          <p className="text-gray-500 text-sm mt-1">
            Peringatan orang tidak dikenal yang terdeteksi
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {unreadCount} belum dibaca
            </span>
          )}
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
          >
            <CheckCheck className="h-4 w-4" />
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'all', label: 'Semua', count: notifications.length },
          { key: 'unread', label: 'Belum Dibaca', count: unreadCount },
          { key: 'read', label: 'Sudah Dibaca', count: notifications.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#059669] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Memuat notifikasi...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada notifikasi</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'unread'
                ? 'Semua notifikasi sudah dibaca'
                : 'Notifikasi akan muncul ketika orang tidak dikenal terdeteksi'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                notif.sudah_dibaca
                  ? 'border-gray-100 opacity-75'
                  : 'border-red-200 border-l-4 border-l-red-500'
              }`}
            >
              <div className="p-5 flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.sudah_dibaca
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  <Bell className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      notif.sudah_dibaca
                        ? 'text-gray-500'
                        : 'text-gray-900 font-medium'
                    }`}
                  >
                    {notif.pesan}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(notif.waktu)}
                    </span>
                    {notif.screenshot_path && (
                      <button
                        onClick={() =>
                          setPreviewImage(`${UPLOADS_URL}/${notif.screenshot_path}`)
                        }
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Image className="h-3 w-3" />
                        Lihat Screenshot
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!notif.sudah_dibaca && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#059669] bg-green-50 hover:bg-green-100 rounded-lg transition-all shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Tandai Dibaca
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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

export default NotifikasiFace;
