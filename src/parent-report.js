// Parent report presentation is independent of the privileged read API.
// Only accept records that an authorized server endpoint has already returned.
export function summarizeChildPractice(records,now=new Date()){
 if(!Array.isArray(records))throw new TypeError('학습 기록 배열이 필요합니다');
 let questions=0,correct=0,durationMs=0;
 const types=new Map();
 for(const session of records){
  if(!Array.isArray(session.attempts))throw new TypeError('잘못된 세션 기록');
  for(const a of session.attempts){
   questions++;if(a.correct===true)correct++;
   const ms=Number.isFinite(a.durationMs)?Math.max(0,a.durationMs):0;
   durationMs+=ms;
   const type=String(a.typeId||'unknown'),stat=types.get(type)||{typeId:type,total:0,correct:0};
   stat.total++;if(a.correct===true)stat.correct++;
   types.set(type,stat);
  }
 }
 const weakTypes=[...types.values()].map(x=>({...x,accuracy:Math.round(x.correct/x.total*100)}))
  .filter(x=>x.accuracy<80).sort((a,b)=>a.accuracy-b.accuracy||b.total-a.total).slice(0,5);
 const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-6);
 const weeklySessions=records.filter(r=>{const t=new Date(r.at);return !Number.isNaN(t.getTime())&&t>=start&&t<=now}).length;
 return {sessions:records.length,questions,correct,accuracy:questions?Math.round(correct/questions*100):0,
  averageSeconds:questions?Math.round(durationMs/questions/100)/10:0,weeklySessions,weakTypes};
}
export function parentReportNotice(linkedCount){
 return linkedCount?'연결된 자녀의 서버 학습 기록 조회는 권한 검증 후 제공됩니다.':'연결된 자녀가 없습니다.';
}
