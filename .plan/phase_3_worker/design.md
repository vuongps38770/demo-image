# Phase 3: Worker & ComfyUI Integration Design

This phase covers building the background worker that processes jobs from the BullMQ queue, interacts with ComfyUI, monitors progress via WebSockets, and writes results to Redis.

## 1. Directory Structure (Worker)
The worker inside `create_image_demo/worker` will be structured as:
```
worker/
├── src/
│   ├── config/
│   │   └── config.ts            # Holds Redis, ComfyUI, and queue configurations
│   ├── comfy/
│   │   ├── comfy-client.ts      # REST calls to ComfyUI (post prompt, check history)
│   │   ├── ws-listener.ts       # WebSocket client to listen for steps and execution notifications
│   │   └── workflows/
│   │       ├── t2i.json           # Workflow template for Text-to-Image
│   │       └── change_style.json  # Workflow template for Asset-Change
│   ├── processor/
│   │   └── job-processor.ts     # Consumer logic triggered by BullMQ
│   └── index.ts                 # Main bootstrap file
```

## 2. Worker Lifecycle
1. **Startup**: Connects to the same Redis instance and starts a BullMQ Worker listening on the shared queue (e.g., `image-generation-queue`).
2. **Retrieve Job**: Receives a job payload (containing job ID, type, prompt, and optional base image url).
3. **Workflow Parsing & Injection**:
   - Reads the corresponding workflow JSON from `src/comfy/workflows/`.
   - **For `t2i` (Text-to-Image)**:
     - Load `t2i.json`.
     - Inject text prompt into Node `4` (`inputs.text`).
     - KSampler: Node `2`, Output Node: Node `12`.
   - **For `asset-change` (Asset-Change)**:
     - Load `change_style.json`.
     - Inject transformation prompt into Node `9` (`inputs.text`).
     - Inject custom uploaded image path/name into Node `53` (`inputs.image`).
     - KSampler: Node `10`, Output Node: Node `40`.
4. **ComfyUI Trigger**: Calls `POST /prompt` on the ComfyUI API to start execution.
5. **WebSocket Listening**:
   - Listens to ComfyUI's WebSocket.
   - For every progress tick (step execution in KSampler Node `2` or `10`), computes progress percentage and calls `job.updateProgress` via BullMQ.
6. **Job Completion**:
   - Listens for ComfyUI execution completion event.
   - Fetches the output image filename from Node `12` (for `t2i`) or Node `40` (for `change_style`).
   - Downloads the image bytes from ComfyUI `GET /view` endpoint.
   - Writes the image bytes to the backend shared folder (`backend/uploads/`) under filename `result-{jobId}.png`.
   - Marks the BullMQ job as completed, updating the SQLite job status to `completed` and setting `resultUrl` to `/uploads/result-{jobId}.png`.

---

## 3. Status Log
| Item | Status | Notes |
| :--- | :--- | :--- |
| **Worker Initialization** | 🔴 Pending | Awaiting Phase 1 completion |
| **ComfyUI REST Client** | 🔴 Pending | Awaiting Phase 1 completion |
| **WebSocket Progress Listener** | 🔴 Pending | Awaiting Phase 1 completion |
| **Workflow Injection Engine** | 🔴 Pending | Awaiting Phase 1 completion |
| **BullMQ Worker setup** | 🔴 Pending | Awaiting Phase 1 completion |
