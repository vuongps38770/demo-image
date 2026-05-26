# Frontend Architecture

## 1. Tech Stack
- **Framework**: React + Vite
- **State Management**: Zustand (for global state) + localStorage (for fake auth).
- **Styling**: TailwindCSS

## 2. API Integration
- `apiClient`: A wrapper around `fetch` or `axios` that automatically injects the `x-username` header.
- **Polling Strategy**: The dashboard will ping `GET /api/jobs/me` every 2-3 seconds to update the status of active jobs, until all jobs are either completed or failed.
