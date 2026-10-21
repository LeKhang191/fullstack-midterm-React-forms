import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createNotesMiddleware } from './mock-api/notesMiddleware.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useDjango = env.VITE_API_MODE === 'django';
  const createMockMiddleware = () => createNotesMiddleware({
    dataFile: resolve(process.cwd(), '.mock-data/notes.json'),
  });

  const mockPlugin = {
    name: 'tv2-mock-notes-rest-api',
    configureServer(server) {
      server.middlewares.use(createMockMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMockMiddleware());
    },
  };

  return {
    plugins: [react(), ...(!useDjango ? [mockPlugin] : [])],
    server: {
      host: '127.0.0.1',
      port: 5173,
      // Django integration mode only: preserve all URLs, avoid CORS in dev.
      proxy: useDjango ? {
        '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      } : {},
    },
    preview: { host: '127.0.0.1' },
  };
});
