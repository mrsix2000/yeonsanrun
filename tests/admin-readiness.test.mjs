import test from 'node:test';
import assert from 'node:assert/strict';
import {ADMIN_AREAS,adminReadiness} from '../src/admin-readiness.js';
test('041-045 readiness model is non-operational',()=>{
 const status=adminReadiness();
 assert.equal(ADMIN_AREAS.length,5);
 assert.equal(status.enabled,false);
 assert.equal(typeof status.message,'string');
});
