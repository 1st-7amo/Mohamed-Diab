// Automatic game icon finder.
// 1) App Store search (real app icons - perfect for PUBG Mobile, Free Fire, etc.)
// 2) Wikipedia thumbnail as a backup (PC / console games)
// Only accepts a result when ALL words of the typed name appear in the result's name,
// so a game never gets another game's icon.
const GameIcon=(()=>{
 const VERSION="V3";
 const norm=s=>(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
 const toks=s=>norm(s).split(" ").filter(Boolean);

 function score(query,name){
  const q=toks(query),n=toks(name);
  if(!q.length||!n.length)return 0;
  if(!q.every(t=>n.includes(t)))return 0;
  return 1+(norm(query)===norm(name)?2:0)-Math.min(n.length-q.length,6)*0.05;
 }
 async function getJSON(url){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
  try{
   const r=await fetch(url,{signal:ctrl.signal});
   if(!r.ok)throw new Error("HTTP "+r.status);
   return await r.json();
  }finally{clearTimeout(timer)}
 }
 function jsonp(url){return new Promise((resolve,reject)=>{
  const cb="__gi"+Math.random().toString(36).slice(2),el=document.createElement("script");
  const done=()=>{clearTimeout(t);delete window[cb];el.remove()};
  const t=setTimeout(()=>{done();reject(new Error("timeout"))},7000);
  window[cb]=d=>{done();resolve(d)};el.onerror=()=>{done();reject(new Error("jsonp"))};
  el.src=url+"&callback="+cb;document.head.append(el);
 })}
 const best=list=>list.filter(x=>x.s>0&&x.url).sort((a,b)=>b.s-a.s)[0]?.url||"";

 async function fromAppStore(title){
  let lastErr=null;
  for(const term of [title,title+" game"]){
   const url="https://itunes.apple.com/search?entity=software&limit=15&term="+encodeURIComponent(term);
   let d;
   try{d=await getJSON(url)}catch{try{d=await jsonp(url)}catch(e){lastErr=e;continue}} // JSONP works even if CORS is blocked
   const hit=best((d.results||[]).map(r=>({s:score(title,r.trackName),url:r.artworkUrl512||r.artworkUrl100})));
   if(hit)return hit;
   lastErr=null;
  }
  if(lastErr)throw lastErr;
  return "";
 }
 async function fromWikipedia(title){
  const d=await getJSON("https://en.wikipedia.org/w/rest.php/v1/search/page?limit=8&q="+encodeURIComponent(title+" video game"));
  return best((d.pages||[]).map(p=>({s:score(title,p.title),url:p.thumbnail?.url?(p.thumbnail.url.startsWith("//")?"https:"+p.thumbnail.url:p.thumbnail.url):""})));
 }

 // findInfo -> {url, failed}. failed=true means the lookup itself could not run (network), not "no match".
 async function findInfo(title){
  const clean=(title||"").trim();
  if(clean.length<2)return {url:"",failed:false};
  const key="mdGameIcon"+VERSION+":"+norm(clean);
  try{
   const c=JSON.parse(localStorage.getItem(key)||"null");
   if(c&&(c.url||Date.now()-c.t<864e5))return {url:c.url,failed:false};
  }catch{}
  let url="",ok=false;
  for(const source of [fromAppStore,fromWikipedia]){
   try{url=await source(clean);ok=true;if(url)break}catch{}
  }
  if(ok){try{localStorage.setItem(key,JSON.stringify({url,t:Date.now()}))}catch{}}
  return {url,failed:!ok};
 }
 const find=async t=>(await findInfo(t)).url;
 return {find,findInfo,norm};
})();
