import { Response } from 'express';
import prisma from '../lib/prisma';
import { emitEvent } from '../lib/events';
import { getPagination } from '../utils/pagination';
import { AuthRequest } from '../middleware/authMiddleware';
import { createAuditLog } from '../lib/audit';

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const { skip, take, page, limit } = getPagination(req.query);
    const orgId = req.user!.organizationId;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: { 
          organizationId: orgId,
          deletedAt: null // Soft delete check
        },
        skip,
        take,
        include: { 
          benefits: true,
          department: true,
          timeTrackings: true,
          leaves: true,
          offboarding: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.employee.count({ 
        where: { 
          organizationId: orgId,
          deletedAt: null 
        } 
      })
    ]);

    res.json({
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    
    const employee = await prisma.employee.create({
      data: {
        ...req.body,
        organizationId: orgId,
        status: 'onboarding' // Default enterprise status
      },
      include: { department: true }
    });
    
    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'CREATE',
      entityType: 'EMPLOYEE',
      entityId: employee.id,
      newData: employee,
      ipAddress: req.ip
    });
    
    emitEvent('employee_created', { employee, organizationId: orgId });
    
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const employeeId = req.params.id;

    const oldEmployee = await prisma.employee.findUnique({
      where: { id: employeeId, organizationId: orgId }
    });

    if (!oldEmployee) return res.status(404).json({ message: 'Funcionário não encontrado' });

    const employee = await prisma.employee.update({
      where: { id: employeeId, organizationId: orgId },
      data: req.body,
      include: { department: true }
    });
    
    // Log history for specific fields if they changed
    const trackedFields = ['salary', 'position', 'status', 'departmentId'];
    for (const field of trackedFields) {
      if (req.body[field] && req.body[field] !== (oldEmployee as any)[field]) {
        await prisma.employeeHistory.create({
          data: {
            employeeId,
            field,
            oldValue: String((oldEmployee as any)[field]),
            newValue: String(req.body[field])
          }
        });
      }
    }

    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'UPDATE',
      entityType: 'EMPLOYEE',
      entityId: employee.id,
      oldData: oldEmployee,
      newData: employee,
      ipAddress: req.ip
    });

    emitEvent('employee_updated', { employee, organizationId: orgId });
    res.json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const employeeId = req.params.id;

    // Soft Delete
    await prisma.employee.update({
      where: { id: employeeId, organizationId: orgId },
      data: { 
        deletedAt: new Date(),
        status: 'terminated' 
      }
    });
    
    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'DELETE',
      entityType: 'EMPLOYEE',
      entityId: employeeId,
      ipAddress: req.ip
    });

    emitEvent('employee_deleted', { id: employeeId, organizationId: orgId });
    res.json({ message: 'Employee archived successfully (Soft Delete)' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const employee = await prisma.employee.findUnique({
      where: { 
        id: req.params.id,
        organizationId: orgId,
        deletedAt: null
      },
      include: {
        benefits: true,
        department: true,
        history: true
      }
    });

    if (!employee) return res.status(404).json({ message: 'Funcionário não encontrado' });
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addBenefitToEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, benefitId } = req.body;
    const orgId = req.user!.organizationId;

    const employee = await prisma.employee.update({
      where: { id: employeeId, organizationId: orgId },
      data: {
        benefits: {
          connect: { id: benefitId }
        }
      },
      include: { benefits: true }
    });

    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'UPDATE',
      entityType: 'EMPLOYEE',
      entityId: employeeId,
      newData: { addedBenefitId: benefitId },
      ipAddress: req.ip
    });

    emitEvent('employee_benefit_added', { employeeId, benefitId, organizationId: orgId });
    res.json(employee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
