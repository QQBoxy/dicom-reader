import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/dicom-reader/' : '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/itk-wasm/dist/pipeline/web-workers/bundles/itk-wasm-pipeline.min.worker.js',
          dest: 'itk',
        },
        {
          src: 'node_modules/@itk-wasm/dicom/dist/pipelines/*{.wasm,.js,.zst}',
          dest: 'itk/pipelines',
        },
      ],
    }),
  ],
});
