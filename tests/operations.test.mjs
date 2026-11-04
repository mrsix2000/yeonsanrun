import test from 'node:test';
import assert from 'node:assert/strict';
import {OPERATIONS,createQuestion,gradeAnswer} from '../src/engine.js';
test('사칙연산 4종 지원',()=>assert.deepEqual(OPERATIONS.map(o=>o.id),['add','subtract','multiply','divide']));
test('각 연산 최솟값과 최댓값',()=>{
 const expected={add:[2,18],subtract:[0,0],multiply:[1,81],divide:[1,9]};
 for(const [op,values] of Object.entries(expected)){
  assert.equal(createQuestion(op,()=>0).answer,values[0]);
  assert.equal(createQuestion(op,()=>0.999).answer,values[1]);
 }
});
test('뺄셈은 음수가 나오지 않고 나눗셈은 항상 나누어떨어짐',()=>{
 for(let a=0;a<9;a++)for(let b=0;b<9;b++){
  const vals=[a/9,b/9];let i=0;
  const random=()=>vals[i++%2];
  const sub=createQuestion('subtract',random);assert.ok(sub.answer>=0);
  i=0;const div=createQuestion('divide',random);
  const [left,right]=div.text.split(' ÷ ').map(Number);
  assert.equal(left/right,div.answer);
 }
});
test('정답 채점과 잘못된 연산 거절',()=>{
 for(const op of OPERATIONS){const q=createQuestion(op.id,()=>0);assert.equal(gradeAnswer(q,String(q.answer)),true);assert.equal(gradeAnswer(q,String(q.answer+1)),false)}
 assert.throws(()=>createQuestion('invalid'),RangeError);
});
