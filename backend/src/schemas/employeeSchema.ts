import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
  departmentId: z.string().uuid("ID de departamento inválido"),
  position: z.string().min(2, "Cargo é obrigatório"),
  salary: z.number().positive("Salário deve ser maior que zero"),
  status: z.enum(['active', 'onboarding', 'vacation', 'suspended', 'terminated']).optional().default('onboarding')
});

export const updateEmployeeSchema = employeeSchema.partial();
