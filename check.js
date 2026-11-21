const box=document.getElementById("checks");
function line(ok,title,detail){const d=document.createElement("div");d.style.cssText="padding:11px 0;border-bottom:1px solid #d6ad5520;font-size:13px;line-height:1.6";
 const s=document.createElement("strong");s.textContent=(ok===true?"✅ ":ok===false?"❌ ":"ℹ️ ")+title;s.style.color=ok===true?"#9be3ad":ok===false?"#ff9c8a":"#e2b953";d.append(s);
 if(detail){const p=document.createElement("div");p.style.cssText="color:#a8a08c;font-size:12px;margin-top:3px;word-break:break-word";p.textContent=detail;d.append(p)}box.append(d)}
(async()=>{try{
 const url=window.SUPABASE_URL,key=window.SUPABASE_ANON_KEY;
 if(!window.supabase){line(false,"Supabase library did not load","Check your internet / ad-blocker (cdn.jsdelivr.net).");return}
 if(!url||!key){line(false,"supabase-config.js is empty on this site","The file on GitHub must contain your real URL and anon key. Open "+location.origin+location.pathname.replace(/[^/]*$/,"")+"supabase-config.js and check.");return}
 line(true,"supabase-config.js is filled",url);
 if(key.includes("service_role")||/^sb_secret_/.test(key))line(false,"You pasted a SECRET key","Replace it with the anon / publishable key and rotate the secret key in Supabase.");
 if(!DB.sb){line(false,"Could not create the Supabase client");return}
 let games=[];
 try{games=await DB.get("games",[]);line(true,"Database readable","Games saved: "+games.length)}catch(e){line(false,"Cannot read the database",e.message+" — run supabase-setup.sql (including the GRANT lines).")}
 try{const {data,error}=await DB.sb.rpc("hit_counter",{counter_name:"check"});if(error)throw error;line(true,"Visitor counter function works","value "+data)}catch(e){line(false,"Visitor counter function failed",e.message||String(e))}
 // find one real media file to test public access
 const keys=[];games.forEach(g=>{if(g.coverKey)keys.push(g.coverKey);(g.photoKeys||[]).forEach(k=>keys.push(k))});
 try{const p=await DB.get("personal",[]);p.forEach(x=>x.key&&keys.push(x.key))}catch{}
 if(keys.length){
  const u=await MediaStore.get(keys[0]);
  try{const r=await fetch(u,{method:"HEAD"});line(r.ok,r.ok?"Saved images are publicly visible":"Saved image NOT reachable (HTTP "+r.status+")",r.ok?u:"In Supabase > Storage, open the \"media\" bucket and make it PUBLIC (or re-run supabase-setup.sql). Tested: "+u)}catch(e){line(false,"Could not reach the image URL",u)}
 }else line(null,"No images saved yet","Upload one from the dashboard, then reload this page.");
 const s=await DB.session();
 if(!s){line(null,"Not logged in","Log in at login.html, then reload this page to also test uploads.");return}
 try{
  const k="check-"+Date.now(),png="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  await MediaStore.put(k,png);const u=await MediaStore.get(k);const r=await fetch(u,{method:"HEAD"});
  line(r.ok,r.ok?"Upload test passed (uploaded and publicly readable)":"Uploaded, but the file is NOT public (HTTP "+r.status+")",r.ok?"":"Make the \"media\" bucket PUBLIC in Supabase > Storage.");
  await MediaStore.del(k);
 }catch(e){line(false,"Upload test failed",e.message+" — run supabase-setup.sql (storage policies) and make sure you are logged in.")}
}catch(e){line(false,"The check itself crashed",e.message||String(e))}})();
