import test from 'node:test';
import assert from 'node:assert/strict';
import {createQuestion,hasCarry,hasBorrow,gradeAnswer} from '../src/engine.js';
const values=[0,0.13,0.37,0.51,0.88,0.999];
function parse(q){return q.text.replace(' = ?','').split(/ [^0-9 ]+ /).map(Number)}
test('1~3자리 사칙연산 4종: 범위, 정답, 나눗셈 정수 몫',()=>{
 for(const digits of [1,2,3])for(const op of ['add','subtract','multiply','divide']){
  for(const v of values){
   const q=createQuestion(op,()=>v,{digits});const [a,b]=parse(q);
   assert.ok(Number.isInteger(a)&&Number.isInteger(b));
   if(op==='add')assert.equal(a+b,q.answer);
   if(op==='subtract'){assert.equal(a-b,q.answer);assert.ok(q.answer>=0)}
   if(op==='multiply')assert.equal(a*b,q.answer);
   if(op==='divide'){assert.equal(a/b,q.answer);assert.equal(a%b,0)}
   assert.equal(gradeAnswer(q,String(q.answer)),true);
  }
 }
});
test('받아올림/받아내림 조건을 항상 충족 (고정 난수 포함)',()=>{
 for(const digits of [1,2,3])for(const op of ['add','subtract'])for(const condition of ['with','without']){
  if(digits===1&&op==='subtract'&&condition==='with')continue;
  for(const v of values){
   const q=createQuestion(op,()=>v,{digits,condition});const [a,b]=parse(q);
   assert.equal(op==='add'?hasCarry(a,b):hasBorrow(a,b),condition==='with',q.text);
  }
 }
});
test('불가능하거나 지원하지 않는 설정 거절',()=>{
 assert.throws(()=>createQuestion('add',Math.random,{digits:4}),RangeError);
 assert.throws(()=>createQuestion('subtract',Math.random,{digits:1,condition:'with'}),RangeError);
 assert.throws(()=>createQuestion('divide',Math.random,{digits:2,condition:'with'}),RangeError);
});
