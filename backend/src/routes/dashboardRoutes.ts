import { Router } from 'express';
import { getDashboardStats, getEventLogs, getNotifications, markNotificationRead } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/logs', getEventLogs);
router.get('/notifications', getNotifications);
router.post('/notifications/:id/read', markNotificationRead);

export default router;
