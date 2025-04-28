'use client';

import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppStore } from './store';

let socket: Socket | null = null;

export function useSocket() {
  const { addNotification } = useAppStore();

  useEffect(() => {
    // Initialize Socket.IO connection
    if (!socket) {
      const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
      socket = io(SOCKET_URL);

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    }

    // Listen for notification events
    socket.on('notification', (data: { message: string; type: 'info' | 'success' | 'warning' | 'error' }) => {
      addNotification({
        message: data.message,
        type: data.type,
      });
    });

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [addNotification]);

  return socket;
}
