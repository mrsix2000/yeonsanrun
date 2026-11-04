// 순수 함수 기반 최소 문제 엔진. 정답은 화면 코드와 분리한다.
export function createAdditionQuestion(random=Math.random){
  const draw=()=>Math.floor(random()*9)+1;
  const a=draw(),b=draw();
  return {id:'natural.add.basic',text:`${a} + ${b} = ?`,answer:a+b};
}
export function gradeAnswer(question,raw){
  const input=String(raw).trim();
  return input!=='' && /^-?\d+$/.test(input) && Number(input)===question.answer;
}
