import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { useAuthStore } from './context';
import { ToastProvider } from '@/components/ui/toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Kamar from './pages/Kamar';

import Penghuni from './pages/Penghuni';
import Tagihan from './pages/Tagihan';
import Pengaturan from './pages/Pengaturan';
import Reminder from './pages/Reminder';
import MonitorKamera from './pages/MonitorKamera';
import LogAkses from './pages/LogAkses';
import NotifikasiFace from './pages/NotifikasiFace';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="kamar" element={<Kamar />} />
            <Route path="penghuni" element={<Penghuni />} />
            <Route path="tagihan" element={<Tagihan />} />
            <Route path="reminder" element={<Reminder />} />
            <Route path="monitor-kamera" element={<MonitorKamera />} />
            <Route path="log-akses" element={<LogAkses />} />
            <Route path="notifikasi-face" element={<NotifikasiFace />} />
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
