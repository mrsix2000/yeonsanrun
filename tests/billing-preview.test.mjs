import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TRIAL_DAYS,PLAN_OPTIONS,trialPreview,planPreview,subscriptionPreview,requestCheckout,requestRefund} from '../src/billing-preview.js';
test('036: 7 day trial preview never grants entitlement',()=>{
 assert.equal(TRIAL_DAYS,7);
 const trial=trialPreview('2026-11-01T00:00:00.000Z',new Date('2026-11-05T00:00:00.000Z'));
 assert.equal(trial.remainingDays,3);assert.equal(trial.isPreview,true);
 assert.equal(trialPreview('2026-11-01T00:00:00.000Z',new Date('2026-11-09T00:00:00.000Z')).expired,true);
 assert.throws(()=>trialPreview('invalid'),RangeError);
});
test('037-040: plans unpriced, payment and refunds disabled',()=>{
 assert.deepEqual(PLAN_OPTIONS.map(x=>x.months),[1,6,12]);
 for(const p of PLAN_OPTIONS){const x=planPreview(p.id);assert.equal(x.price,null);assert.equal(x.checkoutEnabled,false)}
 assert.equal(subscriptionPreview().entitled,false);
 assert.equal(subscriptionPreview().canCharge,false);
 assert.throws(requestCheckout,/비활성화/);assert.throws(requestRefund,/비활성화/);
});
test('036-040: plans route is visible but checkout button is disabled',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(html,/id="view-plans"/);assert.match(html,/id="checkout-disabled"[^>]*disabled/);
 assert.match(html,/가격·결제사·환불 정책은 미확정/);
 assert.match(main,/renderPlanPreview\(\)/);
});
