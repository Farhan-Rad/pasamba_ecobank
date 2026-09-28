import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe:notifications', userId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const subscribeMachine = useCallback((machineId: string, callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('subscribe:machine', machineId);
    socket.on('machine:status', (data: any) => {
      if (data.id === machineId) callback(data);
    });
  }, []);

  const onNotification = useCallback((callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('notification:new', callback);
  }, []);

  const onTransaction = useCallback((callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('transaction:new', callback);
  }, []);

  return { subscribeMachine, onNotification, onTransaction };
}
