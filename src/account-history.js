// 026-030: Optional account-backed history. Never contact a production DB from this module.
import {uploadPracticeSession,readOwnPracticeSessions} from './server-history.js?v=010-1';
import {normalizeSessionRecord} from './learning-history.js?v=010-1';
import {SUPABASE_URL} from './supabase-config.js?v=010-1';
const TEST_PROJECT='https://cjrvoamwejcpmhyejamn.supabase.co';
export const serverHistoryEnabled=()=>SUPABASE_URL===TEST_PROJECT;
export async function saveCompletedPractice(client,user,session,mode){
 if(!serverHistoryEnabled())return {status:'disabled'};
 if(!user?.id)return {status:'guest'};
 const record=normalizeSessionRecord(session,mode);
 const id=await uploadPracticeSession(client,record,user.id);
 return {status:'saved',id};
}
export async function fetchAccountPractice(client,user){
 if(!serverHistoryEnabled()||!user?.id)return [];
 const rows=await readOwnPracticeSessions(client,user.id,200);
 return rows.filter(row=>Array.isArray(row.practice_attempts)&&row.practice_attempts.length===5).map(row=>({
  at:row.completed_at,mode:row.mode,attempts:[...row.practice_attempts].sort((a,b)=>a.position-b.position).map(a=>({
   typeId:a.type_id,correct:a.correct===true,durationMs:a.duration_ms
  }))
 }));
}
