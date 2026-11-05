import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {toServerSession,readOwnPracticeSessions} from '../src/server-history.js';
test('server record is normalized with ownership and positions',()=>{
 const record={mode:'free',at:'2026-11-05T00:00:00Z',attempts:Array.from({length:5},()=>({typeId:'natural.add',correct:true,durationMs:1000}))};
 const x=toServerSession(record,'user-1');
 assert.equal(x.attempts.length,5);
 assert.equal(x.attempts[4].position,5);
 assert.ok(x.attempts.every(a=>a.user_id==='user-1'));
 assert.throws(()=>toServerSession({...record,attempts:[]},'user-1'),RangeError);
});
test('read adapter filters user and limits results',async()=>{
 const calls=[];
 const chain={select(){return this},eq(k,v){calls.push([k,v]);return this},order(){return this},limit(n){calls.push(['limit',n]);return Promise.resolve({data:[],error:null})}};
 const result=await readOwnPracticeSessions({from(){return chain}},'user-1',1000);
 assert.deepEqual(result,[]);
 assert.deepEqual(calls,[['user_id','user-1'],['limit',200]]);
});
test('schema enables RLS and restricts rows to auth uid',()=>{
 const sql=readFileSync(new URL('../docs/PRACTICE_HISTORY_SCHEMA_DRAFT.sql',import.meta.url),'utf8');
 assert.match(sql,/practice_sessions enable row level security/);
 assert.match(sql,/practice_attempts enable row level security/);
 assert.equal((sql.match(/user_id=\(select auth.uid\(\)\)/g)||[]).length,4);
 assert.match(sql,/foreign key \(session_id,user_id\)/);
 assert.doesNotMatch(sql,/grant[^;]*update/i);
});
