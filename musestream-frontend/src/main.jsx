import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LikesProvider } from './context/LikesContext';
import { PlaylistsProvider } from './context/PlaylistsContext';
import { PlayerProvider } from './context/PlayerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <LikesProvider>
            <PlaylistsProvider>
              <PlayerProvider>
                <App />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: { background: '#1A1430', color: '#F5F3FF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14 },
                    success: { iconTheme: { primary: '#8B5CF6', secondary: '#fff' } },
                  }}
                />
              </PlayerProvider>
            </PlaylistsProvider>
          </LikesProvider>
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
