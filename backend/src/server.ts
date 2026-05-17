import http from 'http';
import app from './app';
import prisma from './lib/prisma';
import redis from './lib/redis';
import { initSocket } from './lib/socket';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Real-time Engine
initSocket(server);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✔ Database connection established');

    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('✘ Startup error:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    console.log('✔ All connections closed. Goodbye.');
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error('Forcefully exiting...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
