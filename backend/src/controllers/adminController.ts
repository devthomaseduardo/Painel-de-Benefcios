import { Response } from 'express';
import prisma from '../lib/prisma';
import { jsonToCsv } from '../utils/csvExporter';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const users = await prisma.user.findMany({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    // Soft delete user within organization
    await prisma.user.update({ 
      where: { id: req.params.id, organizationId: orgId },
      data: { deletedAt: new Date() }
    });
    res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSystemLogs = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    // We filter AuditLogs by organizationId for enterprise compliance
    const logs = await prisma.auditLog.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { name: true, email: true } } }
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const [userCount, employeeCount, benefitCount, recentAuditLogs] = await Promise.all([
      prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
      prisma.employee.count({ where: { organizationId: orgId, deletedAt: null } }),
      prisma.benefit.count({ where: { organizationId: orgId, deletedAt: null } }),
      prisma.auditLog.count({
        where: {
          organizationId: orgId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      users: userCount,
      employees: employeeCount,
      benefits: benefitCount,
      activity24h: recentAuditLogs
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exportEmployeesCsv = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const employees = await prisma.employee.findMany({
      where: { organizationId: orgId, deletedAt: null }
    });
    const csv = jsonToCsv(employees);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=employees_${orgId}.csv`);
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exportBenefitsCsv = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const benefits = await prisma.benefit.findMany({
      where: { organizationId: orgId, deletedAt: null }
    });
    const csv = jsonToCsv(benefits);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=benefits_${orgId}.csv`);
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
