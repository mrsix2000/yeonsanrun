// Test-only browser harness. No production account or production database access.
import {uploadPracticeSession,readOwnPracticeSessions} from './server-history.js?v=010-1';
const URL='https://cjrvoamwejcpmhyejamn.supabase.co';
const KEY='sb_publishable_ti3tRCDlXvazkCMC6Xz1bQ_SfcGjbeM';
const $=id=>document.getElementById(id);
let client,user=null,attempts=[],busy=false;
const questions=[{a:2,b:3},{a:4,b:5},{a:7,b:2},{a:6,b:6},{a:9,b:1}];
function status(message){$('test-state').textContent=message}
function controls(){
 $('test-logout').disabled=!user||busy;
 $('test-input').disabled=!user||busy||attempts.length===5;
 $('test-submit').disabled=!user||busy||attempts.length===5;
 $('test-refresh').disabled=!user||busy;
 $('test-question').textContent=!user?'로그인 후 시작':attempts.length===5?'5문항 완료':questions[attempts.length].a+' + '+questions[attempts.length].b+' = ?';
 $('test-progress').textContent=attempts.length+' / 5문항';
}
async function refresh(){
 if(!user)return;
 const current=user.id;
 const records=await readOwnPracticeSessions(client,current);
 if(user?.id!==current)return;
 $('test-history').replaceChildren(...records.map(record=>{
  const li=document.createElement('li');
  li.textContent=new Date(record.completed_at).toLocaleString('ko-KR')+' · '+record.mode+' · '+(record.practice_attempts||[]).filter(a=>a.correct).length+'/5 정답';
  return li;
 }));
 status('현재 계정의 서버 기록 '+records.length+'건 조회 완료');
}
async function setUser(next){
 user=next;attempts=[];$('test-history').replaceChildren();controls();
 if(user)await refresh();else status('로그인 필요');
}
try{
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.49.10');
 client=createClient(URL,KEY,{auth:{persistSession:true,detectSessionInUrl:false}});
 const {data,error}=await client.auth.getUser();
 if(error&&!/missing auth session/i.test(error.message))status(error.message);
 await setUser(data?.user||null);
 client.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id!==user?.id)queueMicrotask(()=>setUser(session?.user||null).catch(e=>status(e.message)))});
}catch(error){status('연결 실패: '+error.message)}
$('test-signup').addEventListener('click',async()=>{
 if(busy||!client)return;
 busy=true;controls();
 try{const {error}=await client.auth.signUp({email:$('test-email').value.trim(),password:$('test-password').value});if(error)throw error;status('가입 요청 완료. 이메일 인증이 필요하면 인증 후 로그인하세요.')}
 catch(e){status('가입 실패: '+e.message)}finally{busy=false;controls()}
});
$('test-auth').addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!client)return;
 busy=true;controls();
 try{const {data,error}=await client.auth.signInWithPassword({email:$('test-email').value.trim(),password:$('test-password').value});if(error)throw error;await setUser(data.user)}
 catch(e){status('로그인 실패: '+e.message)}finally{busy=false;controls()}
});
$('test-logout').addEventListener('click',async()=>{
 if(busy||!client)return;busy=true;controls();
 try{const {error}=await client.auth.signOut();if(error)throw error;await setUser(null)}
 catch(e){status('로그아웃 실패: '+e.message)}finally{busy=false;controls()}
});
$('test-answer').addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!user||attempts.length===5)return;
 const q=questions[attempts.length],value=Number($('test-input').value);
 if(!Number.isFinite(value))return;
 attempts.push({typeId:'natural.add',correct:value===q.a+q.b,durationMs:1000});
 $('test-input').value='';controls();
 if(attempts.length!==5)return;
 busy=true;controls();
 try{
  const current=user.id;
  const id=await uploadPracticeSession(client,{mode:'free',at:new Date().toISOString(),attempts:[...attempts]},current);
  if(user?.id!==current)return;
  status('5문항 서버 저장 성공: '+id);await refresh();
 }catch(e){status('서버 저장 실패: '+e.message)}
 finally{busy=false;controls()}
});
$('test-refresh').addEventListener('click',()=>refresh().catch(e=>status('조회 실패: '+e.message)));
