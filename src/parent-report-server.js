// Read-only parent report adapter. RLS determines whether a linked child's records are visible.
import {summarizeChildPractice} from './parent-report.js?v=010-1';
export async function loadLinkedChildReport(client,parentId,studentId,limit=100){
 if(!parentId||!studentId||parentId===studentId)throw new RangeError('학부모 및 자녀 계정이 필요합니다');
 const {data:{user}={},error:authError}=await client.auth.getUser();
 if(authError)throw authError;
 if(user?.id!==parentId)throw new Error('현재 학부모 인증 정보가 일치하지 않습니다');
 const {data:grants,error:grantError}=await client.from('parent_report_grants')
  .select('student_user_id').eq('parent_user_id',parentId).eq('student_user_id',studentId).limit(1);
 if(grantError)throw grantError;
 if(!grants?.length)throw new Error('연결되지 않은 자녀입니다');
 const size=Math.max(1,Math.min(200,Math.trunc(limit)||100));
 const {data,error}=await client.from('practice_sessions')
  .select('id,mode,completed_at,practice_attempts(position,type_id,correct,duration_ms)')
  .eq('user_id',studentId).order('completed_at',{ascending:false}).limit(size);
 if(error)throw error;
 const records=(data||[]).map(r=>({at:r.completed_at,mode:r.mode,
  attempts:(r.practice_attempts||[]).map(a=>({typeId:a.type_id,correct:a.correct,durationMs:a.duration_ms}))}));
 return {studentId,...summarizeChildPractice(records),sampledSessions:records.length,limit:size};
}
