// Pure question generation. Legacy two-argument createQuestion(operation, random) remains supported.
export const OPERATIONS=Object.freeze([
 {id:'add',label:'덧셈',symbol:'+'},{id:'subtract',label:'뺄셈',symbol:'−'},
 {id:'multiply',label:'곱셈',symbol:'×'},{id:'divide',label:'나눗셈',symbol:'÷'}
]);
export const DIGITS=Object.freeze([1,2,3]);
export const CONDITIONS=Object.freeze([{id:'any',label:'전체'},{id:'without',label:'받아올림·받아내림 없음'},{id:'with',label:'받아올림·받아내림 있음'}]);
const draw=(random,min,max)=>Math.floor(Math.min(0.999999999,Math.max(0,Number(random())||0))*(max-min+1))+min;
const range=digits=>digits===1?[1,9]:[10**(digits-1),10**digits-1];
export function hasCarry(a,b){
 while(a>0||b>0){if(a%10+b%10>=10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}
 return false;
}
export function hasBorrow(a,b){
 while(a>0||b>0){if(a%10<b%10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}
 return false;
}
export function createQuestion(operation='add',random=Math.random,options={}){
 if(!OPERATIONS.some(op=>op.id===operation))throw new RangeError('지원하지 않는 연산');
 const {digits=1,condition='any'}=options;
 if(!DIGITS.includes(digits))throw new RangeError('지원하지 않는 자릿수');
 if(!CONDITIONS.some(c=>c.id===condition))throw new RangeError('지원하지 않는 계산 조건');
 if(!['add','subtract'].includes(operation)&&condition!=='any')throw new RangeError('곱셈·나눗셈은 계산 조건을 지원하지 않음');
 if(operation==='subtract'&&digits===1&&condition==='with')throw new RangeError('한 자리 뺄셈에 받아내림은 없음');
 const [min,max]=range(digits);
 let a,b,left,right,answer,symbol;
 if(operation==='add'||operation==='subtract'){
  const needs=condition==='with';
  let found=false;
  for(let i=0;i<100;i++){
   a=draw(random,min,max);b=draw(random,min,max);
   if(operation==='subtract'&&a<b)[a,b]=[b,a];
   const special=operation==='add'?hasCarry(a,b):hasBorrow(a,b);
   if(condition==='any'||special===needs){found=true;break}
  }
  if(!found){
   const fallback={
    add:{1:{with:[8,7],without:[2,3]},2:{with:[58,27],without:[21,32]},3:{with:[158,267],without:[121,232]}},
    subtract:{1:{without:[8,3]},2:{with:[52,18],without:[75,23]},3:{with:[352,178],without:[875,321]}}
   };
   [a,b]=fallback[operation][digits][condition];
  }
  left=a;right=b;
  answer=operation==='add'?a+b:a-b;
  symbol=operation==='add'?'+':'−';
 }else if(operation==='multiply'){
  a=draw(random,min,max);b=draw(random,1,9);
  left=a;right=b;answer=a*b;symbol='×';
 }else{
  a=draw(random,min,max);b=draw(random,1,9);
  left=a*b;right=b;answer=a;symbol='÷';
 }
 return {id:'natural.'+operation+'.'+digits+'.'+condition,operation,digits,condition,
  text:`${left} ${symbol} ${right} = ?`,answer};
}
export function createAdditionQuestion(random=Math.random){return createQuestion('add',random)}
export function gradeAnswer(question,raw){
 const input=String(raw).trim();
 return input!==''&&/^-?\d+$/.test(input)&&Number(input)===question.answer;
}
