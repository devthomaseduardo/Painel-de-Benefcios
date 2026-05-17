import { z } from 'zod';

export const benefitSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.enum(['health', 'food', 'transport', 'culture', 'other'], {
    errorMap: () => ({ message: "Tipo de benefício inválido" })
  }),
  cost: z.number().positive("O custo deve ser um valor positivo"),
  provider: z.string().min(2, "O provedor é obrigatório"),
  status: z.enum(['pending', 'approved', 'denied', 'expired']).optional().default('pending')
});

export const updateBenefitSchema = benefitSchema.partial();
