// Server adapter draft. Call only after a separate test DB is provisioned and RLS verified.
export function toServerSession(record,userId){
 if(!userId||!record||!Array.isArray(record.attempts)||record.attempts.length!==5)throw new RangeError('완료 세션과 사용자 ID 필요');
 const modes=new Set(['free','diagnostic','weak','daily','recommended']);
 if(!modes.has(record.mode))throw new RangeError('잘못된 학습 모드');
 return {session:{user_id:userId,mode:record.mode,completed_at:record.at},
  attempts:record.attempts.map((a,i)=>({user_id:userId,position:i+1,type_id:String(a.typeId),correct:a.correct===true,duration_ms:a.durationMs}))};
}
export async function uploadPracticeSession(client,record,userId){
 const {session,attempts}=toServerSession(record,userId);
 const {data,error}=await client.from('practice_sessions').insert(session).select('id').single();
 if(error)throw error;
 const rows=attempts.map(a=>({...a,session_id:data.id}));
 const result=await client.from('practice_attempts').insert(rows);
 if(result.error)throw result.error;
 return data.id;
}
export async function readOwnPracticeSessions(client,userId,limit=50){
 if(!userId)throw new RangeError('로그인이 필요합니다');
 const count=Math.max(1,Math.min(200,Math.trunc(limit)||50));
 const {data,error}=await client.from('practice_sessions').select('id,mode,completed_at,practice_attempts(position,type_id,correct,duration_ms)').eq('user_id',userId).order('completed_at',{ascending:false}).limit(count);
 if(error)throw error;
 return data;
}
