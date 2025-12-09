import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AutomationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.automation.findMany({
      where: { organizationId },
      include: {
        automationBots: {
          include: { bot: true },
        },
        _count: {
          select: { executions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const automation = await this.prisma.automation.findUnique({
      where: { id },
      include: {
        automationBots: {
          include: { bot: true },
        },
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }

  async create(organizationId: string, data: {
    name: string;
    description?: string;
    triggerType: string;
    triggerConfig?: any;
  }) {
    return this.prisma.automation.create({
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType as any,
        triggerConfig: data.triggerConfig || {},
        organizationId,
        nodes: [
          {
            id: 'trigger-1',
            type: 'TRIGGER_START',
            name: 'Start',
            config: {},
            position: { x: 250, y: 50 },
          },
        ],
        edges: [],
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    isActive?: boolean;
    triggerConfig?: any;
  }) {
    return this.prisma.automation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.automation.delete({ where: { id } });
  }

  async saveFlow(id: string, nodes: any[], edges: any[]) {
    return this.prisma.automation.update({
      where: { id },
      data: { nodes, edges },
    });
  }

  async assignToBots(id: string, botIds: string[]) {
    await this.prisma.automationBot.deleteMany({
      where: { automationId: id },
    });

    if (botIds.length > 0) {
      await this.prisma.automationBot.createMany({
        data: botIds.map((botId) => ({
          automationId: id,
          botId,
        })),
      });
    }

    return this.findById(id);
  }
}
