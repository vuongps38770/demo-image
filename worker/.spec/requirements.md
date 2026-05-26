# Worker Requirements

## 1. Overview
The Worker service is responsible for consuming jobs from the BullMQ queue and executing the actual image generation/modification tasks via ComfyUI.

## 2. Core Responsibilities
- **Listen to Queue**: Continuously poll the shared Redis queue for new jobs.
- **Job Routing**: Inspect the `type` of the job.
  - If `GEN_IMAGE`: Load the text-to-image workflow JSON.
  - If `GEN_ASSET`: Load the skin asset change workflow JSON.
- **ComfyUI Integration**: Send API requests and WebSocket connections to a local or remote ComfyUI instance to execute the workflow.
- **Status Updates**: Update the job's progress and final status (completed/failed) along with the `resultUrl` in Redis so the Backend API can read it.
- **Error Handling**: Handle ComfyUI crashes or API timeouts gracefully, marking the job as failed and freeing up the worker.
