import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class TelegramService {
  constructor(private prisma: PrismaService) {}

  async handleWebhook(botId: string, update: any) {
    const bot = await this.prisma.bot.findUnique({ where: { id: botId } });
    if (!bot) return;

    const message = update.message || update.callback_query?.message;
    if (!message) return;

    const platformUserId = String(message.from.id);

    let contact = await this.prisma.contact.findFirst({
      where: { platformUserId, botId },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          platformUserId,
          platform: 'TELEGRAM',
          username: message.from.username,
          firstName: message.from.first_name,
          lastName: message.from.last_name,
          botId,
          organizationId: bot.organizationId,
        },
      });
    }

    let conversation = await this.prisma.conversation.findFirst({
      where: { contactId: contact.id, botId },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { contactId: contact.id, botId },
      });
    }

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        contactId: contact.id,
        direction: 'INBOUND',
        content: message.text || '',
        platformMessageId: String(message.message_id),
      },
    });

    return { contact, conversation };
  }

  async sendMessage(botToken: string, chatId: string, text: string, buttons?: any[]) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const body: any = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };

    if (buttons && buttons.length > 0) {
      body.reply_markup = {
        inline_keyboard: buttons.map((btn) => [
          { text: btn.text, callback_data: btn.value },
        ]),
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return response.json();
  }
}
