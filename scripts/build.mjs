import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = 'https://damisoda.github.io';
const documents = [
  ['포트폴리오 PDF', '/portfolio.pdf'],
  ['이력서 PDF', '/resume.pdf'],
];
const documentLinks = `<ul>${documents.map(([label, path]) => `<li><a href="${path}">${label}</a></li>`).join('')}</ul>`;

function page(file, title, content, { destination } = {}) {
  const output = join(root, file);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${destination ? `<meta name="robots" content="noindex">
<link rel="canonical" href="${site}${destination}">
<meta http-equiv="refresh" content="0;url=${destination}">` : ''}
<style>
body { margin: 0; font: 1rem/1.6 system-ui, sans-serif; color: #172638; background: #fff; }
main { width: min(28rem, calc(100% - 2.5rem)); margin: 12vh auto 3rem; }
h1 { margin: 0 0 1.5rem; font-size: 1.5rem; }
ul { display: grid; gap: .75rem; padding: 0; list-style: none; }
a { display: inline-block; padding: .65rem .95rem; border: 1px solid #bdc9d8; border-radius: .35rem; color: #244f92; text-underline-offset: .18em; }
a:focus-visible { outline: 2px solid #244f92; outline-offset: 3px; }
</style>
</head>
<body><main><h1>${title}</h1>${content}</main></body>
</html>
`);
}

page('index.html', '조대흠', documentLinks);
page('404.html', '문서 링크', documentLinks);
page('404/index.html', '문서 링크', documentLinks);
page('_not-found/index.html', '문서 링크', documentLinks);

for (const [slug, pdfPage] of [
  ['come-back-home', 2],
  ['dev-hive', 7],
  ['career-piggybank', 11],
  ['design-qa-agent', null],
]) {
  const destination = pdfPage ? `/portfolio.pdf#page=${pdfPage}` : '/portfolio.pdf';
  page(`projects/${slug}/index.html`, '포트폴리오 PDF', `<p><a href="${destination}">PDF 열기</a></p>`, { destination });
}

writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', ...documents.map(([, path]) => path)].map(path => `  <url><loc>${site}${path}</loc></url>`).join('\n')}
</urlset>
`);

console.log('Built the PDF index and compatibility links.');
