import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  addBenefitToEmployee
} from '../controllers/employeeController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { employeeSchema, updateEmployeeSchema } from '../schemas/employeeSchema';

const router = Router();

// Todos precisam estar logados (manager ou admin)
router.use(authenticate);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);

// Modificações podem ser feitas por managers e admins
router.post('/', authorize(['owner', 'hr_admin', 'manager']), validate(employeeSchema), createEmployee);
router.put('/:id', authorize(['owner', 'hr_admin', 'manager']), validate(updateEmployeeSchema), updateEmployee);
router.delete('/:id', authorize(['owner', 'hr_admin']), deleteEmployee); // Apenas admin/owner deleta
router.post('/add-benefit', authorize(['owner', 'hr_admin', 'manager']), addBenefitToEmployee);

export default router;
