import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('entrypoint and imported ESM modules have matching cache versions',()=>{
 const version=html.match(/main\.js\?v=([\w-]+)/)?.[1];
 assert.ok(version,'main module must have cache version');
 for(const path of ['engine','catalog','navigation']){
  assert.ok(main.includes('./'+path+'.js?v='+version),path+' import must have matching version');
 }
 assert.ok(html.includes('styles.css?v='+version));
});
