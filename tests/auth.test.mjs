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
test('Supabase public auth configuration is present',()=>{
 assert.equal(isAuthConfigured(),true);
 assert.match(main,/currentSession\(\)/);
 assert.match(main,/subscribeAuthChange\(displaySession\)/);
});
test('auth uses only public config and no secret key',()=>{
 const config=readFileSync(new URL('../src/supabase-config.js',import.meta.url),'utf8');
 assert.match(config,/SUPABASE_PUBLISHABLE_KEY/);
 assert.doesNotMatch(config,/^export const (SERVICE_ROLE|SUPABASE_SECRET_KEY)/m);
});

test('password recovery shortcut is present but staging-only',()=>{
 assert.match(html,/id="auth-recovery-help"[^>]*hidden/);
 assert.match(html,/id="auth-recovery-link"/);
 assert.match(html,/href="\.\/test-parent-report\.html"/);
 assert.match(main,/\$\('auth-recovery-help'\)\.hidden=!serverHistoryEnabled\(\)/);
});

test('staging legacy profile/family actions are disabled pending schema',()=>{
 assert.match(main,/if\(serverHistoryEnabled\(\)\)\s*\{/);
 for(const id of ['profile-preview','family-preview','family-generate']) assert.match(main,new RegExp("\\$\\('"+id+"'\\)\\.disabled=true"));
});
