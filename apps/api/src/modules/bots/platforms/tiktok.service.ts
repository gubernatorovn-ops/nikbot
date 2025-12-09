import { Injectable } from '@nestjs/common';

@Injectable()
export class TiktokService {
  async handleWebhook(botId: string, payload: any) {
    console.log('TikTok webhook:', botId, payload);
    return { status: 'ok' };
  }

  async sendMessage(accessToken: string, recipientId: string, text: string) {
    console.log('TikTok send:', recipientId, text);
    return { status: 'not_implemented' };
  }
}
