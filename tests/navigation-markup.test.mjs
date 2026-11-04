import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
test('화면과 메뉴 경로 연결',()=>{
 for(const route of ['home','practice','history','auth']){
  assert.match(html,new RegExp('id="view-'+route+'"'));
  assert.match(html,new RegExp('data-route="'+route+'"'));
 }
});
test('메뉴 화면 전환 이벤트와 해시 변경 양쪽 처리',()=>{
 assert.match(main,/addEventListener\('hashchange',renderRoute\)/);
 assert.match(main,/querySelectorAll\('\[data-route\]'\)/);
 assert.match(main,/queueMicrotask\(renderRoute\)/);
});
test('숨김 스타일과 캐시 버전 고정',()=>{
 assert.match(css,/\[hidden\]\{display:none!important\}/);
 assert.match(html,/styles\.css\?v=007-1/);
 assert.match(html,/main\.js\?v=007-1/);
});
