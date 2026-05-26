import axios from 'axios';
import * as path from 'path';
import { config } from '../config/config.js';

export class ComfyClient {
  /**
   * Download base image from backend or external URL.
   */
  static async downloadAssetImage(url: string): Promise<Buffer> {
    const targetUrl = url.startsWith('http') ? url : `${config.backend.url}${url}`;
    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  }

  /**
   * Upload an image buffer to ComfyUI input folder.
   * Returns the filename assigned by ComfyUI.
   */
  static async uploadImage(imageBuffer: Buffer, originalFilename: string): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' });

    // Append the blob to form data, matching name 'image' expected by ComfyUI
    formData.append('image', blob, originalFilename);
    formData.append('overwrite', 'true');

    const response = await axios.post<{ name: string }>(
      `${config.comfyui.apiUrl}/upload/image`,
      formData,
      {
        headers: {
          // axios automatically sets correct content-type for FormData in Node 18+
        },
      }
    );

    if (!response.data || !response.data.name) {
      throw new Error(`Upload to ComfyUI failed: ${JSON.stringify(response.data)}`);
    }

    return response.data.name;
  }

  /**
   * Submit prompt workflow to ComfyUI REST endpoint.
   * Returns the prompt_id.
   */
  static async queuePrompt(prompt: any, clientId: string): Promise<string> {
    const response = await axios.post<{ prompt_id: string }>(
      `${config.comfyui.apiUrl}/prompt`,
      {
        client_id: clientId,
        prompt,
      }
    );

    if (!response.data || !response.data.prompt_id) {
      throw new Error(`Queue prompt failed: ${JSON.stringify(response.data)}`);
    }

    return response.data.prompt_id;
  }

  /**
   * Download the generated image from ComfyUI.
   */
  static async downloadImage(filename: string, type: string = 'output', subfolder: string = ''): Promise<Buffer> {
    const response = await axios.get(
      `${config.comfyui.apiUrl}/view`,
      {
        params: {
          filename,
          type,
          subfolder,
        },
        responseType: 'arraybuffer',
      }
    );
    return Buffer.from(response.data);
  }

  /**
   * Upload an image buffer to backend storage.
   * Returns the URL of the uploaded image.
   */
  static async uploadImageToBackend(imageBuffer: Buffer, filename: string): Promise<string> {
    const formData = new FormData();
    const ext = path.extname(filename).toLowerCase() || '.png';
    
    // Set correct mimetype for validation
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.webp') {
      mimeType = 'image/webp';
    } else if (ext === '.gif') {
      mimeType = 'image/gif';
    }
    
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
    formData.append('file', blob, filename);

    const response = await axios.post<{ url: string }>(
      `${config.backend.url}/api/upload`,
      formData
    );

    if (!response.data || !response.data.url) {
      throw new Error(`Upload to backend failed: ${JSON.stringify(response.data)}`);
    }

    return response.data.url;
  }
}
