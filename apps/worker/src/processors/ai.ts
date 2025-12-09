import { Job } from 'bullmq';

let openai: any = null;

const apiKey = process.env.OPENAI_API_KEY;
if (apiKey && apiKey.length > 10) {
  const OpenAI = require('openai').default;
  openai = new OpenAI({ apiKey });
}

export async function processAi(job: Job) {
  const { systemPrompt, userMessage, model } = job.data;

  if (!openai) {
    return { response: 'AI не настроен' };
  }

  const response = await openai.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt || 'Ты полезный ассистент.' },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1000,
  });

  return { response: response.choices[0]?.message?.content || '' };
}
