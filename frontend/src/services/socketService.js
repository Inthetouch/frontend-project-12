import io from 'socket.io-client';
import { getToken } from './authService';

let socket = null;
export const initializeSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      const token = getToken();

      socket = io('http://localhost:5001', {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        resolve();
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNewMessage = (channelId, callback) => {
  if (!socket) return;

  socket.on(`newMessage:${channelId}`, callback);
};

export const offNewMessage = (channelId, callback) => {
  if (!socket) return;
  socket.off(`newMessage:${channelId}`, callback);
};

export const onError = (callback) => {
  if (!socket) return;
  socket.on('error', callback);
};

export const offError = (callback) => {
  if (!socket) return;
  socket.off('error', callback);
};
