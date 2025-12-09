import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.bot.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { contacts: true, conversations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contacts: true, conversations: true },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
  }

  async createTelegram(organizationId: string, data: { name: string; token: string }) {
    const response = await fetch(`https://api.telegram.org/bot${data.token}/getMe`);
    const result: any = await response.json();

    if (!result.ok) {
      throw new Error('Invalid Telegram token');
    }

    return this.prisma.bot.create({
      data: {
        name: data.name,
        platform: 'TELEGRAM',
        platformBotId: String(result.result.id),
        username: result.result.username,
        accessToken: data.token,
        organizationId,
      },
    });
  }

  async update(id: string, data: { name?: string; isActive?: boolean }) {
    return this.prisma.bot.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.bot.delete({ where: { id } });
  }
}
