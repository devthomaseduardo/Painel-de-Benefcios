import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🚀 Starting Enterprise Database Seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing records...');
  await prisma.offboarding.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.employeeHistory.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 1. Create Main Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Thomas Enterprise',
      slug: 'thomas-ent',
      plan: 'enterprise',
    },
  });
  console.log(`✅ Organization created: ${org.name}`);

  // 2. Create Departments
  const deptEngineering = await prisma.department.create({
    data: { name: 'Engineering', organizationId: org.id }
  });
  const deptHR = await prisma.department.create({
    data: { name: 'Human Resources', organizationId: org.id }
  });
  const deptSales = await prisma.department.create({
    data: { name: 'Sales', organizationId: org.id }
  });
  console.log('✅ Departments created');

  // 3. Create Admin (Owner) User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Thomas Admin',
      email: 'admin@thomas.com',
      password: hashedPassword,
      role: 'owner',
      organizationId: org.id,
    },
  });
  console.log(`✅ Owner user created: ${admin.email}`);

  // 4. Create Benefits
  const healthPlan = await prisma.benefit.create({
    data: {
      name: 'Health Insurance Premium',
      type: 'health',
      cost: 550.00,
      provider: 'SulAmérica',
      status: 'approved',
      organizationId: org.id,
    },
  });

  const mealVoucher = await prisma.benefit.create({
    data: {
      name: 'Meal Voucher',
      type: 'food',
      cost: 950.00,
      provider: 'Sodexo',
      status: 'approved',
      organizationId: org.id,
    },
  });

  const gympass = await prisma.benefit.create({
    data: {
      name: 'Gympass Corporate',
      type: 'health',
      cost: 120.00,
      provider: 'Gympass',
      status: 'approved',
      organizationId: org.id,
    },
  });

  const dentalPlan = await prisma.benefit.create({
    data: {
      name: 'Plano Odontológico',
      type: 'health',
      cost: 45.00,
      provider: 'OdontoPrev',
      status: 'approved',
      organizationId: org.id,
    },
  });

  const homeOffice = await prisma.benefit.create({
    data: {
      name: 'Auxílio Home Office',
      type: 'other',
      cost: 250.00,
      provider: 'Internal',
      status: 'approved',
      organizationId: org.id,
    },
  });

  const education = await prisma.benefit.create({
    data: {
      name: 'Bolsa Educação',
      type: 'culture',
      cost: 500.00,
      provider: 'Alura',
      status: 'approved',
      organizationId: org.id,
    },
  });

  // 5. Create Employees
  const alice = await prisma.employee.create({
    data: {
      name: 'Alice Staff',
      email: 'alice@thomas.com',
      cpf: '123.456.789-00',
      position: 'Staff Engineer',
      salary: 18000,
      status: 'active',
      organizationId: org.id,
      departmentId: deptEngineering.id,
      benefits: { connect: [{ id: healthPlan.id }, { id: mealVoucher.id }, { id: gympass.id }, { id: dentalPlan.id }, { id: homeOffice.id }, { id: education.id }] },
      timeTrackings: {
        create: [
          { date: new Date(), clockIn: new Date(new Date().setHours(9, 0, 0, 0)), clockOut: new Date(new Date().setHours(18, 0, 0, 0)), status: 'present' },
          { date: new Date(new Date().setDate(new Date().getDate() - 1)), clockIn: new Date(new Date().setHours(9, 15, 0, 0)), clockOut: new Date(new Date().setHours(18, 30, 0, 0)), status: 'late' }
        ]
      }
    },
  });

  const bob = await prisma.employee.create({
    data: {
      name: 'Bob Sales',
      email: 'bob@thomas.com',
      cpf: '234.567.890-11',
      position: 'Sales Representative',
      salary: 8000,
      status: 'terminated',
      organizationId: org.id,
      departmentId: deptSales.id,
      offboarding: {
        create: {
          terminationDate: new Date(new Date().setDate(new Date().getDate() - 15)),
          reason: 'Corte de custos',
          type: 'involuntary',
          status: 'completed',
          notes: 'Equipamento devolvido.'
        }
      }
    }
  });

  const carol = await prisma.employee.create({
    data: {
      name: 'Carol HR',
      email: 'carol@thomas.com',
      cpf: '345.678.901-22',
      position: 'HR Manager',
      salary: 12000,
      status: 'vacation',
      organizationId: org.id,
      departmentId: deptHR.id,
      benefits: { connect: [{ id: healthPlan.id }, { id: mealVoucher.id }] },
      leaves: {
        create: {
          type: 'vacation',
          startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 25)),
          status: 'approved',
          reason: 'Férias anuais regulamentares'
        }
      }
    }
  });

  const dave = await prisma.employee.create({
    data: {
      name: 'Dave Intern',
      email: 'dave@thomas.com',
      cpf: '456.789.012-33',
      position: 'Software Engineering Intern',
      salary: 3000,
      status: 'onboarding',
      organizationId: org.id,
      departmentId: deptEngineering.id,
    }
  });

  const eduardo = await prisma.employee.create({
    data: {
      name: 'Eduardo Tech',
      email: 'eduardo@thomas.com',
      cpf: '567.890.123-44',
      position: 'IT Support',
      salary: 4500,
      status: 'terminated',
      organizationId: org.id,
      departmentId: deptEngineering.id,
      offboarding: {
        create: {
          terminationDate: new Date(),
          reason: 'Busca de novas oportunidades',
          type: 'voluntary',
          status: 'processing',
          notes: 'Aguardando devolução do notebook.'
        }
      }
    }
  });

  const fernanda = await prisma.employee.create({
    data: {
      name: 'Fernanda Marketing',
      email: 'fernanda@thomas.com',
      cpf: '678.901.234-55',
      position: 'Marketing Analyst',
      salary: 6000,
      status: 'active',
      organizationId: org.id,
      departmentId: deptSales.id,
      benefits: { connect: [{ id: healthPlan.id }, { id: gympass.id }] },
      leaves: {
        create: {
          type: 'vacation',
          startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 40)),
          status: 'approved',
          reason: 'Férias programadas'
        }
      }
    }
  });

  const gustavo = await prisma.employee.create({
    data: {
      name: 'Gustavo Support',
      email: 'gustavo@thomas.com',
      cpf: '789.012.345-66',
      position: 'Customer Success',
      salary: 5000,
      status: 'active',
      organizationId: org.id,
      departmentId: deptSales.id,
      benefits: { connect: [{ id: healthPlan.id }] },
      leaves: {
        create: {
          type: 'vacation',
          startDate: new Date(new Date().setDate(new Date().getDate() - 400)), // overdue vacation
          endDate: new Date(new Date().setDate(new Date().getDate() - 370)),
          status: 'rejected',
          reason: 'Férias Vencidas - Necessita regularização urgente'
        }
      }
    }
  });

  // 6. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      userId: admin.id,
      action: 'LOGIN',
      entityType: 'SYSTEM',
      ipAddress: '127.0.0.1'
    }
  });

  console.log('\n✨ Enterprise Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
