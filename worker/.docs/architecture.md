# Worker Architecture

## 1. Tech Stack
- **Environment**: Node.js
- **Queue Consumer**: BullMQ `Worker`
- **AI Engine API**: ComfyUI REST & WebSocket API
- **State Storage**: Redis (Shared with Backend)

## 2. Architecture Flow
1. BullMQ `Worker` instance initialized, connecting to Redis.
2. The `process` function is triggered with a `Job` payload.
3. The worker parses the `job.data` to extract `type` and user inputs (prompts/images).
4. Worker injects inputs into the corresponding ComfyUI workflow JSON.
5. Worker sends a `POST /prompt` request to ComfyUI.
6. Worker connects to ComfyUI's WebSocket to listen for progress events.
7. Worker pushes progress updates back to Redis (via BullMQ `job.updateProgress`).
8. Upon completion, worker fetches the generated image, uploads it if necessary, and marks the job as `completed` with the final image URL.
