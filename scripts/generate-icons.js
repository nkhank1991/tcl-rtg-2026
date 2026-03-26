const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const BG_COLOR = '#E4002B';
const TEXT_COLOR = '#FFFFFF';

function generateIcon(size, filename, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, size, size);

  // For maskable icons, the safe zone is the center 80%
  // so we scale down the text to fit within that area
  const textScale = maskable ? 0.45 : 0.55;
  const fontSize = Math.floor(size * textScale);

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TCL', size / 2, size / 2);

  // Add subtle tagline for 512px icons
  if (size >= 512) {
    const subSize = Math.floor(size * 0.055);
    ctx.font = `${subSize}px Arial, sans-serif`;
    const yOffset = maskable ? size * 0.18 : size * 0.22;
    ctx.fillText('Road to Greatness', size / 2, size / 2 + yOffset);
  }

  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(ICONS_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created: ${filePath} (${size}x${size})`);
}

// Ensure output directory exists
fs.mkdirSync(ICONS_DIR, { recursive: true });

// Generate icons
generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
generateIcon(512, 'icon-maskable-512.png', true);

console.log('\nAll icons generated successfully!');
