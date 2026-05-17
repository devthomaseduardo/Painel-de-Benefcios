import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { createAuditLog } from '../lib/audit';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { organization: true }
    });
    
    if (!user || user.deletedAt) {
      return res.status(401).json({ message: 'Credenciais inválidas ou conta desativada.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role, 
        organizationId: user.organizationId 
      },
      secret,
      { expiresIn: '1d' }
    );

    await createAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, organizationName, organizationSlug } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    // Enterprise flow: creating organization AND the owner user
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug || organizationName.toLowerCase().replace(/ /g, '-'),
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'owner', // First user is the owner
          organizationId: org.id
        }
      });

      return { user, org };
    });

    await createAuditLog({
      organizationId: result.org.id,
      userId: result.user.id,
      action: 'CREATE',
      entityType: 'ORGANIZATION',
      entityId: result.org.id,
      newData: result.org,
      ipAddress: req.ip
    });

    res.status(201).json({
      message: 'Organização e conta criadas com sucesso',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        organization: result.org
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
