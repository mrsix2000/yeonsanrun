import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('five-question progress and result UI',()=>{
 for(const id of ['progress-count','progress-track','progress-fill','result-panel','result-score','mistake-list','repeat-five'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(main,/recordAttempt\(session,\{\.\.\.question,durationMs\},input,ok\)/);
 assert.match(main,/if\(session\.complete\)showResult\(\);else nextQuestion\(\)/);
 for(const id of ['next','session-status','retry-practice','restart-practice','input-error'])
  assert.doesNotMatch(html,new RegExp('id="'+id+'"'));
});
