import sharp from 'sharp';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

// アイコン素材。FullSizeRender.jpeg があればそれを使用、無ければ
// テーマカラーの単色プレースホルダを生成してビルドを止めない。
const candidates = [
  join(root, 'FullSizeRender.jpeg'),
  join(root, 'FullSizeRender.jpg'),
  join(publicDir, 'FullSizeRender.jpeg'),
];
const src = candidates.find((p) => existsSync(p));

function base(size) {
  if (src) {
    return sharp(src).resize(size, size, { fit: 'cover', position: 'center' });
  }
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 12, g: 20, b: 16, alpha: 1 },
    },
  });
}

const targets = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 64, name: 'favicon.ico' },
];

await Promise.all(
  targets.map(({ size, name }) => base(size).png().toFile(join(publicDir, name)))
);

console.log(src ? `Icons generated from ${src}` : 'Icons generated (placeholder)');
