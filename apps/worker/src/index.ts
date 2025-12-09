import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { processIncomingMessage } from './processors/incoming-message';
import { processOutgoingMessage } from './processors/outgoing-message';
import { processAi } from './processors/ai';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

console.log('🚀 Starting ChatFlow Worker...');

const incomingWorker = new Worker('incoming-message', processIncomingMessage, { connection });
const outgoingWorker = new Worker('outgoing-message', processOutgoingMessage, { connection });
const aiWorker = new Worker('ai-processing', processAi, { connection });

incomingWorker.on('completed', (job) => {
  console.log(`✅ Incoming message processed: ${job.id}`);
});

outgoingWorker.on('completed', (job) => {
  console.log(`✅ Outgoing message sent: ${job.id}`);
});

aiWorker.on('completed', (job) => {
  console.log(`✅ AI processing completed: ${job.id}`);
});

incomingWorker.on('failed', (job, err) => {
  console.error(`❌ Incoming message failed: ${job?.id}`, err.message);
});

outgoingWorker.on('failed', (job, err) => {
  console.error(`❌ Outgoing message failed: ${job?.id}`, err.message);
});

aiWorker.on('failed', (job, err) => {
  console.error(`❌ AI processing failed: ${job?.id}`, err.message);
});

console.log('✅ Workers started successfully');
