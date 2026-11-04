import test from 'node:test';
import assert from 'node:assert/strict';
import {AREAS,CONTENT_TYPES,GRADE_CODES,TOTAL_TYPES,getContentType,getTypesForGrade,validateCatalog} from '../src/catalog.js';
test('011: 영역별 유형 수 및 고유 ID',()=>{
 assert.equal(AREAS.length,8);assert.equal(TOTAL_TYPES,35);
 assert.deepEqual(AREAS.map(a=>a.count),[5,6,4,5,4,4,3,4]);
 assert.equal(new Set(CONTENT_TYPES.map(t=>t.id)).size,35);
 assert.equal(validateCatalog(),true);
});
test('011: 학년 순서와 계획/구현 분리',()=>{
 assert.equal(GRADE_CODES.length,9);
 assert.equal(getContentType('natural.add').status,'available');
 assert.equal(getContentType('fraction.multiply').status,'available');
 assert.equal(getContentType('invalid'),null);
 assert.ok(getTypesForGrade('E1').every(t=>t.gradeIndex<=0));
 assert.ok(getTypesForGrade('M3').length===35);
 assert.equal(getTypesForGrade('M3',{includePlanned:false}).length,24);
 assert.throws(()=>getTypesForGrade('E7'),RangeError);
});
