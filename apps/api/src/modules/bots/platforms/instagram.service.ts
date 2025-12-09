import { Injectable } from '@nestjs/common';

@Injectable()
export class InstagramService {
  async handleWebhook(botId: string, payload: any) {
    console.log('Instagram webhook:', botId, payload);
    return { status: 'ok' };
  }

  async sendMessage(accessToken: string, recipientId: string, text: string) {
    console.log('Instagram send:', recipientId, text);
    return { status: 'not_implemented' };
  }
}
