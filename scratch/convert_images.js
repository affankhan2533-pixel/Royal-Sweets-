const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\3a1bdd74-6523-43cf-ae5f-39cb8b2a1fc4';
const destDir = path.join(__dirname, '..', 'public', 'images', 'sweets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const sweets = {
  motichoor_ladoo: 'motichoor_ladoo',
  kaju_katli: 'kaju_katli',
  gulab_jamun: 'gulab_jamun',
  rasgulla: 'rasgulla',
  peda: 'peda',
  milk_cake: 'milk_cake',
  barfi: 'barfi',
  jalebi: 'jalebi'
};

console.log('Starting Node.js image conversion...');

const files = fs.readdirSync(brainDir);

Object.entries(sweets).forEach(([sweetKey, destName]) => {
  // Find all files matching sweetKey_*.png
  const matches = files.filter(f => f.startsWith(sweetKey + '_') && f.endsWith('.png'));
  
  if (matches.length === 0) {
    console.log(`No match found for key: ${sweetKey}`);
    return;
  }
  
  // Sort by modification time to get the latest
  const sorted = matches.map(name => {
    const fullPath = path.join(brainDir, name);
    const stat = fs.statSync(fullPath);
    return { name, fullPath, mtime: stat.mtimeMs };
  }).sort((a, b) => b.mtime - a.mtime);
  
  const sourcePng = sorted[0].fullPath;
  const destWebp = path.join(destDir, `${destName}.webp`);
  
  console.log(`Converting ${path.basename(sourcePng)} -> ${destName}.webp`);
  
  sharp(sourcePng)
    .webp({ quality: 80 })
    .toFile(destWebp)
    .then(() => {
      console.log(`Successfully saved to ${destWebp}`);
    })
    .catch(err => {
      console.error(`Failed to convert ${sweetKey}:`, err);
    });
});
