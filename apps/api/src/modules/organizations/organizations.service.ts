import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        subscription: true,
        _count: {
          select: {
            bots: true,
            contacts: true,
            automations: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async getStats(id: string) {
    const [contacts, bots, automations, messages] = await Promise.all([
      this.prisma.contact.count({ where: { organizationId: id } }),
      this.prisma.bot.count({ where: { organizationId: id } }),
      this.prisma.automation.count({ where: { organizationId: id } }),
      this.prisma.message.count({
        where: { conversation: { bot: { organizationId: id } } },
      }),
    ]);

    const recentContacts = await this.prisma.contact.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return { contacts, bots, automations, messages, recentContacts };
  }

  async getMembers(id: string) {
    return this.prisma.organizationMember.findMany({
      where: { organizationId: id },
      include: {
        user: {
          select: { id: true, email: true, name: true, avatar: true },
        },
      },
    });
  }
}
