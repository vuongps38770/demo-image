# Phase 1: Preconditions & Requirements

Before we start building the backend (BE) and worker, we need certain files, configurations, and connectivity details. This document logs the required items.

## 1. Required Inputs from the User
Please provide or configure the following details:

### A. ComfyUI Workflow JSONs
We need the API-format JSON files for ComfyUI. 
*Note: In ComfyUI, you must enable "Developer mode" in settings, then click "Save (API Format)" to export the correct JSON.*

1. **Text-to-Image Workflow**: The workflow JSON for generating images (e.g. using SDXL, Flux, etc.). We need to know:
   - Which node ID is the **KSampler** (to listen for progress steps)?
   - Which node ID is the **CLIP Text Encode** (where we inject the text prompt)?
   - Which node ID is the **Save Image** or **Preview Image** (where the output image filename/UUID is generated)?
2. **Asset Change (Image-to-Image) Workflow**: The workflow JSON for changing/restyling an uploaded image. We need to know:
   - Which node ID is the **Load Image** (where we inject the URL/path of the user-uploaded base image)?
   - Which node ID is the **CLIP Text Encode** (where we inject the transformation prompt)?
   - Which node ID is the **KSampler** (for progress tracking)?
   - Which node ID is the **Save/Preview Image** (for output)?

### B. Environment & Service Connections
1. **ComfyUI Server Address**: Where is the ComfyUI server hosted (e.g. `http://127.0.0.1:8188` or a remote IP)?
2. **Redis Connection Settings**: Where is Redis running? (e.g., host `127.0.0.1`, port `6379`, password, database number).
3. **Storage / Hosting for Generated Images**: 
   - When the worker generates an image, how does the frontend access it?
   - Do we serve it directly from the ComfyUI output directory (e.g. through NestJS static files), or upload it to a cloud storage (like S3/Cloudinary), or does ComfyUI run on the same machine where the backend serves static files?

---

## 2. Status Log
| Item | Status | Notes |
| :--- | :--- | :--- |
| **ComfyUI JSON - Text-to-Image** | 🟢 Completed | Saved as [t2i.json](file:///d:/vuong_code/sena_repo/create_image_demo/worker/src/comfy/workflows/t2i.json) (CLIP input node: 4, KSampler: 2, Output node: 12) |
| **ComfyUI JSON - Asset-Change** | 🟢 Completed | Saved as [change_style.json](file:///d:/vuong_code/sena_repo/create_image_demo/worker/src/comfy/workflows/change_style.json) (CLIP input node: 9, LoadImage node: 53, KSampler: 10, Output node: 40) |
| **ComfyUI Server Address** | 🟢 Set | Target is `http://127.0.0.1:8188` |
| **Redis Connection Settings** | 🟢 Set | Target is `127.0.0.1:6379` |
| **Database Strategy** | 🟢 SQLite | Used for storing user entries and job history/results. |
| **Image Storage Strategy** | 🟢 NestJS Static | Backend exposes an upload endpoint & serves files statically from a local `uploads/` folder. |
