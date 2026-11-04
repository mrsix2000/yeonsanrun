// 036-040: Non-transactional billing preview. Never grants access or initiates payment.
export const TRIAL_DAYS=7;
export const BILLING_STATUS=Object.freeze({preview:'preview_only',pending:'not_available',active:'not_available'});
export const PLAN_OPTIONS=Object.freeze([
 {id:'monthly',label:'월간',months:1,price:null},
 {id:'half-year',label:'6개월',months:6,price:null},
 {id:'annual',label:'12개월',months:12,price:null}
]);
export function trialPreview(startedAt,now=new Date()){
 const start=new Date(startedAt),end=new Date(start.getTime()+TRIAL_DAYS*86400000);
 if(Number.isNaN(start.getTime())||Number.isNaN(now.getTime()))throw new RangeError('유효하지 않은 날짜');
 const remaining=Math.max(0,Math.ceil((end.getTime()-now.getTime())/86400000));
 return {start:start.toISOString(),end:end.toISOString(),remainingDays:remaining,expired:remaining===0,isPreview:true};
}
export function planPreview(planId){
 const plan=PLAN_OPTIONS.find(p=>p.id===planId);
 if(!plan)throw new RangeError('지원하지 않는 요금제');
 return {...plan,status:BILLING_STATUS.preview,checkoutEnabled:false,
  notice:'가격·결제사·환불 정책 확정 전 안내 화면입니다. 실제 결제나 구독 권한은 발생하지 않습니다.'};
}
export function subscriptionPreview(){
 return {status:BILLING_STATUS.preview,entitled:false,canCharge:false,canCancel:false,
  notice:'실제 구독 내역이 아닙니다. 결제·자동 갱신·환불은 지원하지 않습니다.'};
}
export function requestCheckout(){throw new Error('결제 기능은 비활성화되어 있습니다. 운영 승인 후 서버에서 구현해야 합니다.')}
export function requestRefund(){throw new Error('환불 기능은 비활성화되어 있습니다.')}
