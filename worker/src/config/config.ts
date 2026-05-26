import * as dotenv from 'dotenv';
import * as path from 'path';

import { fileURLToPath } from 'url';

// Load environment variables from .env file if it exists
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    tls: process.env.REDIS_TLS === 'true',
  },
  comfyui: {
    apiUrl: process.env.COMFYUI_API_URL || 'http://127.0.0.1:8188',
    wsUrl: process.env.COMFYUI_WS_URL || 'ws://127.0.0.1:8188/ws',
  },
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:3000',
  },
  // Write output directly to backend's uploads directory for local development
  outputDir: process.env.OUTPUT_DIR || path.resolve(__dirname, '../../../backend/uploads'),
};
