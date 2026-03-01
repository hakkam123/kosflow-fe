import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, CameraOff, Eye, EyeOff, Settings2, User, AlertTriangle, CheckCircle } from 'lucide-react';
import faceService from '../../services/faceService';
import { useFaceStore } from '../../context/faceStore';
import { useToast } from '@/components/ui/toast';

const MonitorKamera = () => {
  const { toast } = useToast();
  const { fetchUnreadCount } = useFaceStore();

  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const captureRef = useRef(null);
  const detectionTimerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState(3);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState([]);
  const [lastDetections, setLastDetections] = useState({});

  const COOLDOWN_MS = 15000; // 15s cooldown per person

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      toast.error({
        title: 'Error',
        description: 'Gagal mengakses kamera. Pastikan izin kamera diberikan.',
      });
    }
  }, [toast]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setCameraActive(false);
    setDetectionActive(false);

    // Clear overlay
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext('2d');
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }

    if (detectionTimerRef.current) {
      clearTimeout(detectionTimerRef.current);
    }
  }, [stream]);

  // Detect faces
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !captureRef.current || !detectionActive) return;

    setIsDetecting(true);

    try {
      const canvas = captureRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const response = await faceService.recognize(imageData);
      const results = response.results || [];

      // Draw bounding boxes on overlay
      if (overlayRef.current && video.videoWidth) {
        const overlay = overlayRef.current;
        overlay.width = video.clientWidth;
        overlay.height = video.clientHeight;
        const octx = overlay.getContext('2d');
        octx.clearRect(0, 0, overlay.width, overlay.height);

        const scaleX = video.clientWidth / video.videoWidth;
        const scaleY = video.clientHeight / video.videoHeight;

        results.forEach((result) => {
          const { top, right, bottom, left } = result.location;
          const x = left * scaleX;
          const y = top * scaleY;
          const w = (right - left) * scaleX;
          const h = (bottom - top) * scaleY;

          const isKnown = result.status === 'dikenal';
          octx.strokeStyle = isKnown ? '#10b981' : '#ef4444';
          octx.lineWidth = 3;
          octx.strokeRect(x, y, w, h);

          // Label
          octx.fillStyle = isKnown ? '#10b981' : '#ef4444';
          const labelHeight = 24;
          octx.fillRect(x, y - labelHeight, w, labelHeight);

          octx.fillStyle = '#ffffff';
          octx.font = 'bold 13px Inter, sans-serif';
          const label = isKnown
            ? `${result.nama} (${result.confidence}%)`
            : 'Tidak Dikenal';
          octx.fillText(label, x + 6, y - 7);
        });
      }

      // Add to detection results (max 30)
      if (results.length > 0) {
        const now = Date.now();
        const newResults = results.map((r) => ({
          ...r,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        }));

        setDetectionResults((prev) => [...newResults, ...prev].slice(0, 30));

        // Check cooldown for notifications
        const newLastDetections = { ...lastDetections };
        results.forEach((r) => {
          if (r.status === 'tidak_dikenal') {
            const lastTime = newLastDetections['unknown'] || 0;
            if (now - lastTime > COOLDOWN_MS) {
              newLastDetections['unknown'] = now;
              toast.error({
                title: '⚠️ Orang Tidak Dikenal!',
                description: 'Orang tidak dikenal terdeteksi di kamera.',
              });
              fetchUnreadCount();
            }
          }
        });
        setLastDetections(newLastDetections);
      }
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      setIsDetecting(false);
    }

    // Schedule next detection
    if (detectionActive) {
      detectionTimerRef.current = setTimeout(detectFaces, detectionInterval * 1000);
    }
  }, [detectionActive, detectionInterval, lastDetections, toast, fetchUnreadCount]);

  // Toggle detection
  const toggleDetection = useCallback(() => {
    if (detectionActive) {
      setDetectionActive(false);
      if (detectionTimerRef.current) clearTimeout(detectionTimerRef.current);
      // Clear overlay
      if (overlayRef.current) {
        const ctx = overlayRef.current.getContext('2d');
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      }
    } else {
      setDetectionActive(true);
    }
  }, [detectionActive]);

  // Start detection loop when activated
  useEffect(() => {
    if (detectionActive && cameraActive) {
      detectFaces();
    }
    return () => {
      if (detectionTimerRef.current) clearTimeout(detectionTimerRef.current);
    };
  }, [detectionActive]); // eslint-disable-line

  // Bind stream to video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (detectionTimerRef.current) clearTimeout(detectionTimerRef.current);
    };
  }, []); // eslint-disable-line

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitor Kamera</h1>
          <p className="text-gray-500 text-sm mt-1">
            Deteksi wajah real-time di pintu kos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              cameraActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                cameraActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            {cameraActive ? 'Kamera Aktif' : 'Kamera Mati'}
          </span>
          {detectionActive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Deteksi Aktif
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Camera Area */}
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              {/* Always render video so ref is available when stream starts */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`}
              />
              <canvas
                ref={overlayRef}
                className={`absolute top-0 left-0 w-full h-full pointer-events-none ${cameraActive ? '' : 'hidden'}`}
              />
              {!cameraActive && (
                <div className="text-center text-gray-500">
                  <CameraOff className="h-16 w-16 mx-auto mb-3 text-gray-600" />
                  <p className="text-lg font-medium text-gray-400">
                    Kamera belum aktif
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Klik tombol di bawah untuk memulai
                  </p>
                </div>
              )}
              <canvas ref={captureRef} className="hidden" />
            </div>

            {/* Camera Controls */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Camera className="h-4 w-4" />
                    Mulai Kamera
                  </button>
                ) : (
                  <>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <CameraOff className="h-4 w-4" />
                      Stop Kamera
                    </button>
                    <button
                      onClick={toggleDetection}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        detectionActive
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {detectionActive ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Stop Deteksi
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Mulai Deteksi
                        </>
                      )}
                    </button>
                  </>
                )}

                {/* Detection Interval */}
                {cameraActive && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Settings2 className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Interval:</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={detectionInterval}
                      onChange={(e) =>
                        setDetectionInterval(parseInt(e.target.value))
                      }
                      className="w-24 accent-[#059669]"
                    />
                    <span className="text-xs text-gray-700 font-medium w-6">
                      {detectionInterval}s
                    </span>
                  </div>
                )}
              </div>

              {isDetecting && (
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Mendeteksi wajah...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detection Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full max-h-150 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Hasil Deteksi</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {detectionResults.length} deteksi terakhir
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {detectionResults.length === 0 ? (
                <div className="p-8 text-center">
                  <Eye className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Belum ada deteksi
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Mulai kamera dan aktifkan deteksi
                  </p>
                </div>
              ) : (
                detectionResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 flex items-center gap-3 ${
                      result.status === 'tidak_dikenal'
                        ? 'bg-red-50/50'
                        : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        result.status === 'dikenal'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {result.status === 'dikenal' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          result.status === 'dikenal'
                            ? 'text-gray-900'
                            : 'text-red-700'
                        }`}
                      >
                        {result.nama}
                      </p>
                      <p className="text-xs text-gray-400">
                        {result.timestamp}
                        {result.confidence > 0 &&
                          ` • ${result.confidence}%`}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        result.status === 'dikenal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {result.status === 'dikenal'
                        ? 'Dikenal'
                        : 'Tidak Dikenal'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorKamera;
