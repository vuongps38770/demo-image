# Phase 4: Integration & Verification Plan

This phase covers testing the integration of the React Frontend, NestJS Backend, and ComfyUI Worker to ensure a seamless end-to-end user experience.

## 1. Local Development Launch Procedure
To test locally, we will launch three separate processes:
1. **Frontend Dev Server**: `npm run dev` in `frontend/` (defaulting to Port 5174).
2. **Backend Service**: `npm run start:dev` in `backend/` (listening on Port 3000).
3. **Worker process**: `npm run start` in `worker/`.
4. **ComfyUI Server**: Local instance running on port 8188.

## 2. Integration Test Scenario
We will verify the system end-to-end:
1. **Login**:
   - Access the login page.
   - Enter a username (e.g. `test_designer`).
   - Confirm redirects to Dashboard.
2. **Text-To-Image Generation**:
   - Switch to "Text to Image" tab.
   - Input: `"A high-detail wooden chest on a black background"`.
   - Click "Generate Asset".
   - **Verification**:
     - Status tracker appears below indicating "QUEUED".
     - Transition to "PROCESSING" with incremental progress steps.
     - Final state changes to "COMPLETED".
     - Result image renders correctly in the grid.
3. **Asset-Change Generation**:
   - Upload a custom image.
   - Select the prompt: `"Transform it to wooden style"`.
   - Click "Generate Asset".
   - **Verification**:
     - The job is queued and processed.
     - Hover comparison slider works correctly between base image and generated image.
     - Copy prompt and Reuse prompt functionality works.

---

## 3. Status Log
| Item | Status | Notes |
| :--- | :--- | :--- |
| **API Endpoints Connectivity** | 🔴 Pending | Awaiting Phase 2 & 3 |
| **Worker Queue Connection** | 🔴 Pending | Awaiting Phase 2 & 3 |
| **ComfyUI WebSocket Connection** | 🔴 Pending | Awaiting Phase 2 & 3 |
| **Frontend-Backend Integration** | 🔴 Pending | Awaiting Phase 2 & 3 |
| **End-to-End Success Path** | 🔴 Pending | Awaiting Phase 2 & 3 |
