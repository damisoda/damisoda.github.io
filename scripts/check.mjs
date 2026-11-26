import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');

const home = read('index.html');
assert.deepEqual(
  Array.from(home.matchAll(/<a href="([^"]+)"/g), ([, href]) => href),
  ['/portfolio.pdf', '/resume.pdf'],
);

for (const file of ['portfolio.pdf', 'resume.pdf']) {
  const signature = readFileSync(join(root, file)).subarray(0, 5).toString();
  assert.equal(signature, '%PDF-', file);
}

for (const [slug, page] of [
  ['come-back-home', '#page=2'],
  ['dev-hive', '#page=7'],
  ['career-piggybank', '#page=11'],
  ['design-qa-agent', ''],
]) {
  const html = read(`projects/${slug}/index.html`);
  assert.ok(html.includes(`0;url=/portfolio.pdf${page}`), slug);
}

const demoDir = 'demos/career-piggybank';
const demo = read(`${demoDir}/index.html`);
assert.equal(JSON.parse(read(`${demoDir}/source.json`)).mode, 'EXPO_PUBLIC_DEMO=1');
assert.ok(demo.includes('예제 데이터'));
assert.ok(existsSync(join(root, '.nojekyll')));
for (const [, script] of demo.matchAll(/<script[^>]+src="([^"]+)"/g)) {
  if (!script.startsWith('/')) continue;
  const bundle = read(script);
  assert.ok(!bundle.includes('Users/'), script);
  for (const [, asset] of bundle.matchAll(/uri:"(\/demos\/career-piggybank\/assets\/[^"?#]+)"/g)) {
    assert.ok(existsSync(join(root, asset)), asset);
  }
}

console.log('Checked both PDFs, the PDF index, compatibility links, and the linked demo.');
