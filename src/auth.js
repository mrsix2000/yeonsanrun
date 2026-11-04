import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './supabase-config.js?v=008-2';
export const isAuthConfigured=()=>/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(SUPABASE_URL)&&!!SUPABASE_PUBLISHABLE_KEY;
let clientPromise;
export async function getAuthClient(){
 if(!isAuthConfigured())throw new Error('Supabase 연결 설정 전입니다. 관리자 설정 후 이용할 수 있습니다.');
 if(!clientPromise)clientPromise=import('https://esm.sh/@supabase/supabase-js@2.49.10').then(({createClient})=>
  createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}));
 return clientPromise;
}
export function validateCredentials(email,password){
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return '올바른 이메일 주소를 입력해 주세요.';
 if(password.length<8)return '비밀번호는 8자 이상 입력해 주세요.';
 return '';
}
export async function signUp(email,password){
 const client=await getAuthClient();
 const {data,error}=await client.auth.signUp({email,password});
 if(error)throw error;return data;
}
export async function signIn(email,password){
 const client=await getAuthClient();
 const {data,error}=await client.auth.signInWithPassword({email,password});
 if(error)throw error;return data;
}
export async function signOut(){
 const client=await getAuthClient();const {error}=await client.auth.signOut();
 if(error)throw error;
}
export async function currentSession(){
 if(!isAuthConfigured())return null;
 const client=await getAuthClient();const {data,error}=await client.auth.getSession();
 if(error)throw error;return data.session;
}
export async function subscribeAuthChange(callback){
 if(!isAuthConfigured())return ()=>{};
 const client=await getAuthClient();
 const {data}=client.auth.onAuthStateChange((_event,session)=>callback(session));
 return ()=>data.subscription.unsubscribe();
}
