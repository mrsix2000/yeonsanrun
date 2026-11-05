import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeChildPractice,parentReportNotice} from '../src/parent-report.js';
test('summary metrics and weak types',()=>{
 const records=[{at:'2026-11-05T08:00:00Z',attempts:[{typeId:'a',correct:true,durationMs:1000},{typeId:'b',correct:false,durationMs:3000}]}];
 const x=summarizeChildPractice(records,new Date('2026-11-05T12:00:00Z'));
 assert.equal(x.accuracy,50);assert.equal(x.averageSeconds,2);assert.equal(x.weeklySessions,1);
 assert.equal(x.weakTypes[0].typeId,'b');
});
test('empty and malformed records',()=>{
 assert.equal(summarizeChildPractice([]).questions,0);
 assert.throws(()=>summarizeChildPractice([{attempts:null}]));
 assert.match(parentReportNotice(1),/권한 검증/);
});
