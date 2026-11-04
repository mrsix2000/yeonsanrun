import test from 'node:test';
import assert from 'node:assert/strict';
import {createQuestion} from '../src/engine.js';
const vals=[0,0.01,0.12,0.25,0.5,0.75,0.99,0.999];
test('trivial arithmetic excluded for every supported difficulty',()=>{
 for(const digits of [1,2,3])for(const operation of ['add','subtract','multiply','divide']){
  const conditions=['add','subtract'].includes(operation)?['any','with','without']:['any'];
  for(const condition of conditions){
   if(operation==='subtract'&&digits===1&&condition==='with')continue;
   for(const v of vals){
    const q=createQuestion(operation,()=>v,{digits,condition});
    const [a,b]=q.text.replace(' = ?','').split(/ [^0-9 ]+ /).map(Number);
    if(operation==='add'){assert.notEqual(a,0);assert.notEqual(b,0)}
    if(operation==='multiply'){assert.notEqual(a,1);assert.notEqual(b,1)}
    if(operation==='subtract')assert.notEqual(q.answer,0);
    if(operation==='divide')assert.notEqual(q.answer,1);
   }
  }
 }
});
