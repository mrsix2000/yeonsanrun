// 007: 학년 모델. DB 적용 전에는 저장하지 않습니다.
export const GRADES=Object.freeze([
  ...Array.from({length:6},(_,i)=>({value:'E'+(i+1),label:'초등학교 '+(i+1)+'학년'})),
  ...Array.from({length:3},(_,i)=>({value:'M'+(i+1),label:'중학교 '+(i+1)+'학년'}))
]);
export function isValidGrade(value){return GRADES.some(grade=>grade.value===value)}
export function gradeLabel(value){return GRADES.find(grade=>grade.value===value)?.label||'학년 미설정'}
