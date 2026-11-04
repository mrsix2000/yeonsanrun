import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(join(root,p),'utf8');
test('all local JavaScript imports exist and cache versions match',()=>{
 const html=read('index.html');
 const version=html.match(/src\/main\.js\?v=([\w-]+)/)?.[1];
 assert.ok(version);
 assert.match(html,new RegExp('src/styles\\.css\\?v='+version));
 for(const name of readdirSync(join(root,'src')).filter(n=>n.endsWith('.js'))){
  const content=read('src/'+name);
  for(const match of content.matchAll(/(?:from\s*|import\s*\()['"]([^'"]+\.js)(?:\?v=([\w-]+))?['"]/g)){
   const [,path,cache]=match;
   if(!path.startsWith('.'))continue;
   assert.ok(existsSync(join(root,'src',path)),name+': missing '+path);
   assert.equal(cache,version,name+': cache mismatch '+path);
  }
 }
});
test('page IDs are unique and referenced elements exist',()=>{
 const html=read('index.html'),main=read('src/main.js');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,'duplicate HTML ids');
 for(const [,id] of main.matchAll(/\$\('([\w-]+)'\)/g))
  assert.ok(ids.includes(id),'missing element #'+id);
});
test('client code contains no privileged Supabase keys',()=>{
 for(const name of readdirSync(join(root,'src')).filter(n=>n.endsWith('.js'))){
  const content=read('src/'+name);
  assert.doesNotMatch(content,/sb_secret_[A-Za-z0-9]+|eyJ[A-Za-z0-9_-]{120,}\.[A-Za-z0-9_-]+\./,name);
  assert.doesNotMatch(content,/\bservice_role\s*[:=]\s*['"][^'"]+['"]/i,name);
 }
});
