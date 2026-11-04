import {AREAS,TOTAL_TYPES} from './catalog.js';
import {createAdditionQuestion,gradeAnswer} from './engine.js';
const $=id=>document.getElementById(id);
$('areas').replaceChildren(...AREAS.map(area=>{
  const item=document.createElement('div');
  item.className='area';
  const name=document.createElement('strong');
  name.textContent=area.name;
  const count=document.createElement('small');
  count.textContent=`${area.count}개 핵심 유형 · 순차 개발`;
  item.append(name,count);
  return item;
}));
let question=null,answered=0,correct=0,locked=false;
function nextQuestion(){
  question=createAdditionQuestion();
  locked=false;
  $('question').textContent=question.text;
  $('answer').value='';
  $('feedback').textContent='';
  $('answer-form').hidden=false;
  $('next').hidden=true;
  $('answer').focus();
}
$('start').addEventListener('click',()=>{
  $('practice').hidden=false;
  $('practice').scrollIntoView({behavior:'smooth',block:'start'});
  answered=0;correct=0;
  $('score').textContent=`현재 점수: 0/0 · 전체 ${TOTAL_TYPES}개 유형 중 체험 1개`;
  nextQuestion();
});
$('answer-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(locked)return;
  locked=true;
  const ok=gradeAnswer(question,$('answer').value);
  answered++;
  if(ok)correct++;
  $('feedback').textContent=ok?'정답입니다!':`정답은 ${question.answer}입니다.`;
  $('score').textContent=`현재 점수: ${correct}/${answered}`;
  $('answer-form').hidden=true;
  $('next').hidden=false;
});
$('next').addEventListener('click',nextQuestion);
