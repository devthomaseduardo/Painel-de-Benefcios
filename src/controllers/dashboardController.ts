import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import redis from '../lib/redis';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user!.organizationId;
    const cacheKey = `dashboard:stats:${orgId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Run independent counts in parallel for performance, filtered by orgId
    const [
      totalEmployees,
      totalBenefits,
      employeesByStatus,
      benefitsByType,
      totalCostAgg
    ] = await Promise.all([
      prisma.employee.count({ where: { organizationId: orgId, deletedAt: null } }),
      prisma.benefit.count({ where: { organizationId: orgId, deletedAt: null } }),
      prisma.employee.groupBy({ 
        where: { organizationId: orgId, deletedAt: null },
        by: ['status'], 
        _count: true 
      }),
      prisma.benefit.groupBy({ 
        where: { organizationId: orgId, deletedAt: null },
        by: ['type'], 
        _count: true 
      }),
      prisma.benefit.aggregate({ 
        where: { organizationId: orgId, deletedAt: null },
        _sum: { cost: true } 
      })
    ]);

    const stats = {
      totalEmployees,
      totalBenefits,
      employeesByStatus: employeesByStatus.map(s => ({
        status: s.status,
        count: s._count
      })),
      benefitsByType: benefitsByType.map(b => ({
        type: b.type,
        count: b._count
      })),
      totalCost: totalCostAgg._sum.cost || 0,
      timestamp: new Date().toISOString()
    };

    // Cache results for 5 minutes (org-specific)
    await redis.setex(cacheKey, 300, JSON.stringify(stats));
    
    return res.json(stats);
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export const getEventLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user!.organizationId;
    // For general events, we could still filter by org if they are logged that way
    // But currently EventLog in the schema doesn't have orgId.
    // However, for an Enterprise SaaS, we should probably use AuditLog here
    const logs = await prisma.auditLog.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true } } }
    });
    
    return res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user!.organizationId;
    const userId = req.user!.userId;
    
    const notifications = await prisma.notification.findMany({
      where: { organizationId: orgId, userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user!.organizationId;
    const userId = req.user!.userId;
    const { id } = req.params;
    
    await prisma.notification.updateMany({
      where: { id, organizationId: orgId, userId: userId },
      data: { read: true }
    });
    
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
