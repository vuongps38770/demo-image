import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import FormGroup from '../molecules/FormGroup';
import { useJobStore } from '../../store/jobStore';
import { jobsApi } from '../../../data/api';
import { Image, Layers, Upload, Sparkles, CheckCircle2, X } from 'lucide-react';

export const CreateJobForm = ({ username, prompt, setPrompt }) => {
  const { submitJob, isSubmitting } = useJobStore();
  const [type, setType] = useState('text-to-image'); // 'text-to-image' | 'asset-change'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('square'); // 'square' | 'vertical' | 'horizontal'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    let assetImgUrl = null;
    let assetName = null;

    if (type === 'asset-change') {
      if (uploadedFile) {
        try {
          assetImgUrl = await jobsApi.uploadFile(uploadedFile);
        } catch (error) {
          console.error('Failed to upload asset:', error);
          alert('Failed to upload asset image to server. Please try again.');
          return;
        }
        assetName = uploadedFile.name;
      } else {
        alert('Please upload an image for style transformation.');
        return;
      }
    }

    const payload = {
      type,
      prompt: prompt.trim(),
      assetId: type === 'asset-change' ? 'custom-upload' : null,
      assetName: type === 'asset-change' ? assetName : null,
      assetImgUrl,
      aspectRatio: type === 'text-to-image' ? aspectRatio : null,
    };

    await submitJob(payload, username);
    
    // Reset inputs
    setPrompt('');
    setUploadedFile(null);
    setUploadPreview(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveUploadedFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadPreview(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-mono">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-extrabold tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase">
          <Sparkles className="text-[#eb0004]" size={16} />
          Generation Settings
        </h2>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          Configure generation settings for assets.
        </p>
      </div>

      {/* Tabs / Segmented Control */}
      <div className="flex bg-zinc-100 dark:bg-black p-0.5 rounded-none border border-black dark:border-zinc-800">
        <button
          type="button"
          onClick={() => { setType('text-to-image'); setUploadedFile(null); setUploadPreview(null); setPrompt(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-none text-xs font-bold transition-all duration-150 uppercase tracking-widest ${
            type === 'text-to-image'
              ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border-l border-r border-black dark:border-zinc-850'
              : 'text-zinc-400 dark:text-zinc-555 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Image size={12} />
          Text to Image
        </button>
        <button
          type="button"
          onClick={() => { setType('asset-change'); setUploadedFile(null); setUploadPreview(null); setPrompt(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-none text-xs font-bold transition-all duration-150 uppercase tracking-widest ${
            type === 'asset-change'
              ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border-l border-r border-black dark:border-zinc-850'
              : 'text-zinc-400 dark:text-zinc-555 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Layers size={12} />
          Asset Change
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Prompt */}
        <FormGroup label="Prompt / Text Input">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              type === 'text-to-image'
                ? 'e.g., A futuristic cyberpunk robot soldier, 3D character, concept art, Unreal Engine 5 render, cinematic lighting...'
                : 'Write your own transformation prompt here...'
            }
            rows={5}
            className="w-full px-4 py-3 rounded-none border border-black dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-zinc-200 placeholder-zinc-500 text-xs font-mono transition-colors duration-100 focus:outline-none focus:border-[#eb0004] resize-none"
          />
        </FormGroup>

        {/* Aspect Ratio Selector (Conditional for Text to Image) */}
        {type === 'text-to-image' && (
          <FormGroup label="Aspect Ratio / Khung hình">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                className={`py-2 px-1 border text-[9px] font-bold uppercase tracking-wider text-center transition-all ${
                  aspectRatio === 'square'
                    ? 'border-[#eb0004] bg-[#eb0004]/5 text-[#eb0004] dark:text-red-500 dark:border-red-900'
                    : 'border-black dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:border-[#eb0004]/60'
                }`}
              >
                Square (1:1)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('vertical')}
                className={`py-2 px-1 border text-[9px] font-bold uppercase tracking-wider text-center transition-all ${
                  aspectRatio === 'vertical'
                    ? 'border-[#eb0004] bg-[#eb0004]/5 text-[#eb0004] dark:text-red-500 dark:border-red-900'
                    : 'border-black dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:border-[#eb0004]/60'
                }`}
              >
                Vertical (Dọc)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('horizontal')}
                className={`py-2 px-1 border text-[9px] font-bold uppercase tracking-wider text-center transition-all ${
                  aspectRatio === 'horizontal'
                    ? 'border-[#eb0004] bg-[#eb0004]/5 text-[#eb0004] dark:text-red-500 dark:border-red-900'
                    : 'border-black dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:border-[#eb0004]/60'
                }`}
              >
                Horizontal (Ngang)
              </button>
            </div>
          </FormGroup>
        )}

        {/* Asset Selection & Styles (Conditional) */}
        {type === 'asset-change' && (
          <div className="flex flex-col gap-4 p-4 rounded-none bg-zinc-50/50 dark:bg-zinc-950/20 border border-black dark:border-zinc-800">
            
            {/* Custom file upload / preview */}
            {uploadedFile && uploadPreview ? (
              <div className="relative border border-black dark:border-zinc-800 bg-white dark:bg-black p-3 flex items-center justify-between gap-3 group hover:border-[#eb0004] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-2 overflow-hidden z-10 pointer-events-none">
                  <img
                    src={uploadPreview}
                    alt="Custom Upload Preview"
                    className="w-10 h-10 object-cover border border-black dark:border-zinc-800"
                  />
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[8px] text-zinc-450 dark:text-zinc-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB (Click to replace)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveUploadedFile}
                  className="p-1 text-zinc-400 hover:text-[#eb0004] transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 relative z-20"
                  title="Remove Uploaded File"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative border border-dashed border-black dark:border-zinc-850 rounded-none p-4 flex flex-col items-center justify-center gap-1.5 hover:border-[#eb0004] dark:hover:border-[#eb0004] transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="text-zinc-455 group-hover:text-[#eb0004] transition-colors" size={16} />
                <span className="text-[10px] font-bold text-zinc-750 dark:text-zinc-350">
                  Upload custom asset
                </span>
                <span className="text-[8px] text-zinc-450 dark:text-zinc-555">
                  PNG, JPG up to 10MB
                </span>
              </div>
            )}

          </div>
        )}

        {/* Action Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={!prompt.trim() || isSubmitting || (type === 'asset-change' && !uploadedFile)}
          className="w-full flex items-center justify-center gap-2 py-3.5"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Generate Asset
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateJobForm;
