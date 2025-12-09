import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processIncomingMessage(job: Job) {
  const { botId, contactId, conversationId, message } = job.data;

  console.log(`Processing incoming message for bot ${botId}`);

  const automations = await prisma.automation.findMany({
    where: {
      isActive: true,
      automationBots: { some: { botId } },
    },
  });

  for (const automation of automations) {
    const shouldTrigger = checkTrigger(automation, message);

    if (shouldTrigger) {
      console.log(`Triggering automation: ${automation.name}`);
    }
  }

  return { processed: true };
}

function checkTrigger(automation: any, message: any): boolean {
  const { triggerType, triggerConfig } = automation;
  const text = message?.text || '';

  switch (triggerType) {
    case 'MESSAGE':
      return true;

    case 'KEYWORD':
      const keywords = triggerConfig.keywords || [];
      return keywords.some((kw: string) => text.toLowerCase().includes(kw.toLowerCase()));

    case 'COMMAND':
      const command = triggerConfig.command || '/start';
      return text.startsWith(command);

    default:
      return false;
  }
}
