import test from 'node:test';
import assert from 'node:assert/strict';
import {EXTENDED_TYPE_IDS,createCurriculumQuestion,gradeCurriculumAnswer} from '../src/curriculum-engine.js';
import {getContentType} from '../src/catalog.js';
test('012-014: every generator returns gradeable question across random boundaries',()=>{
 assert.equal(EXTENDED_TYPE_IDS.length,20);
 for(const id of EXTENDED_TYPE_IDS){
  assert.ok(getContentType(id),id);
  for(const seed of [0,.1,.5,.999999]){
   const q=createCurriculumQuestion(id,()=>seed);
   assert.ok(q.text.length>5,id);
   assert.equal(gradeCurriculumAnswer(q,q.answer),true,id+' '+q.answer);
   assert.equal(gradeCurriculumAnswer(q,''),false,id);
   assert.equal(gradeCurriculumAnswer(q,'wrong'),false,id);
  }
 }
});
test('012-014: fraction equivalent answers and zero denominator',()=>{
 const q={answer:'1/2'};
 assert.equal(gradeCurriculumAnswer(q,'2/4'),true);
 assert.equal(gradeCurriculumAnswer(q,'-2/-4'),true);
 assert.equal(gradeCurriculumAnswer(q,'2/0'),false);
 assert.equal(gradeCurriculumAnswer(q,'1/3'),false);
});
test('012-014: unsupported types fail closed',()=>{
 assert.throws(()=>createCurriculumQuestion('powers.radical-operations'),RangeError);
 assert.throws(()=>createCurriculumQuestion('missing.type'),RangeError);
});
