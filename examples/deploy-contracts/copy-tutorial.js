import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy tutorial.md to public folder
try {
  const tutorialPath = path.join(__dirname, 'tutorial.md');
  const publicPath = path.join(__dirname, 'public');
  const targetPath = path.join(publicPath, 'tutorial.md');
  
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  
  fs.copyFileSync(tutorialPath, targetPath);
  console.log('Tutorial copied to public folder');
} catch (error) {
  console.error('Error copying tutorial:', error);
} 