import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ComfyClient } from '../comfy/comfy-client.js';
import { listenToJob } from '../comfy/ws-listener.js';
import { config } from '../config/config.js';

// Resolve __dirname since we use ES modules / nodenext
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface JobData {
  id: string;
  username: string;
  type: string;
  prompt: string;
  assetName?: string;
  assetImgUrl?: string;
  aspectRatio?: string;
}

export async function processJob(job: Job<JobData>): Promise<string> {
  const { id: jobId, type, prompt, assetImgUrl, aspectRatio } = job.data;
  console.log(`[Processor] Processing job ${jobId} of type '${type}'`);

  try {
    // 1. Resolve workflow file path and load template JSON
    const workflowFile = type === 'text-to-image' ? 't2i.json' : 'change_style.json';
    const workflowPath = path.resolve(__dirname, '../../src/comfy/workflows', workflowFile);
    
    if (!fs.existsSync(workflowPath)) {
      throw new Error(`Workflow file not found at: ${workflowPath}`);
    }

    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const workflow = JSON.parse(workflowContent);

    let targetNodeId = '';

    // 2. Modify workflow based on job type
    if (type === 'text-to-image') {
      targetNodeId = '12'; // Node ID for output in t2i workflow
      
      // Inject prompt
      if (!workflow['4'] || !workflow['4'].inputs) {
        throw new Error('Invalid t2i workflow JSON: missing node 4 inputs');
      }
      workflow['4'].inputs.text = prompt;

      // Adjust dimensions based on aspectRatio
      let width = 1024;
      let height = 1024;

      if (aspectRatio === 'vertical') {
        width = 896;
        height = 1152;
      } else if (aspectRatio === 'horizontal') {
        width = 1152;
        height = 896;
      }

      if (workflow['7'] && workflow['7'].inputs) {
        workflow['7'].inputs.value = width;
      }
      if (workflow['9'] && workflow['9'].inputs) {
        workflow['9'].inputs.value = height;
      }
      console.log(`[Processor] Aspect ratio: ${aspectRatio || 'square'} (Width: ${width}, Height: ${height})`);

    } else if (type === 'asset-change' || type === 'style-change') {
      targetNodeId = '40'; // Node ID for output in style change workflow
      
      // Inject prompt
      if (!workflow['9'] || !workflow['9'].inputs) {
        throw new Error('Invalid change_style workflow JSON: missing node 9 inputs');
      }
      workflow['9'].inputs.text = prompt;

      // Handle asset image download and upload to ComfyUI
      if (assetImgUrl) {
        console.log(`[Processor] Downloading base image from: ${assetImgUrl}`);
        const baseImageBuffer = await ComfyClient.downloadAssetImage(assetImgUrl);
        
        // Generate a unique input name for ComfyUI to avoid collisions
        const extension = path.extname(assetImgUrl.split('?')[0]) || '.png';
        const comfyFilename = `input_${jobId}${extension}`;
        
        console.log(`[Processor] Uploading base image to ComfyUI as: ${comfyFilename}`);
        const uploadedFilename = await ComfyClient.uploadImage(baseImageBuffer, comfyFilename);
        
        // Inject uploaded filename to LoadImage node (53)
        if (!workflow['53'] || !workflow['53'].inputs) {
          throw new Error('Invalid change_style workflow JSON: missing node 53 inputs');
        }
        workflow['53'].inputs.image = uploadedFilename;
      } else {
        throw new Error('Image URL is required for style modification jobs');
      }
    } else {
      throw new Error(`Unknown job type: ${type}`);
    }

    // 3. Connect WS first, then queue job inside the connection callback to prevent race conditions
    const outputImage = await listenToJob(
      jobId,
      targetNodeId,
      async () => {
        return await ComfyClient.queuePrompt(workflow, jobId);
      },
      async (percent) => {
        await job.updateProgress(percent);
      }
    );

    console.log(`[Processor] ComfyUI completed. Output filename: ${outputImage.filename}`);

    // 5. Download the final output image
    const finalImageBuffer = await ComfyClient.downloadImage(
      outputImage.filename,
      outputImage.type,
      outputImage.subfolder
    );

    // 6. Upload final output file directly to backend via its upload API
    const ext = path.extname(outputImage.filename).toLowerCase() || '.png';
    const outputFilename = `result_${jobId}${ext}`;
    console.log(`[Processor] Uploading result image ${outputFilename} to backend...`);
    const backendResultUrl = await ComfyClient.uploadImageToBackend(finalImageBuffer, outputFilename);
    console.log(`[Processor] Saved result image on backend. URL: ${backendResultUrl}`);

    // 7. Extract the relative path /uploads/... from the absolute URL if it is absolute
    let resultPath = backendResultUrl;
    if (resultPath.startsWith('http')) {
      try {
        const parsedUrl = new URL(resultPath);
        resultPath = parsedUrl.pathname; // yields /uploads/...
      } catch (e) {
        console.error('Failed to parse backend result URL:', e);
      }
    }
    return resultPath;

  } catch (error: any) {
    console.error(`[Processor] Job ${jobId} execution failed:`, error);
    throw error; // Propagate error to BullMQ
  }
}
