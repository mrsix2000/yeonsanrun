// 021-025: Browser-only learning modes. No persistence or diagnostic claims beyond observed attempts.
import {availableTypes} from './typed-engine.js?v=010-1';
export const STUDY_MODES=Object.freeze([
 {id:'free',name:'자유 훈련'},
 {id:'diagnostic',name:'기초 진단'},
 {id:'weak',name:'취약 유형 반복'},
 {id:'daily',name:'오늘의 챌린지'},
 {id:'recommended',name:'추천 훈련'}
]);
export function selectStudyTypes(mode,history=[],random=Math.random){
 const types=availableTypes().map(t=>t.id);
 if(mode==='free')return types;
 if(mode==='diagnostic')return ['natural.add','natural.subtract','natural.multiply','natural.divide','fraction.add-same'].filter(id=>types.includes(id));
 if(mode==='daily'){
  const day=Math.floor(Date.now()/86400000);
  return [types[day%types.length]];
 }
 if(mode==='weak'){
  const scored=scoreTypes(history).filter(x=>x.wrong>0);
  return scored.length?scored.map(x=>x.typeId):['natural.add'];
 }
 if(mode==='recommended'){
  const scored=scoreTypes(history);
  return scored.length?[scored[0].typeId]:['natural.add'];
 }
 throw new RangeError('지원하지 않는 학습 모드');
}
export function scoreTypes(history=[]){
 const map=new Map();
 for(const a of history){
  if(!a.typeId)continue;
  const s=map.get(a.typeId)||{typeId:a.typeId,total:0,wrong:0,durationMs:0};
  s.total++;if(!a.correct)s.wrong++;s.durationMs+=a.durationMs||0;map.set(a.typeId,s);
 }
 return [...map.values()].sort((a,b)=>b.wrong/b.total-a.wrong/a.total||b.durationMs/b.total-a.durationMs/a.total||a.typeId.localeCompare(b.typeId));
}
export function diagnosticSummary(attempts=[]){
 const total=attempts.length,correct=attempts.filter(a=>a.correct).length;
 return {total,correct,accuracy:total?Math.round(correct/total*100):0,weakTypes:scoreTypes(attempts).filter(x=>x.wrong).map(x=>x.typeId)};
}
