import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../test-parent-report.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/test-parent-report.js',import.meta.url),'utf8');
test('test parent report page is isolated and interactive',()=>{
 for(const id of ['parent-login','parent-logout','parent-refresh','parent-children','parent-summary'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(js,/loadLinkedChildReport/);assert.match(js,/signInWithPassword/);assert.match(js,/signOut/);
 assert.match(js,/parent_report_grants/);
});
test('test client never uses production project',()=>{
 assert.match(js,/cjrvoamwejcpmhyejamn/);
 assert.doesNotMatch(js,/phydtapmwwonunqgaupx/);
 const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const recovery=index.match(/<p id="auth-recovery-help"[^>]*>[\\s\\S]*?<\\/p>/)?.[0]||'';
 assert.match(recovery,/hidden/);
 assert.match(recovery,/href="\\.\\/test-parent-report\\.html"/);
 assert.match(main,/auth-recovery-help'\\)\\.hidden=!serverHistoryEnabled\\(\\)/);
 const navigation=index.match(/<nav[^>]*>[\\s\\S]*?<\\/nav>/)?.[0]||'';
 assert.doesNotMatch(navigation,/test-parent-report\\.html/);
});

test('default recovery link flow requires no custom SMTP template',()=>{
 for(const id of ['parent-reset','parent-recovery','parent-new-password'])assert.ok(html.includes('id="'+id+'"'));
 assert.doesNotMatch(html,/id="parent-otp"/);
 assert.match(js,/resetPasswordForEmail/);
 assert.match(js,/PASSWORD_RECOVERY/);
 assert.match(js,/recoveryReady=true/);
 assert.match(js,/updateUser\(\{password\}\)/);
 assert.doesNotMatch(js,/verifyOtp|sb_secret_|service_role/);
});

test('rate-limited recovery request shows a retry-later message',()=>{
 assert.match(js,/over_email_send_rate_limit/);
 assert.match(js,/e\?\.status===429/);
 assert.match(js,/버튼을 반복해서 누르지 마세요/);
});
