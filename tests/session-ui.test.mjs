import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
test('session status, restart, retry and input feedback controls exist',()=>{
 for(const id of ['session-status','restart-practice','retry-practice','input-error'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(main,/\$\('restart-practice'\)\.addEventListener\('click',startPractice\)/);
 assert.match(main,/\$\('retry-practice'\)\.addEventListener\('click',startPractice\)/);
 assert.match(main,/정수를 입력해 주세요/);
 assert.match(main,/문제를 만들지 못했습니다/);
});
test('invalid input is validated before score lock, mobile controls are responsive',()=>{
 assert.ok(main.indexOf("if(!/^-?\\d+$/.test(input))")<main.indexOf("locked=true;"));
 assert.match(css,/\.answer-row input\{width:100%;flex-basis:100%\}/);
 assert.match(html,/role="alert"/);
});
