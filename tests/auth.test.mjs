import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {isAuthConfigured,validateCredentials,getAuthClient,currentSession} from '../src/auth.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('authentication form and session controls are present',()=>{
 for(const id of ['view-auth','auth-form','auth-email','auth-password','auth-login-tab','auth-signup-tab','auth-logout','auth-message'])
  assert.match(html,new RegExp('id="'+id+'"'));
 for(const name of ['signIn','signUp','signOut','currentSession','subscribeAuthChange'])
  assert.match(main,new RegExp(name));
});
test('invalid email and short passwords rejected',()=>{
 assert.match(validateCredentials('not-email','12345678'),/이메일/);
 assert.match(validateCredentials('a@example.com','123'),/8자/);
 assert.equal(validateCredentials('a@example.com','12345678'),'');
});
test('unconfigured staging never pretends login works',async()=>{
 assert.equal(isAuthConfigured(),false);
 assert.equal(await currentSession(),null);
 await assert.rejects(getAuthClient(),/설정 전/);
 assert.match(main,/auth-submit'\)\.disabled=true/);
});
test('auth uses only public config and no secret key',()=>{
 const config=readFileSync(new URL('../src/supabase-config.js',import.meta.url),'utf8');
 assert.match(config,/SUPABASE_PUBLISHABLE_KEY/);
 assert.doesNotMatch(config,/^export const (SERVICE_ROLE|SUPABASE_SECRET_KEY)/m);
});
