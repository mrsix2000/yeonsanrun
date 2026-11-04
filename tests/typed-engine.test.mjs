import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {availableTypes,createTypedQuestion,gradeTypedAnswer,isValidAnswerInput} from '../src/typed-engine.js';
import {CONTENT_TYPES,validateCatalog} from '../src/catalog.js';
test('015: prerequisites refer to catalog entries',()=>{
 assert.equal(validateCatalog(),true);
 for(const t of CONTENT_TYPES)for(const dep of t.prerequisites)assert.ok(CONTENT_TYPES.some(x=>x.id===dep));
 assert.ok(CONTENT_TYPES.some(x=>x.prerequisites.length>0));
});
test('016-020: every available type creates and grades questions',()=>{
 assert.equal(availableTypes().length,24);
 for(const t of availableTypes())for(const seed of [0,.2,.5,.999999]){
  const q=createTypedQuestion(t.id,()=>seed);
  assert.equal(q.typeId,t.id);
  assert.equal(gradeTypedAnswer(q,q.answer),true,t.id);
  assert.equal(gradeTypedAnswer(q,'garbage'),false,t.id);
  assert.equal(isValidAnswerInput(t.id,q.answer),true,t.id);
 }
 assert.throws(()=>createTypedQuestion('natural.mixed'),RangeError);
});
test('016: actual practice UI includes selector and timing',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(html,/id="curriculum-type"/);
 assert.match(html,/id="natural-controls"/);
 assert.match(main,/createTypedQuestion\(nextType/);
 assert.match(main,/performance\.now\(\)/);
});
