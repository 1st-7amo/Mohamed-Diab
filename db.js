// Data layer. Uses Supabase when supabase-config.js is filled; otherwise falls back to this browser only.
const DB=(()=>{
 const url=window.SUPABASE_URL,key=window.SUPABASE_ANON_KEY;
 const sb=(url&&key&&window.supabase)?window.supabase.createClient(url,key):null;
 const LOCAL={site:"mdSiteData",games:"mdGames",personal:"mdPersonalPhotos"};
 // get() THROWS if Supabase can't be reached, so the dashboard never overwrites real data with an empty list.
 async function get(k,fallback){
  if(sb){
   const {data,error}=await sb.from("kv").select("value").eq("key",k).maybeSingle();
   if(error)throw new Error(error.message);
   return data?data.value:fallback;
  }
  try{const v=JSON.parse(localStorage.getItem(LOCAL[k]));return v==null?fallback:v}catch{return fallback}
 }
 async function set(k,value){
  if(sb){
   const {error}=await sb.from("kv").upsert({key:k,value,updated_at:new Date().toISOString()});
   if(error)throw new Error(error.message);
   return true;
  }
  localStorage.setItem(LOCAL[k],JSON.stringify(value));return true;
 }
 async function session(){if(!sb)return null;const {data}=await sb.auth.getSession();return data.session||null}
 async function signOut(){if(sb)await sb.auth.signOut()}
 return {sb,get,set,session,signOut};
})();
