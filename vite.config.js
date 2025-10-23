import { defineConfig } from 'vite';

export default defineConfig({
  base: './',  // Change this from '/final_ass-main/' to './'
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  build: {
    outdir: 'docs',
    assetsDir: 'assets'
  }
});