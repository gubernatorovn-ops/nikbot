import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { TelegramService } from '../bots/platforms/telegram.service';

@Injectable()
export class FlowExecutorService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async execute(automationId: string, contactId: string, trigger: any) {
    const automation = await this.prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!automation || !automation.isActive) return;

    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      include: { bot: true },
    });

    if (!contact) return;

    const execution = await this.prisma.automationExecution.create({
      data: {
        automationId,
        contactId,
        variables: { trigger },
      },
    });

    const nodes = automation.nodes as any[];
    const edges = automation.edges as any[];

    try {
      const startNode = nodes.find((n) => n.type === 'TRIGGER_START');
      if (startNode) {
        await this.executeNode(startNode, nodes, edges, contact, execution.id);
      }

      await this.prisma.automationExecution.update({
        where: { id: execution.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    } catch (error) {
      await this.prisma.automationExecution.update({
        where: { id: execution.id },
        data: { status: 'FAILED', error: error.message },
      });
    }
  }

  private async executeNode(node: any, nodes: any[], edges: any[], contact: any, executionId: string) {
    switch (node.type) {
      case 'SEND_MESSAGE':
        await this.telegramService.sendMessage(
          contact.bot.accessToken,
          contact.platformUserId,
          node.config.text || '',
        );
        break;

      case 'SEND_BUTTONS':
        await this.telegramService.sendMessage(
          contact.bot.accessToken,
          contact.platformUserId,
          node.config.text || '',
          node.config.buttons,
        );
        break;

      case 'DELAY':
        const ms = (node.config.duration || 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, ms));
        break;

      case 'ADD_TAG':
        if (node.config.tag) {
          await this.prisma.contact.update({
            where: { id: contact.id },
            data: { tags: { push: node.config.tag } },
          });
        }
        break;

      case 'ADD_POINTS':
        if (node.config.points) {
          await this.prisma.contact.update({
            where: { id: contact.id },
            data: { points: { increment: node.config.points } },
          });
        }
        break;

      case 'END':
        return;
    }

    const nextEdge = edges.find((e) => e.source === node.id);
    if (nextEdge) {
      const nextNode = nodes.find((n) => n.id === nextEdge.target);
      if (nextNode) {
        await this.executeNode(nextNode, nodes, edges, contact, executionId);
      }
    }
  }
}
