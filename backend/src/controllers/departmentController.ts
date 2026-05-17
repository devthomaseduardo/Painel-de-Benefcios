import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { createAuditLog } from '../lib/audit';

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const departments = await prisma.department.findMany({
      where: { organizationId: orgId, deletedAt: null },
      include: { _count: { select: { employees: true } } }
    });
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const department = await prisma.department.create({
      data: {
        ...req.body,
        organizationId: orgId
      }
    });

    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'CREATE',
      entityType: 'DEPARTMENT',
      entityId: department.id,
      newData: department,
      ipAddress: req.ip
    });

    res.status(201).json(department);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
