import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateNewEmail,validateNewPassword,changeAccountEmail,changeAccountPassword,ACCOUNT_DELETION_STATUS} from '../src/account.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('validate email and password confirmation',()=>{
 assert.match(validateNewEmail('bad'),/이메일/);
 assert.equal(validateNewEmail('  student@example.com  '),'');
 assert.match(validateNewPassword('1234567','1234567'),/8자/);
 assert.match(validateNewPassword('12345678','different'),/일치/);
 assert.equal(validateNewPassword('12345678','12345678'),'');
});
test('email update uses authenticated user API, not admin or direct DB',async()=>{
 const calls=[];const client={auth:{updateUser:async payload=>{calls.push(payload);return {data:{user:{id:'x'}},error:null}}}};
 await changeAccountEmail(client,'  new@example.com  ');
 assert.deepEqual(calls,[{email:'new@example.com'}]);
 await assert.rejects(()=>changeAccountEmail(client,'invalid'),/이메일/);
 assert.equal(calls.length,1);
});
test('password update never sends mismatched passwords',async()=>{
 const calls=[];const client={auth:{updateUser:async payload=>{calls.push(payload);return {data:{},error:null}}}};
 await assert.rejects(()=>changeAccountPassword(client,'12345678','nope'),/일치/);
 assert.equal(calls.length,0);
 await changeAccountPassword(client,'12345678','12345678');
 assert.deepEqual(calls,[{password:'12345678'}]);
});
test('Supabase errors propagate and deletion is not executable',async()=>{
 const client={auth:{updateUser:async()=>({error:new Error('auth failure')})}};
 await assert.rejects(()=>changeAccountEmail(client,'a@example.com'),/auth failure/);
 assert.match(ACCOUNT_DELETION_STATUS,/승인 대기/);
 assert.doesNotMatch(main,/auth\.admin\.deleteUser|deleteUser\(/);
 assert.doesNotMatch(html,/id="account-delete-submit"/);
});
test('account forms exist and logout clears sensitive fields',()=>{
 for(const id of ['account-settings','account-email-form','account-email','account-password-form','account-new-password','account-confirm-password','account-deletion-status'])
  assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(main,/account-new-password'\)\.value=''/);
 assert.match(main,/account-confirm-password'\)\.value=''/);
 assert.match(main,/account-settings'\)\.hidden=!loggedIn/);
});
