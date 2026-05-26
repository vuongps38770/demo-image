# Frontend Requirements

## 1. Overview
A simple web UI demo allowing users to interact with the Image Generation system, submit tasks, and track their progress in real-time.

## 2. User Flows

### 2.1 Fake Authentication
- User enters a `username` to "log in".
- This username is saved in localStorage and sent via the `x-username` header in all API requests.

### 2.2 Task Submission
- **Text to Image**: User enters a text prompt and clicks "Generate".
- **Change Skin Asset**: User uploads an image, provides a style/prompt, and clicks "Process".
- Upon submission, the UI calls `POST /api/jobs` and adds the returned `jobId` to the local tracking list.

### 2.3 Status Tracking Dashboard
- A dashboard that polls or uses WebSockets/SSE to fetch the user's jobs via `GET /api/jobs/me`.
- Displays jobs in a list/grid with their current status (`queued`, `processing`, `completed`, `failed`).
- **Real-time Step & Progress Tracking**:
  - For `processing` jobs, the UI will display a live Progress Bar (0% -> 100%).
  - It will also show text descriptions of the exact ComfyUI execution step (e.g., "Executing KSampler...", "Processing VAE Decode...").
  - This is driven by real-time ComfyUI Websocket data (`executing` and `progress` events) relayed through the backend/Redis.
- Displays the final generated image when `completed`.
