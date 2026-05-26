# Phase 2: Backend (NestJS) Setup & Design

This phase covers setting up the NestJS workspace, implementing Clean Architecture layers, configuring Redis storage, and exposing APIs for the React frontend.

## 1. Directory Structure (Clean Architecture)
The backend project inside `create_image_demo/backend` will be structured as follows:
```
backend/
├── src/
│   ├── domain/                  # Enterprise Rules & Types
│   │   ├── job/
│   │   │   ├── job.entity.ts    # Job properties and status types
│   │   │   └── job.repository.ts # Interface for storing/fetching jobs
│   │   
│   ├── application/             # Business Logic & Orchestration
│   │   ├── job/
│   │   │   └── job.usecases.ts  # Use cases: CreateJob, GetUserJobs, GetJobById
│   │   
│   ├── infrastructure/          # Frameworks & Adapters (Implementations)
│   │   ├── redis/
│   │   │   ├── redis.module.ts
│   │   │   └── redis.repository.impl.ts # Implements domain's job.repository.ts
│   │   ├── queue/
│   │   │   ├── queue.module.ts
│   │   │   └── bullmq.service.ts # Adapter for BullMQ queue manager
│   │   ├── config/
│   │   │   └── env.config.ts    # Port, Redis connection, ComfyUI URL
│   │   
│   ├── delivery/                # Controllers (HTTP, WebSockets, etc.)
│   │   ├── http/
│   │   │   ├── job.controller.ts # Rest endpoints
│   │   │   └── dto/
│   │   │       └── create-job.dto.ts
│   │   
│   ├── app.module.ts
│   └── main.ts
```

## 2. SQLite Database Schema & Redis Strategy
Instead of pure Redis storage, we will use **SQLite** (using TypeORM or Sequelize) for reliable data persistence (User history & generated assets) and **Redis/BullMQ** purely for asynchronous job queuing and worker message passing.

### SQLite Job Table Schema
*   `id` (VARCHAR, Primary Key) - Job UUID.
*   `username` (VARCHAR, Index) - Owner of the generation.
*   `type` (VARCHAR) - `text-to-image` or `asset-change`.
*   `prompt` (TEXT) - Prompt text input.
*   `status` (VARCHAR) - `queued`, `processing`, `completed`, `failed`.
*   `progress` (INTEGER) - 0 to 100 percentage.
*   `resultUrl` (TEXT, Nullable) - HTTP URL of the finished image.
*   `assetName` (TEXT, Nullable) - Original name of uploaded base file.
*   `assetImgUrl` (TEXT, Nullable) - Static url of the uploaded base image.
*   `createdAt` (DATETIME) - Creation timestamp.

### Redis Queue Strategy
*   **Queue Name**: `image-generation-queue`.
*   **BullMQ Producer**: NestJS Backend pushes job payloads containing `id`, `type`, `prompt`, `assetImgUrl` (if custom) to the queue.
*   **Progress Tracking**: The worker updates the BullMQ job progress. The Backend controller polls the SQLite database or listens to BullMQ events to update the SQLite job table.

---

## 3. Upload & Static File Serving
To support custom image uploads from the React frontend:
1.  **Serve Static Files**: NestJS configures `ServeStaticModule` to expose a local folder `uploads/` at route `/uploads/`.
2.  **Upload API Endpoint**:
    *   `POST /api/upload`
    *   Form-Data Payload: `file` (Image)
    *   Response:
        ```json
        {
          "url": "http://localhost:3000/uploads/17797829-custom.png",
          "filename": "17797829-custom.png"
        }
        ```
    *   Implementation: Use NestJS `FileInterceptor` and local disk storage using Multer.

---

## 4. API Endpoints
*   `POST /api/jobs`
    *   Headers: `x-username: <username>`
    *   Body:
        ```json
        {
          "type": "text-to-image" | "asset-change",
          "prompt": "prompt text",
          "assetName": "optional base asset name",
          "assetImgUrl": "optional base asset URL"
        }
        ```
    *   Response: Created SQLite job record.
*   `GET /api/jobs/me`
    *   Headers: `x-username: <username>`
    *   Response: List of SQLite job records belonging to the user.
*   `GET /api/jobs/:id`
    *   Response: Specific job status and progress fetched from SQLite.

---

## 5. Status Log
| Item | Status | Notes |
| :--- | :--- | :--- |
| **NestJS Initialization** | 🟢 Completed | Project initialized and dependencies resolved. |
| **SQLite Database Integration** | 🟢 Completed | TypeORM with SQLite and Job Entity fully implemented. |
| **File Upload API Endpoint** | 🟢 Completed | UploadController and UploadService (Strategy Pattern) implemented. |
| **BullMQ Queue Setup** | 🟢 Completed | BullMQ Module & shared queue integrated. |
| **REST Controller Endpoints** | 🟢 Completed | Job APIs (POST, GET me, GET :id) with validations and CORS enabled. |
