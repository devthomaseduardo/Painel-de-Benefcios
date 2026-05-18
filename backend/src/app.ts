import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import benefitRoutes from './routes/benefitRoutes';
import employeeRoutes from './routes/employeeRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: curl, Postman, server-side Next.js)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} não permitida`));
    }
  },
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// Monitoring/Logging (Optional: could add morgan here)

// Rate Limiting
app.use('/api/', apiLimiter);

// Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/benefits', benefitRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Error Handling (Must be last)
app.use(errorHandler);

export default app;
