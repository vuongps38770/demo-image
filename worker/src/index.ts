import { Worker, ConnectionOptions } from 'bullmq';
import { config } from './config/config.js';
import { processJob } from './processor/job-processor.js';

console.log('Starting image generation worker...');
console.log('Redis config:', {
  host: config.redis.host,
  port: config.redis.port,
  tls: config.redis.tls,
});
console.log('ComfyUI REST URL:', config.comfyui.apiUrl);
console.log('ComfyUI WS URL:', config.comfyui.wsUrl);
console.log('Output Directory:', config.outputDir);

const connection: ConnectionOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  username: config.redis.username,
  tls: config.redis.tls ? {} : undefined,
};

const worker = new Worker(
  'image-generation-queue',
  async (job) => {
    return processJob(job);
  },
  {
    connection,
    concurrency: 1,
  }
);

worker.on('ready', () => {
  console.log('--------------------------------------------------');
  console.log('Worker is active and listening to [image-generation-queue]');
  console.log('--------------------------------------------------');
});

worker.on('active', (job) => {
  console.log(`[Worker] Job ${job.id} is now active.`);
});

worker.on('completed', (job, result) => {
  console.log(`[Worker] Job ${job.id} completed successfully. Result: ${result}`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});

worker.on('error', (err) => {
  console.error('[Worker] Connection or internal error:', err);
});

// Graceful shutdown
async function handleShutdown(signal: string) {
  console.log(`[Worker] Received ${signal}. Closing worker queue connection...`);
  try {
    await worker.close();
    console.log('[Worker] Graceful shutdown complete.');
    process.exit(0);
  } catch (error) {
    console.error('[Worker] Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
