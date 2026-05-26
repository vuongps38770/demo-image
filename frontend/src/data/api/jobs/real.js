// Proxied via vite.config.js server.proxy in dev, or customizable via VITE_API_URL env in prod
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const jobsRealApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url; // Relative URL returned from backend, e.g. /uploads/filename.png
  },

  submitJob: async (payload, username) => {
    const response = await fetch(`${BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': username,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Submit job failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { jobId: data.id, status: data.status };
  },

  getUserJobs: async (username) => {
    const response = await fetch(`${BASE_URL}/api/jobs/me`, {
      method: 'GET',
      headers: {
        'x-username': username,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch jobs failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map relative backend paths to absolute URLs for frontend display
    return data.map(job => {
      let resultUrl = job.resultUrl;
      if (resultUrl && !resultUrl.startsWith('http')) {
        resultUrl = `${BASE_URL}${resultUrl}`;
      }
      
      let assetImgUrl = job.assetImgUrl;
      if (assetImgUrl && !assetImgUrl.startsWith('http')) {
        assetImgUrl = `${BASE_URL}${assetImgUrl}`;
      }

      // Generate matching step texts based on job status and progress
      let stepText = 'Waiting in queue...';
      if (job.status === 'processing') {
        stepText = `Generating... (${job.progress}%)`;
      } else if (job.status === 'completed') {
        stepText = 'Done!';
      } else if (job.status === 'failed') {
        stepText = 'Generation Failed';
      }

      return {
        ...job,
        resultUrl,
        assetImgUrl,
        stepText,
      };
    });
  },

  deleteJob: async (id) => {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Delete job failed: ${response.statusText}`);
    }
  }
};
