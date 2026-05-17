import { getIO } from './socket';
import prisma from './prisma';

export const emitEvent = (event: string, data: any, room?: string) => {
  const io = getIO();
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
};

export const logEvent = async (type: string, message: string, metadata?: any) => {
  try {
    const log = await prisma.eventLog.create({
      data: {
        type,
        message,
        metadata: metadata || {}
      }
    });

    console.log(`[EventLog] ${type.toUpperCase()}: ${message}`);
    
    // Broadcast to operational room
    emitEvent('operational_log', log, 'admin_room');
    
    return log;
  } catch (error) {
    console.error('Failed to save event log:', error);
  }
};
