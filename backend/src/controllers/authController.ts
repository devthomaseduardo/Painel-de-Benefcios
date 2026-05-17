import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';
import prisma from '../lib/prisma';
import { createAuditLog } from '../lib/audit';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signJwt = (user: any) => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId,
    },
    secret,
    { expiresIn: '1d' }
  );
};

const buildUserResponse = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  organization: {
    id: user.organization.id,
    name: user.organization.name,
    slug: user.organization.slug,
  },
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: 'Credenciais inválidas ou conta desativada.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = signJwt(user);
    await createAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ token, user: buildUserResponse(user) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'Google ID token é obrigatório.' });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google client ID não está configurado.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      return res.status(400).json({ message: 'Falha ao verificar conta Google.' });
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const providerId = payload.sub;
    const picture = payload.picture;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (user && user.deletedAt) {
      return res.status(401).json({ message: 'Conta desativada.' });
    }

    if (!user) {
      const domain = email.split('@')[1] || 'google';
      const orgSlug = `${domain.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '').toLowerCase()}-${Date.now()}`;
      const org = await prisma.organization.create({
        data: {
          name: `${domain} Workspace`,
          slug: orgSlug,
        },
      });

      const hashedPassword = await bcrypt.hash(randomBytes(16).toString('hex'), 10);
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'owner',
          organizationId: org.id,
          provider: 'google',
          providerId,
          avatarUrl: picture,
        },
        include: { organization: true },
      });

      await createAuditLog({
        organizationId: org.id,
        userId: user.id,
        action: 'CREATE',
        entityType: 'USER',
        entityId: user.id,
        newData: {
          email: user.email,
          name: user.name,
          provider: 'google',
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } else {
      if (!user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId,
            avatarUrl: picture,
          },
          include: { organization: true },
        });
      }
    }

    const token = signJwt(user);
    await createAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ token, user: buildUserResponse(user) });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Falha no login Google.' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, organizationName, organizationSlug } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug || organizationName.toLowerCase().replace(/ /g, '-'),
        },
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'owner',
          organizationId: org.id,
          provider: 'local',
        },
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
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Organização e conta criadas com sucesso',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        organization: result.org,
      },
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
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
