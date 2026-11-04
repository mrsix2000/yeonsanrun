import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FAMILY_STATES,describeFamilyState,validateChildAlias} from '../src/family.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const sql=readFileSync(new URL('../db/008_family_links.sql',import.meta.url),'utf8');
test('family states and aliases',()=>{
 assert.equal(describeFamilyState(FAMILY_STATES.UNLINKED),'연결된 자녀가 없습니다.');
 assert.equal(validateChildAlias('아이'),'');
 assert.match(validateChildAlias(' '),/1~20자/);
 assert.match(validateChildAlias('a'.repeat(21)),/1~20자/);
});
test('parent preview is explicitly not connected to DB',()=>{
 for(const id of ['family-section','family-alias','family-preview','family-message'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(main,/validateChildAlias/);
 assert.match(main,/DB 적용 전/);
 assert.doesNotMatch(main,/\.from\(['"]family_links/);
});
test('link schema enforces own reads and no direct writes',()=>{
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/parent_user_id <> student_user_id/);
 assert.match(sql,/auth\.uid\(\)/);
 assert.match(sql,/grant select on public\.family_links to authenticated/i);
 assert.doesNotMatch(sql,/grant (insert|update|delete)/i);
});
