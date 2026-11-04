export const FAMILY_STATES=Object.freeze({UNLINKED:'unlinked',PENDING:'pending',LINKED:'linked',REVOKED:'revoked'});
export function describeFamilyState(state){return ({unlinked:'연결된 자녀가 없습니다.',pending:'자녀 연결 요청이 승인 대기 중입니다.',linked:'자녀 연결이 완료되었습니다.',revoked:'연결이 해제되었습니다.'})[state]||'알 수 없는 연결 상태입니다.';}
export function validateChildAlias(value){const alias=String(value??'').trim();return alias.length<1||alias.length>20?'자녀 표시 이름은 1~20자로 입력해 주세요.':'';}
export function validateInviteCode(value){return /^[0-9a-f]{32}$/.test(String(value??'').trim())?'':'연결 코드는 영문 소문자·숫자 32자리입니다.';}
export async function createFamilyInvite(client){const {data,error}=await client.rpc('create_family_invite');if(error)throw error;return data;}
export async function redeemFamilyInvite(client,code,alias){const validation=validateChildAlias(alias)||validateInviteCode(code);if(validation)throw new Error(validation);const {data,error}=await client.rpc('redeem_family_invite',{invite_code:code.trim(),alias_name:alias.trim()});if(error)throw error;if(!data)throw new Error('연결 실패: 코드·만료시간 또는 시도 횟수를 확인해 주세요.');return data;}
export async function loadFamilyLinks(client,userId){if(!userId)return [];const {data,error}=await client.from('family_links').select('id,student_user_id,child_alias,created_at').eq('parent_user_id',userId).order('created_at',{ascending:false});if(error)throw error;return data||[];}
