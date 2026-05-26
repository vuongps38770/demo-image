# Business Requirements

## 1. Overview
The goal is to build an Image Generation Service Demo using NestJS and Clean Architecture. This service acts as a queue manager and job tracker for ComfyUI. 

## 2. Core Features
1. **Text-to-Image Generation (GEN_IMAGE)**: Users provide a prompt to generate an image.
2. **Skin Asset Change (GEN_ASSET)**: Users provide an asset image and change its style/skin.
3. **Single Queue System**: All jobs (both GEN_IMAGE and GEN_ASSET) are placed into a single queue.
4. **Worker Dispatcher**: A background worker pulls from the queue, checks the job type, and executes the appropriate ComfyUI workflow.
5. **Fake Authentication**: Users are identified via a simple string (e.g., `username`). No password or complex auth is required.
6. **User Job Tracking**: Users can view the status of their own jobs (pending, processing, completed, failed) based on their username.
7. **No SQL**: All state (job queues, job status, user job history) is managed entirely in Redis.

## 3. Tech Stack
- Framework: NestJS
- Queue: BullMQ
- DB/Storage: Redis
- AI Engine: ComfyUI
