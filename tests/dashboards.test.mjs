import test from 'node:test';
import assert from 'node:assert/strict';
import {studentDashboard,parentDashboard,sessionTrend} from '../src/dashboards.js';
import {readFileSync} from 'node:fs';
const records=[{at:'2026-11-05T08:00:00.000Z',mode:'free',attempts:Array.from({length:5},(_,i)=>({typeId:'natural.add',correct:i<4,durationMs:1000}))}];
test('031-032: student dashboard and recent session trend',()=>{
 const a=studentDashboard(records,new Date('2026-11-05T12:00:00Z'));
 assert.equal(a.accuracy,80);assert.equal(a.questions,5);assert.equal(a.averageSeconds,1);
 assert.equal(sessionTrend(records)[0].accuracy,80);
});
test('033-034: parent summary never leaks local device history as child data',()=>{
 const p=parentDashboard([{child_alias:'첫째'}]);
 assert.equal(p.children.length,1);
 assert.match(p.notice,/서버 연동 전/);
 assert.equal('accuracy' in p.children[0],false);
});
test('035: responsive and accessible dashboard elements exist',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 for(const id of ['student-dashboard','student-guidance','history-trend','parent-dashboard-count','parent-dashboard-notice'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/focus-visible/);
});
