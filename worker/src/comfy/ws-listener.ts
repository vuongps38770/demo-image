import WebSocket from 'ws';
import { config } from '../config/config.js';

export interface ComfyOutputImage {
  filename: string;
  type: string;
  subfolder: string;
}

/**
 * Listens to a ComfyUI execution via WebSockets.
 * Tracks progress and resolves with the output image info once complete.
 */
export function listenToJob(
  clientId: string,
  targetNodeId: string,
  queueJob: () => Promise<string>,
  onProgress: (percent: number) => void
): Promise<ComfyOutputImage> {
  return new Promise((resolve, reject) => {
    // Append client_id to WebSocket URL to isolate events
    const wsUrl = `${config.comfyui.wsUrl}?clientId=${clientId}`;
    const ws = new WebSocket(wsUrl);
    
    let resolved = false;
    let outputImage: ComfyOutputImage | null = null;
    let promptId: string | null = null;

    const cleanup = () => {
      ws.close();
    };

    ws.on('open', async () => {
      console.log(`[WS] Connected for client ${clientId}. Queueing job in ComfyUI...`);
      try {
        promptId = await queueJob();
        console.log(`[WS] Job queued successfully. promptId: ${promptId}`);
      } catch (err) {
        resolved = true;
        cleanup();
        reject(err);
      }
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const payloadStr = typeof data === 'string' ? data : data.toString();
        
        // Skip binary data / image preview frames
        if (!payloadStr.trim().startsWith('{')) {
          return;
        }

        const msg = JSON.parse(payloadStr);
        console.log(`[WS Debug] Received message type: ${msg.type}, node: ${msg.data?.node}, prompt_id: ${msg.data?.prompt_id}`);

        // Check if message belongs to our prompt
        if (promptId && msg.data && msg.data.prompt_id === promptId) {
          switch (msg.type) {
            case 'progress': {
              const { value, max } = msg.data;
              const percent = Math.round((value / max) * 100);
              onProgress(percent);
              break;
            }
            case 'executed': {
              if (String(msg.data.node) === String(targetNodeId)) {
                const images = msg.data.output?.images;
                if (images && images.length > 0) {
                  resolved = true;
                  cleanup();
                  resolve(images[0]);
                }
              }
              break;
            }
            case 'executing': {
              // node: null means execution is finished (fallback)
              if (msg.data.node === null) {
                if (outputImage) {
                  resolved = true;
                  cleanup();
                  resolve(outputImage);
                } else {
                  resolved = true;
                  cleanup();
                  reject(new Error(`ComfyUI finished execution but did not output target node ${targetNodeId}`));
                }
              }
              break;
            }
            case 'execution_error': {
              resolved = true;
              cleanup();
              reject(new Error(`ComfyUI execution error: ${JSON.stringify(msg.data.node_errors || msg.data)}`));
              break;
            }
          }
        }
      } catch (err) {
        console.error('[WS] Error processing message:', err);
      }
    });

    ws.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(err);
      }
    });

    ws.on('close', () => {
      if (!resolved) {
        resolved = true;
        reject(new Error('WebSocket connection closed unexpectedly before job finished'));
      }
    });
  });
}
