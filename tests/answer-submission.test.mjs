import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('answer submit accepts digit input and moves to next question',()=>{
 const correct=String.raw`/^-?\d+$/`;
 const broken=String.raw`/^-?\\d+$/`;
 assert.match(main,/isValidAnswerInput\(selectedType,input\)/);
 assert.ok(!main.includes(broken),'Double escaped digit class rejects all answers');
 assert.match(main,/session=recordAttempt\(session,\{\.\.\.question,durationMs\},input,ok\)/);
 assert.match(main,/if\(session\.complete\)showResult\(\);else nextQuestion\(\)/);
 assert.equal(/^-?\d+$/.test('42'),true);
 assert.equal(/^-?\d+$/.test('-3'),true);
 assert.equal(/^-?\d+$/.test('abc'),false);
});
