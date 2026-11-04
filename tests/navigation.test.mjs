import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRoute,ROUTES} from '../src/navigation.js';
test('공통 메뉴 경로 세 개',()=>assert.deepEqual(ROUTES,['home','practice','history']));
test('정상 해시 경로',()=>{for(const route of ROUTES)assert.equal(normalizeRoute('#'+route),route)});
test('잘못된 경로와 빈 해시는 홈으로',()=>{for(const hash of ['','#unknown','#HOME','#../history'])assert.equal(normalizeRoute(hash),'home')});
