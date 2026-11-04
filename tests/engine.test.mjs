import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdditionQuestion,gradeAnswer} from '../src/engine.js';
import {AREAS,TOTAL_TYPES} from '../src/catalog.js';
test('8개 영역과 35개 유형',()=>{assert.equal(AREAS.length,8);assert.equal(TOTAL_TYPES,35);assert.equal(new Set(AREAS.map(a=>a.id)).size,8)});
test('문제 생성 경계값',()=>{assert.equal(createAdditionQuestion(()=>0).answer,2);assert.equal(createAdditionQuestion(()=>0.999).answer,18)});
test('정답과 오답 판정',()=>{const q=createAdditionQuestion(()=>0);assert.equal(gradeAnswer(q,'2'),true);assert.equal(gradeAnswer(q,'3'),false);assert.equal(gradeAnswer(q,''),false);assert.equal(gradeAnswer(q,'2abc'),false)});
