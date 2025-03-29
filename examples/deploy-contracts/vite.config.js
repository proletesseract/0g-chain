import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Copy tutorial.md to public folder during build
const copyTutorialPlugin = () => {
  return {
    name: 'copy-tutorial',
    buildStart() {
      try {
        const tutorialContent = fs.readFileSync('./tutorial.md', 'utf-8');
        if (!fs.existsSync('./public')) {
          fs.mkdirSync('./public');
        }
        fs.writeFileSync('./public/tutorial.md', tutorialContent);
        console.log('Tutorial copied to public folder');
      } catch (error) {
        console.error('Error copying tutorial:', error);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyTutorialPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      crypto: 'crypto-browserify'
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
}); 