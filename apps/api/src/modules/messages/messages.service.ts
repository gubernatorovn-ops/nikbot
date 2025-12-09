import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(organizationId: string, params: { page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const conversations = await this.prisma.conversation.findMany({
      where: { bot: { organizationId } },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        contact: true,
        bot: { select: { id: true, name: true, platform: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const items = conversations.map((conv) => ({
      id: conv.id,
      contact: conv.contact,
      bot: conv.bot,
      lastMessage: conv.messages[0] || null,
      unreadCount: 0,
      updatedAt: conv.updatedAt,
    }));

    return { items, page, limit };
  }

  async getMessages(conversationId: string, params: { page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const items = await this.prisma.message.findMany({
      where: { conversationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return { items, page, limit };
  }
}
