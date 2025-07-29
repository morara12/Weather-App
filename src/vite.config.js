import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  server: {
    port: 8080,
    open: '/src/index.html',
  },
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  define: {
    VITE_API_KEY: import.meta.env.API_KEY
  }
});