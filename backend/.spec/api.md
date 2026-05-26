# API Specifications

## 1. Overview
This service uses a simple REST API. Fake authentication is handled by passing `x-username` in the headers of requests.

## 2. Endpoints

### 2.1 Submit a Job
- **Method**: `POST /api/jobs`
- **Headers**: `x-username: <string>`
- **Body**:
  ```json
  {
    "type": "GEN_IMAGE", // or "GEN_ASSET"
    "payload": {
      "prompt": "A cute cat",
      "image_url": "optional_for_asset"
    }
  }
  ```
- **Response**:
  ```json
  {
    "jobId": "uuid-string",
    "status": "queued"
  }
  ```

### 2.2 Get User Jobs
- **Method**: `GET /api/jobs/me`
- **Headers**: `x-username: <string>`
- **Response**: List of jobs associated with this username.
  ```json
  [
    {
      "jobId": "uuid-string",
      "type": "GEN_IMAGE",
      "status": "completed",
      "resultUrl": "..."
    }
  ]
  ```

### 2.3 Get Job Status
- **Method**: `GET /api/jobs/:jobId`
- **Response**: Exact status and progress of the job.
  ```json
  {
    "jobId": "uuid-string",
    "status": "processing",
    "progress": 50
  }
  ```
