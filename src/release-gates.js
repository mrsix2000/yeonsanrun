// 046-050: deterministic release gate. Missing operational capabilities are blockers.
export const RELEASE_CHECKS=Object.freeze([
 {id:'automated-tests',name:'자동 회귀 테스트',required:true},
 {id:'browser-smoke',name:'스테이징 실제 화면 검수',required:true},
 {id:'account-history',name:'계정별 서버 학습 기록 및 RLS',required:true},
 {id:'parent-report',name:'자녀별 서버 학습 리포트',required:true},
 {id:'trial-entitlement',name:'서버 체험·구독 권한',required:true},
 {id:'payments',name:'결제 및 해지·환불 검증',required:true},
 {id:'admin-security',name:'서버 관리자 권한 및 감사 기록',required:true},
 {id:'production-approval',name:'운영 배포 승인',required:true}
]);
export function evaluateRelease(evidence={}){
 const checks=RELEASE_CHECKS.map(check=>({...check,passed:evidence[check.id]===true}));
 return {ready:checks.every(x=>x.passed),checks,blockers:checks.filter(x=>!x.passed).map(x=>x.id)};
}
