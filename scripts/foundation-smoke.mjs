import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const fail = (message) => { console.error(`✗ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✓ ${message}`);

const indexPath = path.join(root, 'index.html');
if (!fs.existsSync(indexPath)) {
  fail('index.html est absent');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const rootAbsoluteAppAssets = [...html.matchAll(/(?:src|href)=["']\/(?!\/|data:)([^"']+)["']/g)];
if (rootAbsoluteAppAssets.length) {
  fail(`index.html contient encore ${rootAbsoluteAppAssets.length} chemin(s) absolu(s) incompatible(s) avec GitHub Pages`);
  for (const match of rootAbsoluteAppAssets) console.error(`  /${match[1]}`);
} else {
  pass('index.html utilise des chemins portables pour ses assets');
}

const refs = [...html.matchAll(/(?:src|href)=["'](\.\/[^?"']+)/g)].map(match => match[1]);
let missing = 0;
for (const ref of new Set(refs)) {
  const local = path.join(root, ref.replace(/^\.\//, ''));
  if (!fs.existsSync(local)) {
    missing++;
    fail(`asset référencé mais absent: ${ref}`);
  }
}
if (!missing) pass(`${new Set(refs).size} asset(s) HTML référencé(s) existent`);

const runtimePath = path.join(root, 'src', 'content-runtime.js');
if (fs.existsSync(runtimePath)) {
  const runtime = fs.readFileSync(runtimePath, 'utf8');
  const dynamicRefs = [...runtime.matchAll(/["'](\.\/src\/[^?"']+\.js)(?:\?[^"']*)?["']/g)].map(match => match[1]);
  let dynamicMissing = 0;
  for (const ref of new Set(dynamicRefs)) {
    const local = path.join(root, ref.replace(/^\.\//, ''));
    if (!fs.existsSync(local)) {
      dynamicMissing++;
      fail(`module gameplay dynamique absent: ${ref}`);
    }
  }
  if (!dynamicMissing) pass(`${new Set(dynamicRefs).size} module(s) gameplay dynamique(s) existent`);
}

const clipBrowserPos = html.indexOf('./src/clip-browser.js');
const mainPos = html.indexOf('./src/main.js');
if (clipBrowserPos >= 0 && mainPos >= 0 && clipBrowserPos < mainPos) {
  pass('la couche de compatibilité média charge avant main.js');
} else {
  fail('clip-browser.js doit charger avant main.js pour normaliser les chemins média historiques');
}

const srcDir = path.join(root, 'src');
const jsFiles = fs.existsSync(srcDir)
  ? fs.readdirSync(srcDir).filter(name => name.endsWith('.js')).map(name => path.join(srcDir, name))
  : [];

let syntaxErrors = 0;
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    syntaxErrors++;
    fail(`erreur de syntaxe JavaScript: ${path.relative(root, file)}`);
    if (result.stderr) console.error(result.stderr.trim());
  }
}
if (!syntaxErrors) pass(`${jsFiles.length} fichier(s) JavaScript passent node --check`);

const forbidden = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.toLowerCase() === 'desktop.ini') forbidden.push(path.relative(root, full));
  }
}
walk(root);
if (forbidden.length) {
  console.warn(`! ${forbidden.length} fichier(s) desktop.ini sont encore présents dans le dépôt; ils sont désormais ignorés pour les prochains commits.`);
} else {
  pass('aucun desktop.ini dans l’arbre de travail');
}

if (process.exitCode) {
  console.error('\nFoundation smoke checks: ÉCHEC');
} else {
  console.log('\nFoundation smoke checks: OK');
}
