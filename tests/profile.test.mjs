import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GRADES,isValidGrade,gradeLabel,loadStudentProfile,saveStudentProfile} from '../src/profile.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const sql=readFileSync(new URL('../db/007_student_profiles.sql',import.meta.url),'utf8');
test('nine distinct grades E1-E6 and M1-M3',()=>{
 assert.deepEqual(GRADES.map(x=>x.value),['E1','E2','E3','E4','E5','E6','M1','M2','M3']);
 assert.equal(isValidGrade('E1'),true);assert.equal(isValidGrade('M3'),true);
 assert.equal(isValidGrade('M4'),false);assert.equal(isValidGrade(''),false);
 assert.equal(gradeLabel('M2'),'중학교 2학년');
});
test('profile UI supports persisted grade after DB approval',()=>{
 for(const id of ['profile-grade','profile-preview','profile-message'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(main,/saveStudentProfile/);
 assert.match(main,/loadStudentProfile/);
 assert.match(main,/refreshProfile/);
});
test('proposed SQL requires ownership and grade constraint',()=>{
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/auth\.uid\(\)/);
 assert.match(sql,/with check/);
 assert.match(sql,/check \(grade_code in/);
});

test('profile read and upsert scoped to authenticated user',async()=>{
 const calls=[];
 const client={from(table){
  assert.equal(table,'student_profiles');
  return {
   select(fields){calls.push(['select',fields]);return {eq(key,id){calls.push(['eq',key,id]);return {async maybeSingle(){return {data:{grade_code:'E4'},error:null}}}}}},
   upsert(payload,opts){calls.push(['upsert',payload,opts]);return {select(){return {async single(){return {data:{grade_code:payload.grade_code},error:null}}}}}}
  };
 }};
 assert.equal(await loadStudentProfile(client,'uid-1'),'E4');
 assert.equal(await saveStudentProfile(client,'uid-1','M2'),'M2');
 assert.deepEqual(calls.find(x=>x[0]==='eq'),['eq','user_id','uid-1']);
 assert.equal(calls.find(x=>x[0]==='upsert')[1].user_id,'uid-1');
 await assert.rejects(()=>saveStudentProfile(client,'uid-1','M9'),/학년/);
 await assert.rejects(()=>loadStudentProfile(client,null),/로그인/);
});
