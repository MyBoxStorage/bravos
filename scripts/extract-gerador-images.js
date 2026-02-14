import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const txt = fs.readFileSync('C:/Users/pc/Desktop/Gerador/optimized_images.txt', 'utf8');
const dir = path.join(__dirname, '..', 'public', 'assets');

const uploadMatch = txt.match(/UPLOAD_JPEG=([^\n]+)/);
const estampasMatch = txt.match(/ESTAMPAS_JPEG=([^\n]+)/);
const promptMatch = txt.match(/PROMPT_JPEG=([^\n]+)/);

const save = (name, b64) => {
  if (b64) {
    const clean = b64.replace(/\s/g, '');
    fs.writeFileSync(path.join(dir, name), Buffer.from(clean, 'base64'));
    console.log('Saved', name);
  }
};
save('exemplo-upload.jpg', uploadMatch ? uploadMatch[1] : null);
save('exemplo-estampa.jpg', estampasMatch ? estampasMatch[1] : null);
save('exemplo-prompt.jpg', promptMatch ? promptMatch[1] : null);
