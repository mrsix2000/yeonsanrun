import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRelease,RELEASE_CHECKS} from '../src/release-gates.js';
import {adminReadiness} from '../src/admin-readiness.js';
import {readFileSync} from 'node:fs';
test('041-045: readiness page is informational',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.equal(adminReadiness().enabled,false);
 assert.match(html,/id="view-admin"/);
 assert.match(main,/adminReadiness\(\)/);
});
test('046-050: release is blocked by default and requires all checks',()=>{
 const result=evaluateRelease();
 assert.equal(result.ready,false);
 assert.equal(result.blockers.length,RELEASE_CHECKS.length);
 assert.equal(evaluateRelease(Object.fromEntries(RELEASE_CHECKS.map(x=>[x.id,true]))).ready,true);
 assert.equal(evaluateRelease({'automated-tests':true}).ready,false);
});
test('046-050: production approval and payment verification cannot be bypassed',()=>{
 const all=Object.fromEntries(RELEASE_CHECKS.map(x=>[x.id,true]));
 delete all['production-approval'];delete all.payments;
 const r=evaluateRelease(all);
 assert.deepEqual(r.blockers,['payments','production-approval']);
});
