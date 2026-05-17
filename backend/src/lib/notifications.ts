import prisma from './prisma';
import { emitEvent } from './events';

interface NotifyParams {
  organizationId: string;
  userId: string;
  title: string;
  description: string;
  type: 'info' | 'alert' | 'success';
}

export const notifyUser = async (params: NotifyParams) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId,
        title: params.title,
        description: params.description,
        type: params.type,
      },
    });

    // Real-time push via Socket.io
    emitEvent('new_notification', {
      userId: params.userId,
      notification
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const notifyOrgAdmins = async (organizationId: string, params: Omit<NotifyParams, 'organizationId' | 'userId'>) => {
  const admins = await prisma.user.findMany({
    where: { 
      organizationId,
      role: { in: ['owner', 'hr_admin'] }
    }
  });

  for (const admin of admins) {
    await notifyUser({
      ...params,
      organizationId,
      userId: admin.id
    });
  }
};
