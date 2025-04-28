import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // In production, restrict this to your frontend domain
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Let client join a room for specific order updates
    socket.on('trackOrder', (paymentId: string) => {
      console.log(`Client ${socket.id} tracking payment: ${paymentId}`);
      socket.join(`payment:${paymentId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Function to emit status updates to clients tracking specific payments
export const emitStatusUpdate = (paymentId: string, statustrack: string): void => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }
  
  io.to(`payment:${paymentId}`).emit('statusUpdate', {
    paymentId,
    statustrack,
    updatedAt: new Date()
  });
  
  // Also emit to a general channel for admin dashboards
  io.emit('paymentStatusChanged', {
    paymentId,
    statustrack,
    updatedAt: new Date()
  });
};