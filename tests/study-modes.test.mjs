import test from 'node:test';
import assert from 'node:assert/strict';
import {STUDY_MODES,selectStudyTypes,scoreTypes,diagnosticSummary} from '../src/study-modes.js';
import {readFileSync} from 'node:fs';
test('021-025: five modes and five diagnostic questions',()=>{
 assert.equal(STUDY_MODES.length,5);
 assert.equal(selectStudyTypes('diagnostic').length,5);
 assert.ok(selectStudyTypes('free').length>=24);
 assert.equal(selectStudyTypes('daily').length,1);
 assert.throws(()=>selectStudyTypes('unknown'),RangeError);
});
test('023-025: prioritize weak type based on actual answers',()=>{
 const history=[
 {typeId:'natural.add',correct:true,durationMs:1000},
 {typeId:'natural.subtract',correct:false,durationMs:3000},
 {typeId:'natural.subtract',correct:false,durationMs:2500}
 ];
 assert.equal(scoreTypes(history)[0].typeId,'natural.subtract');
 assert.deepEqual(selectStudyTypes('weak',history),['natural.subtract']);
 assert.deepEqual(selectStudyTypes('recommended',history),['natural.subtract']);
 assert.deepEqual(diagnosticSummary(history),{total:3,correct:1,accuracy:33,weakTypes:['natural.subtract']});
});
test('021-025: selector and diagnostic summary connected to UI',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 for(const id of ['study-mode','mode-help','mode-summary'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(main,/selectStudyTypes\(studyMode,recentAttempts\)/);
 assert.match(main,/diagnosticSummary\(session.attempts\)/);
});
