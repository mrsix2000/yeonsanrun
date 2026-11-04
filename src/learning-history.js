// 026-030: Device-local, non-account-linked practice history.
// No credentials, email, profile or other personal identifiers are persisted.
export const HISTORY_KEY='yeonsanrun.practice.v1';
export const MAX_SESSIONS=200;
export function normalizeSessionRecord(session,mode='free',date=new Date()){
 if(!session?.complete||session.attempts?.length!==5)throw new RangeError('완료된 5문제 세션만 저장 가능');
 const attempts=session.attempts.map(a=>({
  typeId:String(a.typeId||'unknown'),correct:a.correct===true,
  durationMs:Number.isFinite(a.durationMs)?Math.max(0,Math.round(a.durationMs)):0
 }));
 return {at:date.toISOString(),mode:String(mode),attempts};
}
export function loadHistory(storage){
 try{
  const data=JSON.parse(storage.getItem(HISTORY_KEY)||'[]');
  return Array.isArray(data)?data.filter(x=>x&&Array.isArray(x.attempts)&&x.attempts.length===5&&typeof x.at==='string').slice(-MAX_SESSIONS):[];
 }catch{return []}
}
export function saveHistory(storage,session,mode='free',date=new Date()){
 const records=[...loadHistory(storage),normalizeSessionRecord(session,mode,date)].slice(-MAX_SESSIONS);
 storage.setItem(HISTORY_KEY,JSON.stringify(records));
 return records;
}
export function analyzeHistory(records,now=new Date()){
 const attempts=records.flatMap(s=>s.attempts);
 const total=attempts.length,correct=attempts.filter(a=>a.correct).length;
 const avgSeconds=total?Math.round(attempts.reduce((sum,a)=>sum+(a.durationMs||0),0)/total/100)/10:0;
 const types=new Map();
 for(const a of attempts){
  const x=types.get(a.typeId)||{typeId:a.typeId,total:0,correct:0,durationMs:0};
  x.total++;if(a.correct)x.correct++;x.durationMs+=a.durationMs||0;types.set(a.typeId,x);
 }
 const byType=[...types.values()].map(x=>({...x,accuracy:Math.round(x.correct/x.total*100),avgSeconds:Math.round(x.durationMs/x.total/100)/10}))
  .sort((a,b)=>a.accuracy-b.accuracy||b.avgSeconds-a.avgSeconds);
 const periods={day:0,week:0,month:0};
 const start=new Date(now);start.setHours(0,0,0,0);
 const weekStart=new Date(start);weekStart.setDate(start.getDate()-6);
 const monthStart=new Date(start);monthStart.setDate(start.getDate()-29);
 for(const s of records){
  const d=new Date(s.at);
  if(Number.isNaN(d.getTime())||d>now)continue;
  if(d>=start)periods.day++;
  if(d>=weekStart)periods.week++;
  if(d>=monthStart)periods.month++;
 }
 const guidance=total===0?'첫 5문제 훈련을 완료해 보세요.':byType[0]?.accuracy<80?'정답률이 낮은 '+byType[0].typeId+' 유형을 먼저 반복하세요.':'정확도가 안정적입니다. 풀이 시간을 줄이는 연습을 해 보세요.';
 return {sessions:records.length,total,correct,accuracy:total?Math.round(correct/total*100):0,avgSeconds,byType,periods,guidance};
}
