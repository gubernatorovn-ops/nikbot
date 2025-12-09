import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processOutgoingMessage(job: Job) {
  const { botId, contactId, text, buttons } = job.data;

  const bot = await prisma.bot.findUnique({ where: { id: botId } });
  const contact = await prisma.contact.findUnique({ where: { id: contactId } });

  if (!bot || !contact) {
    throw new Error('Bot or contact not found');
  }

  if (bot.platform === 'TELEGRAM') {
    const url = `https://api.telegram.org/bot${bot.accessToken}/sendMessage`;

    const body: any = {
      chat_id: contact.platformUserId,
      text,
      parse_mode: 'HTML',
    };

    if (buttons && buttons.length > 0) {
      body.reply_markup = {
        inline_keyboard: buttons.map((btn: any) => [
          { text: btn.text, callback_data: btn.value },
        ]),
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result: any = await response.json();

    if (!result.ok) {
      throw new Error(result.description);
    }
  }

  return { sent: true };
}
