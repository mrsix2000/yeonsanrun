// 문제 생성/채점 순수 함수. 자연수 사칙연산 기초 유형.
export const OPERATIONS=Object.freeze([
  {id:'add',label:'덧셈',symbol:'+'},
  {id:'subtract',label:'뺄셈',symbol:'−'},
  {id:'multiply',label:'곱셈',symbol:'×'},
  {id:'divide',label:'나눗셈',symbol:'÷'}
]);
const draw=(random,min,max)=>Math.floor(Math.min(0.999999999,Math.max(0,random()))*(max-min+1))+min;
export function createQuestion(operation='add',random=Math.random){
  if(!OPERATIONS.some(op=>op.id===operation))throw new RangeError('지원하지 않는 연산');
  const a=draw(random,1,9),b=draw(random,1,9);
  let left=a,right=b,answer,symbol;
  switch(operation){
    case 'add': answer=a+b;symbol='+';break;
    case 'subtract':left=Math.max(a,b);right=Math.min(a,b);answer=left-right;symbol='−';break;
    case 'multiply':answer=a*b;symbol='×';break;
    case 'divide':left=a*b;right=b;answer=a;symbol='÷';break;
  }
  return {id:'natural.'+operation+'.basic',operation,text:`${left} ${symbol} ${right} = ?`,answer};
}
export function createAdditionQuestion(random=Math.random){return createQuestion('add',random)}
export function gradeAnswer(question,raw){
  const input=String(raw).trim();
  return input!=='' && /^-?\d+$/.test(input) && Number(input)===question.answer;
}
