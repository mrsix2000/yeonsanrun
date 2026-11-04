import {AREAS,TOTAL_TYPES} from './catalog.js?v=005-2';
import {OPERATIONS,DIGITS,createQuestion,gradeAnswer} from './engine.js?v=005-2';
import {SESSION_SIZE,createSession,recordAttempt,summarizeSession} from './session.js?v=005-2';
import {normalizeRoute,ROUTES} from './navigation.js?v=005-2';
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
let operation='add',digits=1,condition='any',question=null,session=createSession(),locked=false;
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
 session=createSession();question=null;locked=false;
 $('practice-session').hidden=true;$('begin-practice').hidden=false;
 $('result-panel').hidden=true;$('question-panel').hidden=false;
 $('answer').value='';
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

function renderProgress(){
 const completed=session.attempts.length;
 $('progress-count').textContent=completed+' / '+SESSION_SIZE+'문제 완료';
 $('progress-fill').style.width=completed/SESSION_SIZE*100+'%';
 $('progress-track').setAttribute('aria-valuenow',String(completed));
}
function nextQuestion(){
 question=createQuestion(operation,Math.random,{digits,condition});
 locked=false;$('question').textContent=question.text;
 $('answer').value='';$('answer').focus();
}
function showResult(){
 const result=summarizeSession(session);
 $('question-panel').hidden=true;$('result-panel').hidden=false;
 $('result-score').textContent=result.correct+' / '+SESSION_SIZE+'문제 정답 · 정답률 '+result.accuracy+'%';
 const list=$('mistake-list');list.replaceChildren();
 if(!result.mistakes.length){const item=document.createElement('li');item.textContent='모두 정답입니다!';list.append(item)}
 else for(const mistake of result.mistakes){
  const item=document.createElement('li');
  item.textContent=mistake.text+' 내 답: '+mistake.input+' / 정답: '+mistake.answer;
  list.append(item);
 }
}
function startPractice(){
 session=createSession();locked=false;
 $('practice-session').hidden=false;$('begin-practice').hidden=true;
 $('result-panel').hidden=true;$('question-panel').hidden=false;
 renderProgress();nextQuestion();
}
$('start').addEventListener('click',()=>{
  location.hash='practice';renderRoute();selectOperation('add');selectDigits(1);startPractice();
});
$('begin-practice').addEventListener('click',startPractice);
$('history-to-practice').addEventListener('click',()=>{location.hash='practice';renderRoute()});
$('answer-form').addEventListener('submit',event=>{
 event.preventDefault();if(locked||!question||session.complete)return;
 const input=$('answer').value.trim();
 if(!/^-?\\d+$/.test(input)){$('answer').focus();return}
 locked=true;
 const ok=gradeAnswer(question,input);
 session=recordAttempt(session,question,input,ok);
 renderProgress();
 if(session.complete)showResult();else nextQuestion();
});
$('repeat-five').addEventListener('click',startPractice);
selectOperation('add');selectDigits(1);renderRoute();
