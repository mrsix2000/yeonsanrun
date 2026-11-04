// 012-014: Standalone curriculum generators. Pure functions; no browser or DB dependencies.
import {getContentType} from './catalog.js?v=010-1';
const pick=(random,min,max)=>min+Math.floor(Math.max(0,Math.min(.999999999,Number(random())||0))*(max-min+1));
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fraction=(a,b)=>{if(b===0)throw new RangeError('zero denominator');const sign=b<0?-1:1,d=gcd(a,b);return (a*sign/d)+'/'+(Math.abs(b)/d)};
const decimal=(n,scale=10)=>(n/scale).toFixed(Math.log10(scale));
const available=Object.freeze([
 'fraction.concept','fraction.add-same','fraction.subtract-same','fraction.add-different','fraction.multiply','fraction.divide',
 'decimal.add','decimal.subtract','decimal.multiply','decimal.divide',
 'signed.integer-add','signed.integer-subtract','signed.integer-multiply','signed.integer-divide',
 'powers.integer-powers','powers.square-roots','algebra.substitution','algebra.linear-terms','equations.linear',
 'factoring.distribution'
]);
export const EXTENDED_TYPE_IDS=available;
export function createCurriculumQuestion(typeId,random=Math.random){
 if(!getContentType(typeId)||!available.includes(typeId))throw new RangeError('구현되지 않은 연산 유형');
 let a=pick(random,2,9),b=pick(random,2,9),c=pick(random,2,9),text,answer;
 switch(typeId){
 case 'fraction.concept':text=`다음 중 더 큰 분수는? ${a}/${a+1} 또는 ${b}/${b+1} (분수로 입력)`;answer=a>=b?fraction(a,a+1):fraction(b,b+1);break;
 case 'fraction.add-same':text=`${a}/${c} + ${b}/${c} = ?`;answer=fraction(a+b,c);break;
 case 'fraction.subtract-same':text=`${a+b}/${c} − ${b}/${c} = ?`;answer=fraction(a,c);break;
 case 'fraction.add-different':text=`${a}/${b} + ${c}/${a} = ?`;answer=fraction(a*a+b*c,a*b);break;
 case 'fraction.multiply':text=`${a}/${b} × ${c}/${a+1} = ?`;answer=fraction(a*c,b*(a+1));break;
 case 'fraction.divide':text=`${a}/${b} ÷ ${c}/${a+1} = ?`;answer=fraction(a*(a+1),b*c);break;
 case 'decimal.add':text=`${decimal(a)} + ${decimal(b)} = ?`;answer=decimal(a+b);break;
 case 'decimal.subtract':text=`${decimal(a+b)} − ${decimal(b)} = ?`;answer=decimal(a);break;
 case 'decimal.multiply':text=`${decimal(a)} × ${decimal(b)} = ?`;answer=decimal(a*b,100);break;
 case 'decimal.divide':text=`${decimal(a*b,100)} ÷ ${decimal(b)} = ?`;answer=decimal(a);break;
 case 'signed.integer-add':text=`(-${a}) + ${b} = ?`;answer=String(b-a);break;
 case 'signed.integer-subtract':text=`(-${a}) − ${b} = ?`;answer=String(-a-b);break;
 case 'signed.integer-multiply':text=`(-${a}) × ${b} = ?`;answer=String(-a*b);break;
 case 'signed.integer-divide':text=`(-${a*b}) ÷ ${b} = ?`;answer=String(-a);break;
 case 'powers.integer-powers':text=`${a}² = ?`;answer=String(a*a);break;
 case 'powers.square-roots':text=`√${a*a} = ? (양의 제곱근)`;answer=String(a);break;
 case 'algebra.substitution':text=`x=${a}일 때 ${b}x+${c} = ?`;answer=String(a*b+c);break;
 case 'algebra.linear-terms':text=`(${a}x+${b})+(${c}x+${a})에서 x의 계수는?`;answer=String(a+c);break;
 case 'equations.linear':text=`${a}x+${b}=${a*c+b}, x = ?`;answer=String(c);break;
 case 'factoring.distribution':text=`${a}(x+${b})에서 상수항은?`;answer=String(a*b);break;
 }
 return {id:typeId,typeId,text,answer};
}
export function gradeCurriculumAnswer(question,raw){
 const value=String(raw).trim().replace(/\s+/g,'');
 if(!value)return false;
 const expected=String(question.answer);
 if(expected.includes('/')){
  const m=value.match(/^(-?\d+)\/(-?\d+)$/);
  if(!m||Number(m[2])===0)return false;
  return fraction(Number(m[1]),Number(m[2]))===expected;
 }
 if(!/^-?(?:\d+\.?\d*|\.\d+)$/.test(value))return false;
 return Number(value)===Number(expected);
}
