// 010: Profile changes use Supabase Auth, never privileged browser credentials.
export function validateNewEmail(value){
 const email=String(value||'').trim();
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?'':'올바른 이메일 주소를 입력해 주세요.';
}
export function validateNewPassword(value,confirmation){
 if(typeof value!=='string'||value.length<8)return '새 비밀번호는 8자 이상 입력해 주세요.';
 if(value!==confirmation)return '비밀번호 확인이 일치하지 않습니다.';
 return '';
}
export async function changeAccountEmail(client,email){
 const errorText=validateNewEmail(email);if(errorText)throw new Error(errorText);
 const {data,error}=await client.auth.updateUser({email:email.trim()});
 if(error)throw error;return data;
}
export async function changeAccountPassword(client,password,confirmation){
 const errorText=validateNewPassword(password,confirmation);if(errorText)throw new Error(errorText);
 const {data,error}=await client.auth.updateUser({password});
 if(error)throw error;return data;
}
// Account deletion requires an approved, authenticated server endpoint and data-retention plan.
// No deleteUser, admin API, or database delete is exposed in the browser.
export const ACCOUNT_DELETION_STATUS='승인 대기: 탈퇴는 본인 재인증, 연결 데이터 처리 및 서버 측 삭제 기능 승인 후 제공됩니다.';
