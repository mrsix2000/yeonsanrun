// 011: Stable curriculum identifiers. Availability is separate from implemented generators.
export const GRADE_CODES=Object.freeze(['E1','E2','E3','E4','E5','E6','M1','M2','M3']);
const specs=[
 ['natural','자연수 연산',[
 ['add','덧셈','E1'],['subtract','뺄셈','E1'],['multiply','곱셈','E2'],['divide','나눗셈','E3'],['mixed','자연수 혼합 계산','E4']]],
 ['fraction','분수 연산',[
 ['concept','분수의 크기와 동치','E3'],['add-same','동분모 덧셈','E4'],['subtract-same','동분모 뺄셈','E4'],['add-different','이분모 덧셈·뺄셈','E5'],['multiply','분수 곱셈','E5'],['divide','분수 나눗셈','E6']]],
 ['decimal','소수 연산',[
 ['add','소수 덧셈','E4'],['subtract','소수 뺄셈','E4'],['multiply','소수 곱셈','E5'],['divide','소수 나눗셈','E6']]],
 ['signed','음수·유리수',[
 ['integer-add','정수 덧셈','M1'],['integer-subtract','정수 뺄셈','M1'],['integer-multiply','정수 곱셈','M1'],['integer-divide','정수 나눗셈','M1'],['rational-mixed','유리수 혼합 계산','M1']]],
 ['powers','거듭제곱·제곱근',[
 ['integer-powers','거듭제곱','M1'],['power-rules','지수법칙','M2'],['square-roots','제곱근','M3'],['radical-operations','근호 연산','M3']]],
 ['algebra','문자식 연산',[
 ['substitution','문자식의 값','M1'],['linear-terms','일차식의 덧셈·뺄셈','M1'],['monomial','단항식의 곱셈·나눗셈','M2'],['polynomial','다항식의 연산','M2']]],
 ['equations','방정식',[
 ['linear','일차방정식','M1'],['simultaneous','연립일차방정식','M2'],['quadratic','이차방정식','M3']]],
 ['factoring','전개·인수분해',[
 ['distribution','분배법칙과 전개','M1'],['identities','곱셈 공식','M3'],['common-factor','공통인수 묶기','M3'],['quadratic-factor','이차식 인수분해','M3']]]
];
const DEPENDENCIES=Object.freeze({
 'natural.subtract':['natural.add'],'natural.multiply':['natural.add'],'natural.divide':['natural.multiply'],'natural.mixed':['natural.add','natural.subtract','natural.multiply','natural.divide'],
 'fraction.add-same':['fraction.concept'],'fraction.subtract-same':['fraction.add-same'],'fraction.add-different':['fraction.add-same','fraction.subtract-same'],'fraction.multiply':['fraction.concept'],'fraction.divide':['fraction.multiply'],
 'decimal.subtract':['decimal.add'],'decimal.multiply':['decimal.add'],'decimal.divide':['decimal.multiply'],
 'signed.integer-subtract':['signed.integer-add'],'signed.integer-multiply':['signed.integer-add'],'signed.integer-divide':['signed.integer-multiply'],'signed.rational-mixed':['signed.integer-divide'],
 'powers.power-rules':['powers.integer-powers'],'powers.radical-operations':['powers.square-roots'],
 'algebra.linear-terms':['algebra.substitution'],'algebra.monomial':['algebra.linear-terms'],'algebra.polynomial':['algebra.monomial'],
 'equations.simultaneous':['equations.linear'],'equations.quadratic':['equations.linear'],
 'factoring.identities':['factoring.distribution'],'factoring.common-factor':['factoring.distribution'],'factoring.quadratic-factor':['factoring.identities']
});
const EXTENDED_AVAILABLE=new Set(['fraction.concept','fraction.add-same','fraction.subtract-same','fraction.add-different','fraction.multiply','fraction.divide','decimal.add','decimal.subtract','decimal.multiply','decimal.divide','signed.integer-add','signed.integer-subtract','signed.integer-multiply','signed.integer-divide','powers.integer-powers','powers.square-roots','algebra.substitution','algebra.linear-terms','equations.linear','factoring.distribution']);
export const AREAS=Object.freeze(specs.map(([id,name,types])=>Object.freeze({id,name,count:types.length})));
export const CONTENT_TYPES=Object.freeze(specs.flatMap(([areaId,,types])=>types.map(([key,name,grade],index)=>Object.freeze({
 id:areaId+'.'+key,areaId,name,grade,gradeIndex:GRADE_CODES.indexOf(grade),
 order:index+1,level:Math.min(3,index+1),prerequisites:Object.freeze(DEPENDENCIES[areaId+'.'+key]||[]),
 generator:areaId==='natural'&&['add','subtract','multiply','divide'].includes(key)?'natural.'+key:null,
 status:(areaId==='natural'&&['add','subtract','multiply','divide'].includes(key))||EXTENDED_AVAILABLE.has(areaId+'.'+key)?'available':'planned'
}))));
export const TOTAL_TYPES=CONTENT_TYPES.length;
export function getContentType(id){return CONTENT_TYPES.find(type=>type.id===id)||null}
export function getTypesForGrade(grade,{includePlanned=true}={}){
 const gradeIndex=GRADE_CODES.indexOf(grade);
 if(gradeIndex<0)throw new RangeError('지원하지 않는 학년');
 return CONTENT_TYPES.filter(type=>type.gradeIndex<=gradeIndex&&(includePlanned||type.status==='available'));
}
export function validateCatalog(){
 const ids=new Set();
 for(const type of CONTENT_TYPES){
  if(ids.has(type.id)||!AREAS.some(a=>a.id===type.areaId)||type.gradeIndex<0)throw new Error('콘텐츠 카탈로그 무결성 오류');
  ids.add(type.id);
  if(type.prerequisites.some(id=>!CONTENT_TYPES.some(other=>other.id===id)))throw new Error('존재하지 않는 선행 유형');
 }
 return true;
}
