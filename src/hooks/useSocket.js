import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/constants';
import { useFaceStore } from '../context/faceStore';

// Derive base URL (remove /api suffix)
const SOCKET_URL = API_BASE_URL.replace(/\/api$/, '');

export function useSocket() {
  const socketRef = useRef(null);
  const { addNotification, fetchUnreadCount } = useFaceStore();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    socket.on('face_notification', (data) => {
      addNotification(data);
      fetchUnreadCount();
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [addNotification, fetchUnreadCount]);

  return socketRef;
}
