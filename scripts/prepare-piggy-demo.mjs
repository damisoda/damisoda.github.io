// Normalize asset paths when Expo dependencies are linked from another checkout.
import {readFileSync,writeFileSync,readdirSync,mkdirSync,renameSync,unlinkSync} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const demo=join(root,'demos/career-piggybank');
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(join(dir,x.name)):[join(dir,x.name)]);}
const replacements=new Map();
for(const file of files(join(demo,'assets'))){
 const parts=relative(demo,file).split('/');const at=parts.indexOf('node_modules');
 if(at<0)continue;
 const oldPrefix=parts.slice(0,at+1).join('/');
 replacements.set(oldPrefix,'assets/vendor');
 const target=join(demo,'assets/vendor',...parts.slice(at+1));
 mkdirSync(dirname(target),{recursive:true});renameSync(file,target);
}
let html=readFileSync(join(demo,'index.html'),'utf8');
for(const file of files(join(demo,'_expo')).filter(x=>x.endsWith('.js'))){
 let text=readFileSync(file,'utf8');const before=text;
 for(const [from,to] of replacements)text=text.replaceAll(from,to);
 if(text===before)continue;
 const hash=createHash('md5').update(text).digest('hex');
 const name=`entry-${hash}.js`;const next=join(dirname(file),name);
 writeFileSync(next,text);unlinkSync(file);
 html=html.replaceAll(relative(demo,file),relative(demo,next));
}
writeFileSync(join(demo,'index.html'),html);
console.log(`Normalized ${replacements.size} external dependency asset prefixes.`);
