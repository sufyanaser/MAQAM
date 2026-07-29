import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');

await sharp(path.join(projectRoot, 'build', 'icon.svg'))
  .resize(512, 512)
  .png()
  .toFile(path.join(projectRoot, 'build', 'icon.png'));

console.log('Generated build/icon.png');
