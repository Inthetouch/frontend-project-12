import io from 'socket.io-client'
import { getToken } from './authService'

let socket = null

export const initializeSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      const token = getToken()

      if (!token) {
        reject(new Error('No token available'))
        return
      }

      socket = io({
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id)
        resolve()
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        reject(error)
      })

      socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason)
      })
    }
    catch (error) {
      reject(error)
    }
  })
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized')
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const onNewMessage = (callback) => {
  if (!socket) return

  socket.on('newMessage', callback)
}

export const offNewMessage = (callback) => {
  if (!socket) return
  socket.off('newMessage', callback)
}

export const onError = (callback) => {
  if (!socket) return
  socket.on('error', callback)
}

export const offError = (callback) => {
  if (!socket) return
  socket.off('error', callback)
}

export const onNewChannel = (callback) => {
  if (!socket) return
  socket.on('newChannel', callback)
}

export const offNewChannel = (callback) => {
  if (!socket) return
  socket.off('newChannel', callback)
}

export const onRenameChannel = (callback) => {
  if (!socket) return
  socket.on('renameChannel', callback)
}

export const offRenameChannel = (callback) => {
  if (!socket) return
  socket.off('renameChannel', callback)
}

export const onRemoveChannel = (callback) => {
  if (!socket) return
  socket.on('removeChannel', callback)
}

export const offRemoveChannel = (callback) => {
  if (!socket) return
  socket.off('removeChannel', callback)
}
