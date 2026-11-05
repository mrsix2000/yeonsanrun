export const ADMIN_AREAS=Object.freeze(['권한 설계','회원 관리 준비','콘텐츠 관리 준비','운영 통계 준비','보안 점검']);
export function adminReadiness(){return {areas:ADMIN_AREAS,enabled:false,message:'관리자 기능은 서버 권한 검증을 구축한 뒤 활성화됩니다.'};}
