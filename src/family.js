// 008: 부모-자녀 연결 상태 모델. DB 승인 전 읽기/쓰기 동작 없음.
export const FAMILY_STATES=Object.freeze({
 UNLINKED:'unlinked',PENDING:'pending',LINKED:'linked',REVOKED:'revoked'
});
export function describeFamilyState(state){
 return ({
  unlinked:'연결된 자녀가 없습니다.',
  pending:'자녀 연결 요청이 승인 대기 중입니다.',
  linked:'자녀 연결이 완료되었습니다.',
  revoked:'연결이 해제되었습니다.'
 })[state]||'알 수 없는 연결 상태입니다.';
}
export function validateChildAlias(value){
 const alias=String(value??'').trim();
 if(alias.length<1||alias.length>20)return '자녀 표시 이름은 1~20자로 입력해 주세요.';
 return '';
}
