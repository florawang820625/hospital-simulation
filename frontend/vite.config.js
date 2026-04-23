import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const envDirectory = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, envDirectory, '');
  const proxyTarget = env.VITE_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: proxyTarget
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});
