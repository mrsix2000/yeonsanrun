import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateChildAlias,validateInviteCode,createFamilyInvite,redeemFamilyInvite,loadFamilyLinks} from '../src/family.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('validates alias and 128-bit invite code',()=>{assert.equal(validateChildAlias('아이'),'');assert.match(validateChildAlias(' '),/1~20자/);assert.match(validateChildAlias('a'.repeat(21)),/1~20자/);assert.equal(validateInviteCode('a'.repeat(32)),'');assert.ok(validateInviteCode('A'.repeat(32)));});
test('student code generation RPC',async()=>{const client={rpc:async name=>{assert.equal(name,'create_family_invite');return {data:'a'.repeat(32),error:null}}};assert.equal(await createFamilyInvite(client),'a'.repeat(32));});
test('parent redeem RPC and failed code',async()=>{const client={rpc:async(name,args)=>{assert.equal(name,'redeem_family_invite');assert.equal(args.alias_name,'아이');return {data:null,error:null}}};await assert.rejects(redeemFamilyInvite(client,'a'.repeat(32),'아이'),/연결 실패/);});
test('parent only queries own links',async()=>{const client={from:name=>{assert.equal(name,'family_links');return {select:()=>({eq:(field,id)=>{assert.equal(field,'parent_user_id');assert.equal(id,'u1');return {order:async()=>({data:[],error:null})}}})}}};assert.deepEqual(await loadFamilyLinks(client,'u1'),[]);});
test('UI contains link code and result controls',()=>{for(const id of ['family-section','family-alias','family-code','family-preview','family-generate','family-links','family-message'])assert.match(html,new RegExp('id="'+id+'"'));});

const schema=readFileSync(new URL('../db/009_test_only_family_profile_schema.sql',import.meta.url),'utf8');
test('test-only family schema uses RLS, hashed short-lived invites, and scoped RPCs',()=>{
 assert.match(schema,/alter table public\.student_profiles enable row level security/i);
 assert.match(schema,/alter table public\.family_links enable row level security/i);
 assert.match(schema,/alter table public\.family_invites enable row level security/i);
 assert.match(schema,/alter table public\.family_link_attempts enable row level security/i);
 assert.match(schema,/family_invites_deny_api[\\s\\S]*?using \(false\) with check \(false\)/i);
 assert.match(schema,/family_link_attempts_deny_api[\\s\\S]*?using \(false\) with check \(false\)/i);
 assert.match(schema,/code_hash text not null unique/i);
 assert.match(schema,/extensions\.digest\(/i);
 assert.match(schema,/expires_at > pg_catalog\.now\(\)/i);
 assert.match(schema,/attempts >= 5/i);
 assert.match(schema,/security definer[\s\S]*?set search_path = ''/i);
 assert.match(schema,/revoke all on function public\.create_family_invite\(\) from public, anon, authenticated/i);
 assert.match(schema,/grant execute on function public\.create_family_invite\(\) to authenticated/i);
 assert.match(schema,/grant execute on function public\.redeem_family_invite\(text, text\) to authenticated/i);
 assert.doesNotMatch(schema,/service_role|sb_secret_/i);
});
