import { Response } from 'express';
import prisma from '../lib/prisma';
import { emitEvent } from '../lib/events';
import { AuthRequest } from '../middleware/authMiddleware';
import { createAuditLog } from '../lib/audit';

export const getAllBenefits = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const benefits = await prisma.benefit.findMany({
      where: { 
        organizationId: orgId,
        deletedAt: null
      }
    });
    res.json(benefits);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const benefit = await prisma.benefit.create({
      data: {
        ...req.body,
        organizationId: orgId,
        status: 'pending' // Enterprise workflow starts as pending
      }
    });
    
    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'CREATE',
      entityType: 'BENEFIT',
      entityId: benefit.id,
      newData: benefit,
      ipAddress: req.ip
    });
    
    emitEvent('benefit_created', { benefit, organizationId: orgId });
    res.status(201).json(benefit);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const oldBenefit = await prisma.benefit.findUnique({
      where: { id: req.params.id, organizationId: orgId }
    });

    if (!oldBenefit) return res.status(404).json({ message: 'Benefício não encontrado' });

    const benefit = await prisma.benefit.update({
      where: { id: req.params.id, organizationId: orgId },
      data: req.body
    });
    
    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'UPDATE',
      entityType: 'BENEFIT',
      entityId: benefit.id,
      oldData: oldBenefit,
      newData: benefit,
      ipAddress: req.ip
    });

    emitEvent('benefit_updated', { benefit, organizationId: orgId });
    res.json(benefit);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    
    await prisma.benefit.update({
      where: { id: req.params.id, organizationId: orgId },
      data: { deletedAt: new Date() }
    });
    
    await createAuditLog({
      organizationId: orgId,
      userId: req.user?.userId,
      action: 'DELETE',
      entityType: 'BENEFIT',
      entityId: req.params.id,
      ipAddress: req.ip
    });

    emitEvent('benefit_deleted', { id: req.params.id, organizationId: orgId });
    res.json({ message: 'Benefit archived successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBenefitById = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const benefit = await prisma.benefit.findUnique({
      where: { 
        id: req.params.id,
        organizationId: orgId,
        deletedAt: null
      }
    });
    
    if (!benefit) return res.status(404).json({ message: 'Benefício não encontrado' });
    
    res.json(benefit);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
