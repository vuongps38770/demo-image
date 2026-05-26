import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import * as url from 'url';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/upload/image' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: 'mock_uploaded_asset.png', subfolder: '', type: 'input' }));
    return;
  }

  if (pathname === '/prompt' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const clientId = data.client_id;
        const prompt = data.prompt;
        const promptId = `prompt-${Math.random().toString(36).substring(2, 11)}`;

        // Determine if text-to-image or change-style
        // If node 53 exists, it's style change
        let targetNode = '12';
        if (prompt && prompt['53']) {
          targetNode = '40';
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ prompt_id: promptId, number: 1, node_errors: {} }));

        // Trigger the mock execution simulation
        simulateExecution(clientId, promptId, targetNode);
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  if (pathname === '/view' && req.method === 'GET') {
    // Return a 1x1 red PNG
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const imgBuffer = Buffer.from(pngBase64, 'base64');
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imgBuffer);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const wss = new WebSocketServer({ noServer: true });
const clients = new Map<string, WebSocket>();

server.on('upgrade', (req, socket, head) => {
  const parsedUrl = url.parse(req.url || '', true);
  if (parsedUrl.pathname === '/ws') {
    const clientId = parsedUrl.query.clientId as string;
    wss.handleUpgrade(req, socket, head, (ws) => {
      if (clientId) {
        clients.set(clientId, ws);
        ws.on('close', () => {
          clients.delete(clientId);
        });
      }
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

function simulateExecution(clientId: string, promptId: string, targetNode: string) {
  setTimeout(async () => {
    const ws = clients.get(clientId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log(`[Mock ComfyUI] WS client not connected for ${clientId}, waiting 1s...`);
      setTimeout(() => simulateExecution(clientId, promptId, targetNode), 1000);
      return;
    }

    console.log(`[Mock ComfyUI] Starting simulation for client ${clientId}, prompt ${promptId}`);

    // Send execution start
    ws.send(JSON.stringify({
      type: 'execution_start',
      data: { prompt_id: promptId }
    }));

    // KSampler progress steps
    const totalSteps = 8;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({
        type: 'progress',
        data: { value: step, max: totalSteps, prompt_id: promptId }
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    if (ws.readyState !== WebSocket.OPEN) return;

    // Send executed event (node output)
    ws.send(JSON.stringify({
      type: 'executed',
      data: {
        prompt_id: promptId,
        node: targetNode,
        output: {
          images: [
            {
              filename: `mock_result_${promptId}.png`,
              type: 'output',
              subfolder: ''
            }
          ]
        }
      }
    }));

    await new Promise(resolve => setTimeout(resolve, 100));
    if (ws.readyState !== WebSocket.OPEN) return;

    // Send executing done (node null)
    ws.send(JSON.stringify({
      type: 'executing',
      data: {
        node: null,
        prompt_id: promptId
      }
    }));

    console.log(`[Mock ComfyUI] Finished simulation for client ${clientId}`);
  }, 500);
}

server.listen(8188, '127.0.0.1', () => {
  console.log('Mock ComfyUI Server running at http://127.0.0.1:8188');
});
