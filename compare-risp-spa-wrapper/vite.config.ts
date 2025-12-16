import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/spa.tsx',
      name: 'CompareRispSpaWrapper',
      fileName: 'spa',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'single-spa', 'single-spa-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'single-spa': 'singleSpa',
          'single-spa-react': 'singleSpaReact'
        }
      }
    }
  },
  server: {
    port: 3013,
    hmr: false
  }
});
