// Test-only parent report UI. All database reads use the test project.
import {loadLinkedChildReport} from './parent-report-server.js?v=010-1';
import {resetParentReportView} from './parent-report.js?v=010-2';
const URL='https://cjrvoamwejcpmhyejamn.supabase.co';
const KEY='sb_publishable_ti3tRCDlXvazkCMC6Xz1bQ_SfcGjbeM';
const $=id=>document.getElementById(id);
let client,user=null,revision=0,busy=false,recoveryReady=false;
function state(message){$('parent-state').textContent=message}
function controls(){
 $('parent-logout').disabled=!user||busy;
 $('parent-refresh').disabled=!user||busy;
 $('parent-recovery').hidden=!recoveryReady;
}
function reset(){
 revision++;resetParentReportView($('parent-children'),$('parent-summary'));
}
async function loadChildren(){
 if(!user)return;
 const id=user.id,token=revision;
 resetParentReportView($('parent-children'),$('parent-summary'));
 const {data,error}=await client.from('parent_report_grants').select('student_user_id,created_at').eq('parent_user_id',id).order('created_at',{ascending:false});
 if(error)throw error;
 if(token!==revision||user?.id!==id)return;
 if(!data?.length){const li=document.createElement('li');li.textContent='승인된 자녀 연결이 없습니다.';$('parent-children').append(li);state('자녀 연결 0건');return}
 for(const grant of data){
  const li=document.createElement('li'),button=document.createElement('button');
  button.type='button';button.textContent='자녀 '+grant.student_user_id.slice(0,8)+' 리포트 조회';
  button.addEventListener('click',()=>showReport(grant.student_user_id).catch(e=>state('조회 실패: '+e.message)));
  li.append(button);$('parent-children').append(li);
 }
 state('연결된 자녀 '+data.length+'명 조회 완료');
}
async function showReport(studentId){
 if(!user||busy)return;
 const id=user.id,token=revision;
 state('자녀 학습 기록 조회 중');
 const report=await loadLinkedChildReport(client,id,studentId);
 if(token!==revision||user?.id!==id)return;
 const summary=$('parent-summary');summary.replaceChildren();
 const lines=[
  '완료 학습 '+report.sessions+'회 (최근 조회 범위)',
  '총 '+report.questions+'문항 · 정답률 '+report.accuracy+'%',
  '평균 풀이 시간 '+report.averageSeconds+'초',
  '최근 7일 학습 '+report.weeklySessions+'회',
  '취약 유형: '+(report.weakTypes.length?report.weakTypes.map(x=>x.typeId+' '+x.accuracy+'%').join(', '):'없음')
 ];
 for(const line of lines){const p=document.createElement('p');p.textContent=line;summary.append(p)}
 state('자녀 리포트 조회 완료');
}
async function setUser(next){
 user=next;reset();controls();
 if(user){state('로그인 성공');await loadChildren()}else state('학부모 로그인 필요');
}
try{
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.10');
 client=createClient(URL,KEY,{auth:{persistSession:true,detectSessionInUrl:true}});

 // Subscribe before session initialization: recovery links may be consumed during getUser().
 client.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY'){
   recoveryReady=true;
   controls();
   state('이메일 링크 인증 성공. 새 테스트 비밀번호를 입력해 주세요.');
  }
  if(session?.user?.id!==user?.id)queueMicrotask(()=>setUser(session?.user||null).catch(e=>state(e.message)));
 });
 const recoveryLink=location.hash.includes('type=recovery')||location.search.includes('type=recovery');
 const {data,error}=await client.auth.getUser();
 if(error && !location.hash.includes('error='))state('세션 확인 실패: '+error.message);
 await setUser(data?.user||null);
 // A recovery link may have been processed before the page subscribed on older builds.
 // Only show the form when a recovery event was actually received; do not grant access from URL alone.
 if(recoveryReady){controls();state('이메일 링크 인증 성공. 새 테스트 비밀번호를 입력해 주세요.')}
 if(location.hash.includes('error=')){
  state('이 링크는 이미 사용되었거나 만료되었습니다. 새 메일을 반복 요청하지 마세요.');
  history.replaceState(null,'',location.pathname+location.search);
 }

}catch(e){state('연결 실패: '+e.message)}
$('parent-login').addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!client)return;
 busy=true;controls();
 try{const {data,error}=await client.auth.signInWithPassword({email:$('parent-email').value.trim(),password:$('parent-password').value});if(error)throw error;await setUser(data.user)}
 catch(e){state('로그인 실패: '+e.message)}finally{busy=false;controls()}
});
$('parent-logout').addEventListener('click',async()=>{
 if(busy||!client)return;busy=true;controls();
 try{const {error}=await client.auth.signOut();if(error)throw error;await setUser(null)}
 catch(e){state('로그아웃 실패: '+e.message)}finally{busy=false;controls()}
});
$('parent-refresh').addEventListener('click',()=>loadChildren().catch(e=>state('조회 실패: '+e.message)));

$('parent-reset').addEventListener('click',async()=>{
 if(busy||!client)return;
 const email=$('parent-email').value.trim();
 if(!email){state('먼저 이메일을 입력해 주세요.');return}
 busy=true;controls();
 try{
  const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
  if(error)throw error;
  state('재설정 메일을 요청했습니다. 가장 최근 메일의 링크를 한 번만 열어 주세요.');
 }catch(e){
  if(e?.status===429||e?.code==='over_email_send_rate_limit'||/email rate limit exceeded/i.test(e?.message||'')){
   state('테스트 이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요. 버튼을 반복해서 누르지 마세요.');
  }else state('재설정 요청 실패: '+e.message);
 }
 finally{busy=false;controls()}
});
$('parent-recovery').addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!client)return;
 busy=true;controls();
 try{
  const password=$('parent-new-password').value;
  if(password.length<8)throw new Error('8자 이상 입력해 주세요.');
  const {error}=await client.auth.updateUser({password});
  if(error)throw error;
  $('parent-new-password').value='';
  recoveryReady=false;controls();
  state('테스트 DB 비밀번호 변경 완료. 이후 이 비밀번호로 로그인하세요.');
 }catch(e){state('비밀번호 변경 실패: '+e.message)}
 finally{busy=false;controls()}
});

