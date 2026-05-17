import { Router } from 'express';
import {
  getAllBenefits,
  createBenefit,
  getBenefitById,
  updateBenefit,
  deleteBenefit
} from '../controllers/benefitController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { benefitSchema, updateBenefitSchema } from '../schemas/benefitSchema';

const router = Router();

// Todos precisam estar logados
router.use(authenticate);

router.get('/', getAllBenefits);
router.get('/:id', getBenefitById);

// Apenas admin/owner pode modificar benefícios
router.post('/', authorize(['owner', 'hr_admin']), validate(benefitSchema), createBenefit);
router.put('/:id', authorize(['owner', 'hr_admin']), validate(updateBenefitSchema), updateBenefit);
router.delete('/:id', authorize(['owner', 'hr_admin']), deleteBenefit);

export default router;
