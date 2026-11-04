import {STUDY_MODES,selectStudyTypes,diagnosticSummary} from './study-modes.js?v=010-1';
import {availableTypes,createTypedQuestion,gradeTypedAnswer,isValidAnswerInput} from './typed-engine.js?v=010-1';
import {AREAS,TOTAL_TYPES} from './catalog.js?v=010-1';
import {OPERATIONS,DIGITS,createQuestion,gradeAnswer} from './engine.js?v=010-1';
import {SESSION_SIZE,createSession,recordAttempt,summarizeSession} from './session.js?v=010-1';
import {isAuthConfigured,validateCredentials,signUp,signIn,signOut,currentSession,subscribeAuthChange} from './auth.js?v=010-1';
import {GRADES,gradeLabel,loadStudentProfile,saveStudentProfile} from './profile.js?v=010-1';
import {validateChildAlias,validateInviteCode,createFamilyInvite,redeemFamilyInvite,loadFamilyLinks} from './family.js?v=010-1';
import {getAuthClient} from './auth.js?v=010-1';
import {accountCapabilities,sessionIdentity} from './access.js?v=010-1';
import {normalizeRoute,ROUTES} from './navigation.js?v=010-1';
import {changeAccountEmail,changeAccountPassword,ACCOUNT_DELETION_STATUS} from './account.js?v=010-1';
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
  document.title=({home:'연산런',practice:'연산 훈련',history:'학습 기록',auth:'회원가입·로그인'})[route]+' | 연산런';
}
window.addEventListener('hashchange',renderRoute);
document.querySelectorAll('[data-route]').forEach(link=>link.addEventListener('click',()=>queueMicrotask(renderRoute)));
document.querySelector('.brand').addEventListener('click',()=>queueMicrotask(renderRoute));
$('menu-toggle').addEventListener('click',()=>{
  const open=$('site-nav').classList.toggle('open');
  $('menu-toggle').setAttribute('aria-expanded',String(open));
});
let operation='add',digits=1,condition='any',question=null,session=createSession(),locked=false,selectedType='natural.add',questionStartedAt=0,studyMode='free',modeTypes=[],recentAttempts=[];
const operationButtons=OPERATIONS.map(op=>{
  const button=document.createElement('button');
  button.type='button';button.className='operation-button secondary';button.textContent=op.label;
  button.dataset.operation=op.id;
  button.addEventListener('click',()=>selectOperation(op.id));
  return button;
});
$('operation-options').replaceChildren(...operationButtons);
function selectOperation(id){
  operation=id;selectedType='natural.'+id;
  if($('curriculum-type'))$('curriculum-type').value=selectedType;
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
 const nextType=studyMode==='diagnostic'?modeTypes[session.attempts.length]:selectedType;
 question=createTypedQuestion(nextType,Math.random,{digits,condition:nextType.startsWith('natural.')?condition:'any'});
 questionStartedAt=performance.now();
 locked=false;$('question').textContent=question.text;
 $('answer').value='';$('answer').focus();
}
function showResult(){
 const result=summarizeSession(session);
 $('question-panel').hidden=true;$('result-panel').hidden=false;
 $('result-score').textContent=result.correct+' / '+SESSION_SIZE+'문제 정답 · 정답률 '+result.accuracy+'%';
 recentAttempts.push(...session.attempts);
 $('mode-summary').textContent=studyMode==='diagnostic'?'진단 결과 · 취약 유형: '+(diagnosticSummary(session.attempts).weakTypes.join(', ')||'없음'):'풀이 시간: '+(result.totalDurationMs/1000).toFixed(1)+'초';
 const list=$('mistake-list');list.replaceChildren();
 if(!result.mistakes.length){const item=document.createElement('li');item.textContent='모두 정답입니다!';list.append(item)}
 else for(const mistake of result.mistakes){
  const item=document.createElement('li');
  item.textContent=mistake.text+' 내 답: '+mistake.input+' / 정답: '+mistake.answer;
  list.append(item);
 }
}
function startPractice(){
 modeTypes=selectStudyTypes(studyMode,recentAttempts);
 if(studyMode!=='free'&&studyMode!=='diagnostic'){
  selectedType=modeTypes[0];
  $('curriculum-type').value=selectedType;
  $('natural-controls').hidden=!selectedType.startsWith('natural.');
  $('selected-operation').textContent=availableTypes().find(t=>t.id===selectedType).name+' 훈련';
 }
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
 if(!isValidAnswerInput(question.typeId,input)){$('answer').focus();return}
 locked=true;
 const ok=gradeTypedAnswer(question,input);
 const durationMs=Math.max(0,Math.round(performance.now()-questionStartedAt));
 session=recordAttempt(session,{...question,durationMs},input,ok);
 renderProgress();
 if(session.complete)showResult();else nextQuestion();
});
$('repeat-five').addEventListener('click',startPractice);
selectOperation('add');selectDigits(1);
const typeSelect=$('curriculum-type');
typeSelect.replaceChildren(...availableTypes().map(type=>new Option(type.name+' ('+type.grade+')',type.id)));
typeSelect.value=selectedType;
typeSelect.addEventListener('change',()=>{
 selectedType=typeSelect.value;
 const natural=selectedType.startsWith('natural.');
 $('natural-controls').hidden=!natural;
 if(natural){selectOperation(selectedType.slice(8));}
 else{$('selected-operation').textContent=availableTypes().find(type=>type.id===selectedType).name+' 훈련';resetSelection();}
});
const studyModeSelect=$('study-mode');
studyModeSelect.replaceChildren(...STUDY_MODES.map(mode=>new Option(mode.name,mode.id)));
studyModeSelect.addEventListener('change',()=>{
 studyMode=studyModeSelect.value;
 $('curriculum-type').disabled=studyMode!=='free';
 $('mode-help').textContent=({
 free:'유형을 직접 선택해 반복 훈련합니다.',
 diagnostic:'자연수 사칙연산과 분수의 대표 유형을 한 문제씩 풉니다. 간이 진단입니다.',
 weak:'이 브라우저에서 틀린 비율이 높은 유형을 반복합니다. 기록이 없으면 자연수 덧셈으로 시작합니다.',
 daily:'오늘 날짜를 기준으로 모든 사용자에게 같은 유형을 제안합니다. 문제 자체는 무작위입니다.',
 recommended:'이 브라우저의 최근 풀이를 바탕으로 유형을 추천합니다. 기록이 없으면 덧셈부터 시작합니다.'
 })[studyMode];
 resetSelection();
});
studyModeSelect.dispatchEvent(new Event('change'));
renderRoute();

let authMode='login',authBusy=false;
function setAuthMode(mode){
 authMode=mode;
 $('auth-heading').textContent=mode==='login'?'로그인':'회원가입';
 $('auth-submit').textContent=mode==='login'?'로그인':'회원가입';
 $('auth-password').autocomplete=mode==='login'?'current-password':'new-password';
 for(const [id,value] of [['auth-login-tab','login'],['auth-signup-tab','signup']]){
  const active=value===mode;
  $(id).classList.toggle('secondary',!active);
  $(id).setAttribute('aria-pressed',String(active));
 }
 $('auth-message').textContent='';
}
let profileUserId=null,profileRequestId=0,hasStudentProfile=false,hasLinkedChildren=false;
function updateAccessUI(){
 const access=accountCapabilities({userId:profileUserId,hasStudentProfile,hasLinkedChildren});
 $('family-generate').hidden=!access.canIssueStudentCode;
 $('family-role-message').textContent=!access.signedIn?'':access.canIssueStudentCode?'학생 연결 코드를 발급할 수 있습니다.':'학생 연결 코드 발급은 학년 저장 후 가능합니다.';
 $('account-access-status').textContent=!access.signedIn?'로그인이 필요합니다.':(access.canIssueStudentCode?'학생 기능 사용 가능 · ':'학생 학년 미설정 · ')+(access.canViewLinkedChildren?'연결된 자녀 조회 가능':'연결된 자녀 없음');
}

async function refreshProfile(session){
 const requestId=++profileRequestId;
 profileUserId=sessionIdentity(session);
 hasStudentProfile=false;updateAccessUI();
 $('profile-grade').value='';
 $('profile-message').textContent=profileUserId?'학년 정보를 불러오는 중입니다.':'';
 if(!profileUserId)return;
 try{
  const client=await getAuthClient();
  const grade=await loadStudentProfile(client,profileUserId);
  if(requestId!==profileRequestId)return;
  $('profile-grade').value=grade;
  hasStudentProfile=!!grade;updateAccessUI();
  $('profile-message').textContent=grade?'저장된 학년: '+gradeLabel(grade):'학년이 아직 설정되지 않았습니다.';
 }catch(error){if(requestId===profileRequestId)$('profile-message').textContent='학년 조회 실패: '+(error.message||'다시 시도해 주세요.');}
}
function displaySession(session){
 const loggedIn=!!session?.user?.id;
 $('auth-member').hidden=!loggedIn;
 $('profile-section').hidden=!loggedIn;
 $('family-section').hidden=!loggedIn;
 $('account-settings').hidden=!loggedIn;
 if(!loggedIn){$('account-email').value='';$('account-new-password').value='';$('account-confirm-password').value='';$('account-settings-message').textContent='';}
 else if($('account-email').dataset.userId!==session.user.id){$('account-email').value=session.user.email||'';$('account-email').dataset.userId=session.user.id;}
 if(!loggedIn)$('account-email').dataset.userId='';
 if(!loggedIn){$('family-alias').value='';$('family-code').value='';$('family-message').textContent='';$('family-links').replaceChildren();hasLinkedChildren=false;hasStudentProfile=false;updateAccessUI();}
 if((session?.user?.id||null)!==profileUserId){refreshProfile(session);if(loggedIn)refreshFamily();}
 $('auth-guest').hidden=loggedIn;
 $('auth-user-email').textContent=loggedIn?session.user.email||'이메일 확인 중':'';
 document.querySelector('[data-route="auth"]').textContent=loggedIn?'내 계정':'로그인';
}
function authErrorMessage(error){
 if(error?.message==='Invalid login credentials')return '이메일 또는 비밀번호를 확인해 주세요.';
 if(error?.message==='Email not confirmed')return '이메일 인증을 완료해 주세요.';
 if(error?.message==='User already registered')return '이미 가입된 이메일입니다.';
 return error?.message||'인증 처리 중 오류가 발생했습니다.';
}
$('auth-login-tab').addEventListener('click',()=>setAuthMode('login'));
$('auth-signup-tab').addEventListener('click',()=>setAuthMode('signup'));
$('auth-form').addEventListener('submit',async event=>{
 event.preventDefault();if(authBusy)return;
 const email=$('auth-email').value.trim(),password=$('auth-password').value;
 const validation=validateCredentials(email,password);
 if(validation){$('auth-message').textContent=validation;return}
 authBusy=true;$('auth-submit').disabled=true;$('auth-message').textContent='처리 중입니다.';
 try{
  const data=authMode==='login'?await signIn(email,password):await signUp(email,password);
  displaySession(data.session||null);
  $('auth-message').textContent=authMode==='signup'&&!data.session?'가입 요청이 접수되었습니다. 이메일 인증이 설정되어 있다면 메일을 확인해 주세요.':'정상 처리되었습니다.';
  $('auth-password').value='';
 }catch(error){$('auth-message').textContent=authErrorMessage(error)}
 finally{authBusy=false;$('auth-submit').disabled=false}
});
$('auth-logout').addEventListener('click',async()=>{
 if(authBusy)return;authBusy=true;$('auth-logout').disabled=true;
 try{await signOut();displaySession(null);$('auth-message').textContent='로그아웃되었습니다.'}
 catch(error){$('auth-message').textContent=authErrorMessage(error)}
 finally{authBusy=false;$('auth-logout').disabled=false}
});
$('account-deletion-status').textContent=ACCOUNT_DELETION_STATUS;
let accountBusy=false;
$('account-email-form').addEventListener('submit',async event=>{
 event.preventDefault();if(accountBusy||!profileUserId)return;
 const userId=profileUserId,email=$('account-email').value.trim(),button=$('account-email-submit');
 accountBusy=true;button.disabled=true;$('account-settings-message').textContent='이메일 변경 요청 중입니다.';
 try{
  await changeAccountEmail(await getAuthClient(),email);
  if(profileUserId===userId)$('account-settings-message').textContent='이메일 변경 요청을 접수했습니다. 이메일 확인 안내가 도착하면 인증해 주세요.';
 }catch(error){if(profileUserId===userId)$('account-settings-message').textContent='이메일 변경 실패: '+(error.message||'다시 시도해 주세요.');}
 finally{accountBusy=false;button.disabled=false;}
});
$('account-password-form').addEventListener('submit',async event=>{
 event.preventDefault();if(accountBusy||!profileUserId)return;
 const userId=profileUserId,password=$('account-new-password').value,confirm=$('account-confirm-password').value,button=$('account-password-submit');
 accountBusy=true;button.disabled=true;$('account-settings-message').textContent='비밀번호 변경 중입니다.';
 try{
  await changeAccountPassword(await getAuthClient(),password,confirm);
  if(profileUserId===userId)$('account-settings-message').textContent='비밀번호 변경이 완료되었습니다.';
 }catch(error){if(profileUserId===userId)$('account-settings-message').textContent='비밀번호 변경 실패: '+(error.message||'다시 시도해 주세요.');}
 finally{$('account-new-password').value='';$('account-confirm-password').value='';accountBusy=false;button.disabled=false;}
});
$('profile-grade').replaceChildren(...[new Option('학년을 선택해 주세요',''),...GRADES.map(g=>new Option(g.label,g.value))]);
$('profile-preview').addEventListener('click',async()=>{
 const grade=$('profile-grade').value;
 if(!grade){$('profile-message').textContent='학년을 먼저 선택해 주세요.';return;}
 if(!profileUserId){$('profile-message').textContent='로그인이 필요합니다.';return;}
 const userId=profileUserId,button=$('profile-preview');
 button.disabled=true;$('profile-message').textContent='저장 중입니다.';
 try{
  const client=await getAuthClient();
  const saved=await saveStudentProfile(client,userId,grade);
  if(profileUserId===userId){hasStudentProfile=true;updateAccessUI();$('profile-message').textContent='저장 완료: '+gradeLabel(saved);}
 }catch(error){if(profileUserId===userId)$('profile-message').textContent='저장 실패: '+(error.message||'다시 시도해 주세요.');}
 finally{button.disabled=false;}
});
let familyBusy=false;
async function refreshFamily(){
 if(!profileUserId)return;
 const userId=profileUserId;
 try{
  const links=await loadFamilyLinks(await getAuthClient(),userId);
  if(profileUserId!==userId)return;
  hasLinkedChildren=links.length>0;updateAccessUI();
  const list=$('family-links');list.replaceChildren();
  for(const link of links){const item=document.createElement('li');item.textContent=link.child_alias+' · 연결됨';list.append(item);}
  if(!links.length){const item=document.createElement('li');item.textContent='연결된 자녀가 없습니다.';list.append(item);}
 }catch(error){if(profileUserId===userId)$('family-message').textContent='목록 조회 실패: '+error.message;}
}
$('family-generate').addEventListener('click',async()=>{
 if(familyBusy||!accountCapabilities({userId:profileUserId,hasStudentProfile}).canIssueStudentCode)return;
 familyBusy=true;$('family-generate').disabled=true;
 try{const code=await createFamilyInvite(await getAuthClient());$('family-message').textContent='학생 연결 코드 (10분 유효): '+code+' · 이 코드를 학부모에게 안전하게 전달하세요.';}
 catch(error){$('family-message').textContent='코드 발급 실패: '+error.message;}
 finally{familyBusy=false;$('family-generate').disabled=false;}
});
$('family-preview').addEventListener('click',async()=>{
 if(familyBusy||!profileUserId)return;
 const alias=$('family-alias').value,code=$('family-code').value.trim();
 const validation=validateChildAlias(alias)||validateInviteCode(code);
 if(validation){$('family-message').textContent=validation;return;}
 familyBusy=true;$('family-preview').disabled=true;
 try{await redeemFamilyInvite(await getAuthClient(),code,alias);$('family-code').value='';$('family-message').textContent='자녀 연결이 완료되었습니다.';await refreshFamily();}
 catch(error){$('family-message').textContent='자녀 연결 실패: '+error.message;}
 finally{familyBusy=false;$('family-preview').disabled=false;}
});
setAuthMode('login');
if(!isAuthConfigured()){
 $('auth-config-message').textContent='현재 테스트 환경은 Supabase 인증 연결 설정 전입니다. 계정 생성과 로그인은 아직 사용할 수 없습니다.';
 $('auth-submit').disabled=true;
}else{
 currentSession().then(displaySession).catch(error=>{$('auth-message').textContent=authErrorMessage(error)});
 subscribeAuthChange(displaySession).catch(error=>{$('auth-message').textContent=authErrorMessage(error)});
}
