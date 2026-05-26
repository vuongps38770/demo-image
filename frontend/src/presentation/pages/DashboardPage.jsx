import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/organisms/Navbar';
import CreateJobForm from '../components/organisms/CreateJobForm';
import JobCard from '../components/organisms/JobCard';
import Card from '../components/atoms/Card';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import { Layers, CheckCircle2, Play, AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { jobs, fetchJobs, isFetching } = useJobStore();
  
  const [prompt, setPrompt] = useState('');

  // 1. Initial Fetch
  useEffect(() => {
    if (user?.username) {
      fetchJobs(user.username);
    }
  }, [user?.username]);

  // 2. Poll for updates if any job is queued or processing
  useEffect(() => {
    if (!user?.username) return;
    
    const hasActiveJobs = jobs.some(
      (job) => job.status === 'queued' || job.status === 'processing'
    );

    if (!hasActiveJobs) return;

    const interval = setInterval(() => {
      fetchJobs(user.username);
    }, 2000);

    return () => clearInterval(interval);
  }, [jobs, user?.username]);

  // 3. Stats Calculation
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'processing').length;
  const completedJobs = jobs.filter((j) => j.status === 'completed').length;

  const handleReusePrompt = (promptText) => {
    navigator.clipboard.writeText(promptText);
    alert(`Copied prompt to clipboard: "${promptText}"`);
    setPrompt(promptText);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-150 font-mono">
      <Navbar />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        
        {/* Left Control Panel / Sidebar */}
        <aside className="w-full md:w-[380px] h-auto md:h-full flex-shrink-0 bg-white dark:bg-black border-b md:border-b-0 md:border-r border-black dark:border-zinc-800 overflow-y-auto p-6 custom-scrollbar">
          <CreateJobForm 
            username={user?.username} 
            prompt={prompt}
            setPrompt={setPrompt}
          />
        </aside>

        {/* Right Workspace / Gallery Panel */}
        <main className="flex-1 h-full overflow-y-auto bg-zinc-50/50 dark:bg-[#040406] p-6 md:p-8 flex flex-col gap-6 custom-scrollbar">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="accent-blue" className="flex items-center justify-between p-4 rounded-none border border-black dark:border-red-900/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#eb0004]">
                  Active Jobs
                </span>
                <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-red-500">
                  {activeJobs}
                </span>
              </div>
              <div className="p-2 bg-[#eb0004]/10 text-[#eb0004] rounded-none">
                <Play size={16} className="fill-current" />
              </div>
            </Card>

            <Card variant="accent-green" className="flex items-center justify-between p-4 rounded-none border border-black dark:border-zinc-800">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-widest text-zinc-550 dark:text-emerald-500">
                  Completed
                </span>
                <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-emerald-500">
                  {completedJobs}
                </span>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-none">
                <CheckCircle2 size={16} />
              </div>
            </Card>

            <Card variant="accent-indigo" className="flex items-center justify-between p-4 rounded-none border border-black dark:border-zinc-800">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-widest text-zinc-555 dark:text-zinc-400">
                  Total Submits
                </span>
                <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-200">
                  {totalJobs}
                </span>
              </div>
              <div className="p-2 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 rounded-none">
                <Layers size={16} />
              </div>
            </Card>
          </div>

          {/* Gallery Header */}
          <div className="flex justify-between items-center mt-2 border-b border-black dark:border-zinc-800 pb-3">
            <h3 className="text-xs font-black text-zinc-850 dark:text-zinc-200 flex items-center gap-2 uppercase tracking-widest">
              Generated Assets Workspace
              {isFetching && (
                <span className="inline-block w-1.5 h-1.5 bg-[#eb0004] rounded-none animate-ping" />
              )}
            </h3>
            
            <button
              onClick={() => fetchJobs(user?.username)}
              className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors border border-black dark:border-zinc-800 rounded-none"
              title="Force Refresh"
            >
              <RefreshCw size={12} className={`${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* History Gallery Grid */}
          {jobs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center border border-black dark:border-zinc-800 rounded-none bg-white dark:bg-black/10">
              <AlertCircle size={28} className="text-zinc-300 dark:text-zinc-800 mb-2" />
              <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-450 mb-0.5 uppercase tracking-widest">
                No Generations Found
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-550 max-w-xs leading-relaxed uppercase">
                Submit a prompt from the control panel to see generation results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onReusePrompt={handleReusePrompt}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
