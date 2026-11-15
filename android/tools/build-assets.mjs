// Copies the game page into app assets as a standalone index.html and bundles
// its Google Fonts locally so the app works offline.
// Usage: node tools/build-assets.mjs ../la-chan-bo-bien.html
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(process.argv[2] || path.join(here, '..', '..', 'la-chan-bo-bien.html'));
const assets = path.join(here, '..', 'app', 'src', 'main', 'assets');
const fontsDir = path.join(assets, 'fonts');

let html = await readFile(src, 'utf8');
const linkRe = /<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)">\s*/;
const m = html.match(linkRe);
if (!m) throw new Error('Google Fonts stylesheet link not found in ' + src);
const cssUrl = m[1].replace(/&amp;/g, '&');

// A modern browser UA makes Google serve woff2 files split by unicode range (incl. Vietnamese).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
let css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();

await rm(fontsDir, { recursive: true, force: true });
await mkdir(fontsDir, { recursive: true });
const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(x => x[1]))];
let i = 0;
for (const u of urls) {
  const name = `f${String(i++).padStart(2, '0')}.woff2`;
  const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
  await writeFile(path.join(fontsDir, name), buf);
  css = css.split(u).join('fonts/' + name);
}

html = html
  .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
  .replace(linkRe, `<style>\n${css}</style>\n`);

const page = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<style>html{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}</style>
${html}
</html>
`;
await writeFile(path.join(assets, 'index.html'), page);
console.log(`index.html written, ${urls.length} font files bundled`);
