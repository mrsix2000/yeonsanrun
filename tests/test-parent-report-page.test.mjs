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
 assert.doesNotMatch(index,/test-parent-report.html/);
});
