import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {serverHistoryEnabled,saveCompletedPractice,fetchAccountPractice} from '../src/account-history.js';
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('production configuration cannot upload account history',async()=>{
 assert.equal(serverHistoryEnabled(),false);
 assert.deepEqual(await saveCompletedPractice(null,{id:'a'},null,'free'),{status:'disabled'});
 assert.deepEqual(await fetchAccountPractice(null,{id:'a'}),[]);
});
test('main keeps device history and only saves completed sessions after five answers',()=>{
 assert.match(main,/saveHistory\(localStorage,session,studyMode\)/);
 assert.match(main,/if\(session\.complete\)showResult\(\)/);
 assert.match(main,/saveAccountHistory\(completedSession,completedMode,completedUser\)/);
 assert.match(main,/accountHistoryRequest/);
 assert.match(main,/profileUserId!==userId/);
});
test('history UI explains account vs local separation',()=>{
 assert.match(html,/id="server-history-status"/);
 assert.match(html,/두 기록은 자동 합쳐지지 않습니다/);
 assert.match(html,/main\.js\?v=026-2/);
});
