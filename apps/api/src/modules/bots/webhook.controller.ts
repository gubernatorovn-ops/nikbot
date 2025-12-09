import { Controller, Post, Param, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Queue } from 'bullmq';
import { TelegramService } from './platforms/telegram.service';
import { InstagramService } from './platforms/instagram.service';
import { TiktokService } from './platforms/tiktok.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(
    private telegramService: TelegramService,
    private instagramService: InstagramService,
    private tiktokService: TiktokService,
    @Inject('INCOMING_MESSAGE_QUEUE') private incomingQueue: Queue,
  ) {}

  @Post('telegram/:botId')
  @ApiOperation({ summary: 'Telegram webhook' })
  async telegramWebhook(@Param('botId') botId: string, @Body() body: any) {
    const result = await this.telegramService.handleWebhook(botId, body);

    if (result) {
      await this.incomingQueue.add('process', {
        botId,
        contactId: result.contact.id,
        conversationId: result.conversation.id,
        message: body.message,
      });
    }

    return { ok: true };
  }

  @Post('instagram/:botId')
  @ApiOperation({ summary: 'Instagram webhook' })
  async instagramWebhook(@Param('botId') botId: string, @Body() body: any) {
    return this.instagramService.handleWebhook(botId, body);
  }

  @Post('tiktok/:botId')
  @ApiOperation({ summary: 'TikTok webhook' })
  async tiktokWebhook(@Param('botId') botId: string, @Body() body: any) {
    return this.tiktokService.handleWebhook(botId, body);
  }
}
