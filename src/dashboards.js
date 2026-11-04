// 031-035: Safe dashboard presentation. Local records are never treated as child account records.
import {analyzeHistory} from './learning-history.js?v=010-1';
export function studentDashboard(records,now=new Date()){
 const a=analyzeHistory(records,now);
 return {headline:a.sessions?`${a.accuracy}% 정답률 · 평균 ${a.avgSeconds}초`:'첫 훈련을 시작해 보세요.',
  sessions:a.sessions,questions:a.total,accuracy:a.accuracy,averageSeconds:a.avgSeconds,
  weeklySessions:a.periods.week,weakTypes:a.byType.filter(t=>t.accuracy<80).slice(0,3),guidance:a.guidance};
}
export function parentDashboard(links=[]){
 return {children:links.map(x=>({alias:String(x.child_alias||'자녀'),status:'연결됨'})),
  notice:'자녀의 학습 기록은 서버 연동 전이므로 아직 표시되지 않습니다. 이 기기의 기록을 자녀 기록으로 간주하지 않습니다.'};
}
export function sessionTrend(records,limit=10){
 return records.slice(-limit).map(r=>{
  const total=r.attempts.length,correct=r.attempts.filter(a=>a.correct).length;
  return {at:r.at,mode:r.mode,accuracy:Math.round(correct/total*100),total};
 });
}
