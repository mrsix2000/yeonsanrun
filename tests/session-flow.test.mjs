import test from 'node:test';import assert from 'node:assert/strict';
import {SESSION_SIZE,createSession,recordAttempt,summarizeSession} from '../src/session.js';
test('five questions complete and report accuracy and mistakes',()=>{
 let s=createSession();
 for(let i=0;i<SESSION_SIZE;i++)s=recordAttempt(s,{text:'1+2=?',answer:3},String(i),i%2===0);
 assert.equal(s.complete,true);
 assert.deepEqual([summarizeSession(s).correct,summarizeSession(s).accuracy,summarizeSession(s).mistakes.length],[3,60,2]);
 assert.throws(()=>recordAttempt(s,{text:'1+2=?',answer:3},'3',true),RangeError);
 assert.equal(createSession().attempts.length,0);
});
