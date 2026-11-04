import {AREAS,TOTAL_TYPES} from './catalog.js';
import {createAdditionQuestion,gradeAnswer} from './engine.js';
import {normalizeRoute,ROUTES} from './navigation.js';
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
function renderRoute(){
  const route=normalizeRoute(location.hash);
  for(const name of ROUTES){
    $('view-'+name).hidden=name!==route;
    const link=document.querySelector('[data-route="'+name+'"]');
    if(name===route)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  $('site-nav').classList.remove('open');
  $('menu-toggle').setAttribute('aria-expanded','false');
  document.title=({home:'연산런',practice:'연산 훈련',history:'학습 기록'})[route]+' | 연산런';
}
window.addEventListener('hashchange',renderRoute);
document.querySelectorAll('[data-route]').forEach(link=>{
  link.addEventListener('click',()=>{
    const route=link.dataset.route;
    if(normalizeRoute('#'+route)!==route)return;
    // 즉시 화면 전환. hashchange 이벤트는 뒤따르는 동기화 경로로 유지.
    queueMicrotask(renderRoute);
  });
});
document.querySelector('.brand').addEventListener('click',()=>queueMicrotask(renderRoute));
$('menu-toggle').addEventListener('click',()=>{
  const open=$('site-nav').classList.toggle('open');
  $('menu-toggle').setAttribute('aria-expanded',String(open));
});
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
function startPractice(){
  answered=0;correct=0;
  $('practice-session').hidden=false;
  $('begin-practice').hidden=true;
  $('score').textContent=`현재 점수: 0/0 · 전체 ${TOTAL_TYPES}개 유형 중 체험 1개`;
  nextQuestion();
}
$('start').addEventListener('click',()=>{
  location.hash='practice';
  renderRoute();
  startPractice();
});
$('begin-practice').addEventListener('click',startPractice);
$('history-to-practice').addEventListener('click',()=>{location.hash='practice';renderRoute()});
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
renderRoute();
