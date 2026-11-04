import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY_KEY,loadHistory,saveHistory,analyzeHistory,normalizeSessionRecord} from '../src/learning-history.js';
import {createSession,recordAttempt} from '../src/session.js';
import {readFileSync} from 'node:fs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};
function completed(type='natural.add',correct=true){
 let s=createSession();
 for(let i=0;i<5;i++)s=recordAttempt(s,{text:'1+1',answer:'2',typeId:type,durationMs:1000},'2',correct);
 return s;
}
test('026: completed sessions persist locally and survive reload',()=>{
 const store=memory();
 assert.throws(()=>normalizeSessionRecord(createSession()),RangeError);
 saveHistory(store,completed(),'free',new Date('2026-11-05T08:00:00Z'));
 assert.equal(loadHistory(store).length,1);
 assert.equal(JSON.parse(store.getItem(HISTORY_KEY))[0].attempts.length,5);
 assert.equal(loadHistory(store)[0].attempts[0].typeId,'natural.add');
});
test('027-030: accuracy, timing, weak types, rolling activity and guidance',()=>{
 const store=memory(),now=new Date('2026-11-05T12:00:00Z');
 saveHistory(store,completed('natural.add',true),'free',new Date('2026-11-05T08:00:00Z'));
 saveHistory(store,completed('fraction.multiply',false),'weak',new Date('2026-11-03T08:00:00Z'));
 const a=analyzeHistory(loadHistory(store),now);
 assert.equal(a.sessions,2);assert.equal(a.total,10);assert.equal(a.accuracy,50);
 assert.equal(a.avgSeconds,1);assert.equal(a.byType[0].typeId,'fraction.multiply');
 assert.deepEqual(a.periods,{day:1,week:2,month:2});
 assert.match(a.guidance,/fraction.multiply/);
});
test('026: corrupt history fails safely and caps retention',()=>{
 const store=memory();store.setItem(HISTORY_KEY,'broken');
 assert.deepEqual(loadHistory(store),[]);
 for(let i=0;i<202;i++)saveHistory(store,completed());
 assert.equal(loadHistory(store).length,200);
});
test('026-030: browser UI has local record status and analytics',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 for(const id of ['history-summary','history-periods','history-guidance','history-types','record-status'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(main,/saveHistory\(localStorage,session,studyMode\)/);
 assert.match(main,/renderLearningHistory\(\)/);
});
