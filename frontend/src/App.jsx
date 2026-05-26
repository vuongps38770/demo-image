import React, { useEffect } from 'react';
import { useAuthStore } from './presentation/store/authStore';
import { useThemeStore } from './presentation/store/themeStore';
import { useCursorStore } from './presentation/store/cursorStore';
import LoginPage from './presentation/pages/LoginPage';
import DashboardPage from './presentation/pages/DashboardPage';
import CursorFollower from './presentation/components/atoms/CursorFollower';

function App() {
  const { user, init: initAuth } = useAuthStore();
  const { init: initTheme } = useThemeStore();
  const { init: initCursor } = useCursorStore();

  useEffect(() => {
    initAuth();
    initTheme();
    initCursor();
  }, []);

  return (
    <div className="w-full min-h-screen text-black dark:text-white transition-colors duration-150">
      {user ? <DashboardPage /> : <LoginPage />}
      <CursorFollower />
    </div>
  );
}

export default App;
