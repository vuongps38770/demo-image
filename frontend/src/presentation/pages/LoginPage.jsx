import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/atoms/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username.trim()) {
      setValidationError('Username is required');
      return;
    }

    if (username.trim().length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }

    await login(username.trim());
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-zinc-50 dark:bg-black transition-colors duration-150 font-mono">
      {/* Main Brutalist Card */}
      <div className="w-full max-w-md bg-white dark:bg-black rounded-none border border-black dark:border-zinc-800 p-8 md:p-10 shadow-none relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="p-3 bg-[#eb0004] text-white rounded-none">
            <Sparkles size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
              IMAGE <span className="text-[#eb0004] font-black">[STUDIO]</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Creative Asset Generation Workspace
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="username-login" className="text-[10px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-widest pl-0.5">
              Enter Username
            </label>
            <input
              id="username-login"
              type="text"
              placeholder="e.g. designer_user"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (e.target.value.trim()) setValidationError('');
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-none border border-black dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-zinc-200 placeholder-zinc-500 text-xs font-mono transition-colors duration-100 focus:outline-none focus:border-[#eb0004]"
              autoFocus
            />
            {(validationError || error) && (
              <span className="text-[9px] font-bold text-[#eb0004] mt-1 pl-0.5 uppercase tracking-wider block">
                {validationError || error}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                Accessing Studio...
              </>
            ) : (
              <>
                Access Studio
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform animate-pulse" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
