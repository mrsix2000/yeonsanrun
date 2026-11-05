// Test-only parent report UI. All database reads use the test project.
import {loadLinkedChildReport} from './parent-report-server.js?v=010-1';
const URL='https://cjrvoamwejcpmhyejamn.supabase.co';
const KEY='sb_publishable_ti3tRCDlXvazkCMC6Xz1bQ_SfcGjbeM';
const $=id=>document.getElementById(id);
let client,user=null,revision=0,busy=false;
function state(message){$('parent-state').textContent=message}
function controls(){
 $('parent-logout').disabled=!user||busy;
 $('parent-refresh').disabled=!user||busy;
}
function reset(){
 revision++;$('parent-children').replaceChildren();
 $('parent-summary').textContent='자녀를 선택하면 기록이 표시됩니다.';
}
async function loadChildren(){
 if(!user)return;
 const id=user.id,token=revision;
 const {data,error}=await client.from('parent_report_grants').select('student_user_id,created_at').eq('parent_user_id',id).order('created_at',{ascending:false});
 if(error)throw error;
 if(token!==revision||user?.id!==id)return;
 $('parent-children').replaceChildren();
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
 client=createClient(URL,KEY,{auth:{persistSession:true,detectSessionInUrl:false}});
 const {data}=await client.auth.getUser();await setUser(data?.user||null);
 client.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id!==user?.id)queueMicrotask(()=>setUser(session?.user||null).catch(e=>state(e.message)))});
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
