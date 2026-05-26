const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Database
let jobsDb = [];

export const jobsMockApi = {
  uploadFile: async (file) => {
    await new Promise(r => setTimeout(r, 400));
    return URL.createObjectURL(file);
  },

  submitJob: async (payload, username) => {
    await new Promise(r => setTimeout(r, 600));
    const newJob = {
      id: generateId(),
      type: payload.type,
      username,
      status: 'queued',
      progress: 0,
      stepText: 'Waiting in queue...',
      resultUrl: null,
      createdAt: new Date().toISOString(),
      prompt: payload.prompt,
      assetName: payload.assetName,
      assetImgUrl: payload.assetImgUrl
    };
    jobsDb.unshift(newJob);
    
    // Trigger simulation for this job
    simulateJobProgress(newJob.id);

    return { jobId: newJob.id, status: 'queued' };
  },

  getUserJobs: async (username) => {
    await new Promise(r => setTimeout(r, 400));
    return jobsDb.filter(j => j.username === username);
  },

  deleteJob: async (id) => {
    await new Promise(r => setTimeout(r, 200));
    jobsDb = jobsDb.filter(j => j.id !== id);
  }
};

// Background simulator replacing Websocket
function simulateJobProgress(jobId) {
  setTimeout(() => {
    const job = jobsDb.find(j => j.id === jobId);
    if (!job) return;
    
    job.status = 'processing';
    job.progress = 10;
    job.stepText = 'Initializing ComfyUI...';

    let tick = 1;
    const interval = setInterval(() => {
      tick++;
      if (job.status !== 'processing') {
        clearInterval(interval);
        return;
      }

      if (tick === 2) { job.progress = 30; job.stepText = 'Loading Base Image & IP-Adapter...'; }
      else if (tick === 4) { job.progress = 50; job.stepText = 'Executing ControlNet Depth...'; }
      else if (tick === 6) { job.progress = 80; job.stepText = 'Alpha Matte Generation...'; }
      else if (tick >= 8) {
        clearInterval(interval);
        job.progress = 100;
        job.status = 'completed';
        job.stepText = 'Done!';
        
        // Simulating different final output images for demo purposes
        if (job.prompt.toLowerCase().includes('wood')) {
          job.resultUrl = 'https://images.unsplash.com/photo-1546483875-5f04305b819d?q=80&w=400&auto=format&fit=crop';
        } else if (job.prompt.toLowerCase().includes('gold')) {
          job.resultUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';
        } else if (job.prompt.toLowerCase().includes('pixel')) {
          job.resultUrl = 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop';
        } else {
          job.resultUrl = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=400&auto=format&fit=crop';
        }
      }
    }, 1500);
  }, 1500); // 1.5s wait in queue
}
