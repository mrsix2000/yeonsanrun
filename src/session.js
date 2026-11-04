export const SESSION_SIZE=5;
export function createSession(){return {attempts:[],complete:false}}
export function recordAttempt(session,question,input,correct){
 if(session.complete)throw new RangeError('session finished');
 const attempts=[...session.attempts,{text:question.text,answer:question.answer,input,correct,typeId:question.typeId||null,durationMs:Number.isFinite(question.durationMs)?question.durationMs:null}];
 return {attempts,complete:attempts.length===SESSION_SIZE};
}
export function summarizeSession(session){
 const correct=session.attempts.filter(a=>a.correct).length;
 return {correct,total:session.attempts.length,accuracy:Math.round(correct/session.attempts.length*100),mistakes:session.attempts.filter(a=>!a.correct),totalDurationMs:session.attempts.reduce((sum,a)=>sum+(a.durationMs||0),0)};
}
