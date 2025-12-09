import { Global, Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

@Global()
@Module({
  providers: [
    {
      provide: 'INCOMING_MESSAGE_QUEUE',
      useFactory: () => new Queue('incoming-message', { connection }),
    },
    {
      provide: 'OUTGOING_MESSAGE_QUEUE',
      useFactory: () => new Queue('outgoing-message', { connection }),
    },
    {
      provide: 'AI_QUEUE',
      useFactory: () => new Queue('ai-processing', { connection }),
    },
  ],
  exports: ['INCOMING_MESSAGE_QUEUE', 'OUTGOING_MESSAGE_QUEUE', 'AI_QUEUE'],
})
export class QueueModule {}
