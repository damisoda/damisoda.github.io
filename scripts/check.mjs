import {readFileSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const projects=JSON.parse(readFileSync(join(root,'data/projects.json'),'utf8'));
const files=['index.html','404.html',...projects.map(p=>`projects/${p.slug}/index.html`)];
const errors=[];
for(const file of files){
 const html=readFileSync(join(root,file),'utf8');
 if(!html.includes('<html lang="ko"'))errors.push(`${file}: missing page language`);
 if(!html.includes('<meta name="viewport"'))errors.push(`${file}: missing viewport`);
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${file}: expected one primary heading`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const target=match[1].endsWith('/')?`${match[1]}index.html`:match[1];
  if(!existsSync(join(root,target)))errors.push(`${file}: missing local target ${match[1]}`);
 }
 if(/(?:localhost|\/Users\/|github_pat_|ghp_)/.test(html))errors.push(`${file}: local environment data in output`);
}
const cbh=readFileSync(join(root,'projects/come-back-home/index.html'),'utf8');
if(!cbh.includes('1차 결선 진출'))errors.push('Competition result missing');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${files.length} pages: local links/assets, metadata, headings and competition result.`);
