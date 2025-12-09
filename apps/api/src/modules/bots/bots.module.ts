import { Module } from '@nestjs/common';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { WebhookController } from './webhook.controller';
import { TelegramService } from './platforms/telegram.service';
import { InstagramService } from './platforms/instagram.service';
import { TiktokService } from './platforms/tiktok.service';

@Module({
  controllers: [BotsController, WebhookController],
  providers: [BotsService, TelegramService, InstagramService, TiktokService],
  exports: [BotsService, TelegramService],
})
export class BotsModule {}
