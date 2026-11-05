import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('test history is isolated from production app and DB',()=>{
 const page=read('test-history.html'),harness=read('src/test-history.js');
 assert.match(page,/src\/test-history\.js\?v=010-1/);
 assert.match(harness,/cjrvoamwejcpmhyejamn\.supabase\.co/);
 assert.doesNotMatch(harness,/phydtapmwwonunqgaupx/);
 assert.match(harness,/uploadPracticeSession\(/);
 assert.match(harness,/readOwnPracticeSessions\(/);
 assert.match(harness,/signInWithPassword/);
 assert.match(harness,/signOut/);
 assert.match(page,/id="test-history"/);
 assert.doesNotMatch(read('src/main.js'),/test-history\.js/);
});
