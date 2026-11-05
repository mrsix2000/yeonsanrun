import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLinkedChildReport} from '../src/parent-report-server.js';
const child='child',parent='parent';
function client(grants=[{student_user_id:child}],sessions=[]){
 const calls=[];
 return {calls,auth:{getUser:async()=>({data:{user:{id:parent}},error:null})},
 from(table){const q={select(){return q},eq(k,v){calls.push([table,k,v]);return q},order(){return q},limit:async()=>({data:table==='parent_report_grants'?grants:sessions,error:null})};return q}};
}
test('authorized parent reads only linked child records',async()=>{
 const c=client(undefined,[{completed_at:'2026-11-05T09:00:00Z',mode:'free',practice_attempts:[{type_id:'add',correct:true,duration_ms:1000}]}]);
 const x=await loadLinkedChildReport(c,parent,child);
 assert.equal(x.accuracy,100);assert.equal(x.questions,1);
 assert.ok(c.calls.some(x=>x[0]==='practice_sessions'&&x[1]==='user_id'&&x[2]===child));
});
test('unlinked and mismatched parent blocked before history read',async()=>{
 const c=client([]);await assert.rejects(loadLinkedChildReport(c,parent,child),/연결되지 않은/);
 assert.equal(c.calls.some(x=>x[0]==='practice_sessions'),false);
 await assert.rejects(loadLinkedChildReport(client(),parent,'parent'),RangeError);
});

test('different signed-in account cannot request a parent report',async()=>{
 const c=client();
 c.auth.getUser=async()=>({data:{user:{id:'intruder'}},error:null});
 await assert.rejects(loadLinkedChildReport(c,parent,child),/인증 정보/);
 assert.equal(c.calls.length,0);
});
test('database failures are surfaced rather than treated as empty reports',async()=>{
 const c=client();
 const original=c.from;
 c.from=table=>{
  const q=original(table);
  q.limit=async()=>({data:null,error:new Error(table+' unavailable')});
  return q;
 };
 await assert.rejects(loadLinkedChildReport(c,parent,child),/parent_report_grants unavailable/);
 const d=client();
 const base=d.from;
 d.from=table=>{
  const q=base(table);
  if(table==='practice_sessions')q.limit=async()=>({data:null,error:new Error('history unavailable')});
  return q;
 };
 await assert.rejects(loadLinkedChildReport(d,parent,child),/history unavailable/);
});
test('request limit is capped and empty authorized history is valid',async()=>{
 const c=client([{student_user_id:child}],[]);
 const result=await loadLinkedChildReport(c,parent,child,10000);
 assert.equal(result.limit,200);
 assert.equal(result.sessions,0);
 assert.equal(result.questions,0);
});
