// 007: 학년 모델. DB 적용 전에는 저장하지 않습니다.
export const GRADES=Object.freeze([
  ...Array.from({length:6},(_,i)=>({value:'E'+(i+1),label:'초등학교 '+(i+1)+'학년'})),
  ...Array.from({length:3},(_,i)=>({value:'M'+(i+1),label:'중학교 '+(i+1)+'학년'}))
]);
export function isValidGrade(value){return GRADES.some(grade=>grade.value===value)}
export function gradeLabel(value){return GRADES.find(grade=>grade.value===value)?.label||'학년 미설정'}

export async function loadStudentProfile(client,userId){
 if(!userId)throw new Error('로그인이 필요합니다.');
 const {data,error}=await client.from('student_profiles').select('grade_code').eq('user_id',userId).maybeSingle();
 if(error)throw error;
 return data?.grade_code||'';
}
export async function saveStudentProfile(client,userId,gradeCode){
 if(!userId)throw new Error('로그인이 필요합니다.');
 if(!isValidGrade(gradeCode))throw new Error('올바른 학년을 선택해 주세요.');
 const {data,error}=await client.from('student_profiles').upsert({
  user_id:userId,grade_code:gradeCode,updated_at:new Date().toISOString()
 },{onConflict:'user_id'}).select('grade_code').single();
 if(error)throw error;
 return data.grade_code;
}
