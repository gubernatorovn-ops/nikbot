import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generate(data: { systemPrompt?: string; userMessage: string; model?: string }) {
    if (!this.openai) {
      return { response: 'AI не настроен. Добавьте OPENAI_API_KEY.' };
    }

    const response = await this.openai.chat.completions.create({
      model: data.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: data.systemPrompt || 'Ты полезный ассистент.' },
        { role: 'user', content: data.userMessage },
      ],
      max_tokens: 1000,
    });

    return { response: response.choices[0]?.message?.content || '' };
  }

  async improve(data: { text: string; style: string }) {
    if (!this.openai) {
      return { improvedText: 'AI не настроен. Добавьте OPENAI_API_KEY.' };
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Улучши текст в стиле: ${data.style}. Верни только улучшенный текст.` },
        { role: 'user', content: data.text },
      ],
      max_tokens: 1000,
    });

    return { improvedText: response.choices[0]?.message?.content || '' };
  }

  async contentIdeas(data: { topic: string; count: number }) {
    if (!this.openai) {
      return { ideas: ['AI не настроен. Добавьте OPENAI_API_KEY.'] };
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Сгенерируй ${data.count} идей для контента. Верни список идей, каждая с новой строки.` },
        { role: 'user', content: `Тема: ${data.topic}` },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';
    const ideas = content.split('\n').filter((line: string) => line.trim());

    return { ideas };
  }
}
