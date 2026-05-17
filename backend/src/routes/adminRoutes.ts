import { Router } from 'express';
import { getUsers, deleteUser, getSystemLogs, getAdminStats, exportEmployeesCsv, exportBenefitsCsv } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas de admin exigem autenticação e cargo de admin
router.use(authenticate);
router.use(authorize(['owner', 'hr_admin']));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/logs', getSystemLogs);
router.get('/stats', getAdminStats);
router.get('/export/employees', exportEmployeesCsv);
router.get('/export/benefits', exportBenefitsCsv);

export default router;
