import {AREAS,TOTAL_TYPES} from './catalog.js?v=004-fix1';
import {OPERATIONS,DIGITS,createQuestion,gradeAnswer} from './engine.js?v=004-fix1';
import {normalizeRoute,ROUTES} from './navigation.js?v=004-fix1';
const $=id=>document.getElementById(id);
$('areas').replaceChildren(...AREAS.map(area=>{
  const item=document.createElement('div');item.className='area';
  const name=document.createElement('strong');name.textContent=area.name;
  const count=document.createElement('small');count.textContent=`${area.count}개 핵심 유형 · 순차 개발`;
  item.append(name,count);return item;
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
document.querySelectorAll('[data-route]').forEach(link=>link.addEventListener('click',()=>queueMicrotask(renderRoute)));
document.querySelector('.brand').addEventListener('click',()=>queueMicrotask(renderRoute));
$('menu-toggle').addEventListener('click',()=>{
  const open=$('site-nav').classList.toggle('open');
  $('menu-toggle').setAttribute('aria-expanded',String(open));
});
let operation='add',digits=1,condition='any',question=null,answered=0,correct=0,locked=false;
const operationButtons=OPERATIONS.map(op=>{
  const button=document.createElement('button');
  button.type='button';button.className='operation-button secondary';button.textContent=op.label;
  button.dataset.operation=op.id;
  button.addEventListener('click',()=>selectOperation(op.id));
  return button;
});
$('operation-options').replaceChildren(...operationButtons);
function selectOperation(id){
  operation=id;
  for(const button of operationButtons){
    const active=button.dataset.operation===id;
    button.classList.toggle('selected',active);
    button.setAttribute('aria-pressed',String(active));
  }
  $('selected-operation').textContent=OPERATIONS.find(op=>op.id===id).label+' 훈련';
  resetSelection();
  updateConditionControls();
}
function resetSelection(){
  $('practice-session').hidden=true;
  $('begin-practice').hidden=false;
  question=null;answered=0;correct=0;locked=false;
}
const digitButtons=DIGITS.map(value=>{
 const button=document.createElement('button');button.type='button';button.className='digit-button secondary';
 button.textContent=value+'자리';button.dataset.digits=String(value);
 button.addEventListener('click',()=>selectDigits(value));return button;
});
$('digit-options').replaceChildren(...digitButtons);
function selectDigits(value){
 digits=value;
 for(const button of digitButtons){const active=Number(button.dataset.digits)===value;
  button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));}
 resetSelection();updateConditionControls();
}
function updateConditionControls(){
 const supported=operation==='add'||operation==='subtract';
 const withAllowed=supported&&!(operation==='subtract'&&digits===1);
 $('condition-controls').hidden=!supported;
 $('condition-with').disabled=!withAllowed;
 if(!supported||(condition==='with'&&!withAllowed))condition='any';
 for(const button of document.querySelectorAll('[data-condition]')){
  const active=button.dataset.condition===condition;
  button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));
 }
}
for(const button of document.querySelectorAll('[data-condition]')){
 button.addEventListener('click',()=>{condition=button.dataset.condition;updateConditionControls();resetSelection()});
}

function nextQuestion(){
  question=createQuestion(operation,Math.random,{digits,condition});locked=false;
  $('question').textContent=question.text;
  $('answer').value='';$('feedback').textContent='';
  $('answer-form').hidden=false;$('next').hidden=true;$('answer').focus();
}
function startPractice(){
  answered=0;correct=0;
  $('practice-session').hidden=false;$('begin-practice').hidden=true;
  $('score').textContent=`현재 점수: 0/0 · 전체 ${TOTAL_TYPES}개 유형 중 자연수 ${digits}자리 ${OPERATIONS.find(op=>op.id===operation).label} 체험`;
  nextQuestion();
}
$('start').addEventListener('click',()=>{
  location.hash='practice';renderRoute();selectOperation('add');selectDigits(1);startPractice();
});
$('begin-practice').addEventListener('click',startPractice);
$('history-to-practice').addEventListener('click',()=>{location.hash='practice';renderRoute()});
$('answer-form').addEventListener('submit',event=>{
  event.preventDefault();if(locked)return;locked=true;
  const ok=gradeAnswer(question,$('answer').value);answered++;if(ok)correct++;
  $('feedback').textContent=ok?'정답입니다!':`정답은 ${question.answer}입니다.`;
  $('score').textContent=`현재 점수: ${correct}/${answered}`;
  $('answer-form').hidden=true;$('next').hidden=false;
});
$('next').addEventListener('click',nextQuestion);
selectOperation('add');selectDigits(1);renderRoute();
