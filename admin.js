(async()=>{
if(!(await DB.session())){location.replace("login.html");return}
const defaults={name:"Mohamed Diab",age:"",country:"Egypt EG",discordUrl:"https://discord.gg/3UR9kdqS3",photoKey:"",accounts:[{platform:"TikTok",username:"@mohamed_diabb_1",url:"https://www.tiktok.com/@mohamed_diabb_1"},{platform:"Facebook",username:"",url:""},{platform:"Instagram",username:"",url:""},{platform:"Discord",username:"",url:""},{platform:"WhatsApp",username:"",url:""}]};
let data,games,personal;
try{[data,games,personal]=await Promise.all([DB.get("site",null),DB.get("games",[]),DB.get("personal",[])])}
catch(e){document.body.innerHTML='<main class="dashboard"><h1 class="dash-title">COULD NOT <span class="gold">LOAD.</span></h1><p class="sub">Could not reach your Supabase database ('+String(e.message||e).replace(/</g,"&lt;")+'). Check your internet and supabase-config.js, then refresh. Nothing was changed.</p></main>';return}
data={...defaults,...(data||{})};
const STAT_FIELDS=[["id","statsId"],["nick","statsNick"],["rank","statsRank"],["kd","statsKd"],["wins","statsWins"],["hours","statsHours"]];
const $=id=>document.getElementById(id),nameInput=$("displayName"),ageInput=$("displayAge"),fields=$("accountFields");
$("discordUrl").value=data.discordUrl||"";nameInput.value=data.name||"";ageInput.value=data.age||"";$("displayCountry").value=data.country||"Egypt EG";
let profilePhotoKey=data.photoKey||"",profilePhotoPreview="";
function addRow(a={platform:"",username:"",url:""}){const row=document.createElement("div");row.className="account-edit";for(const [key,placeholder] of [["platform","Platform e.g. Instagram"],["username","Username"],["url","Full profile URL"]]){const input=document.createElement("input");input.dataset.field=key;input.placeholder=placeholder;input.value=a[key]||"";input.setAttribute("aria-label",placeholder);row.append(input)}const remove=document.createElement("button");remove.type="button";remove.className="remove";remove.textContent="REMOVE";remove.onclick=()=>row.remove();row.append(remove);fields.append(row)}
const savedAccounts=data.accounts||[];["TikTok","Facebook","Instagram","Discord","WhatsApp"].forEach(platform=>{if(!savedAccounts.some(a=>a.platform.toLowerCase()===platform.toLowerCase()))savedAccounts.push({platform,username:"",url:""})});savedAccounts.forEach(addRow);$("addAccount").onclick=()=>addRow();
function showPreview(src){$("photoPreview").hidden=!src;$("photoFallback").hidden=!!src;if(src)$("photoPreview").src=src}
(async()=>{if(profilePhotoKey)showPreview(await MediaStore.get(profilePhotoKey));renderGames();renderPersonal()})();
async function compressImage(file,maxDim=1100,maxBytes=260000){
 if(!file || !file.type.startsWith("image/")) throw Error("Choose a valid image file (JPG, PNG or WEBP).");
 if(file.size>30*1024*1024) throw Error("Image is too large. Choose an image under 30 MB.");
 let bitmap;
 try {
  if("createImageBitmap" in window) bitmap=await createImageBitmap(file);
  else {
   const objectUrl=URL.createObjectURL(file);
   try { bitmap=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error("This image format is not supported by your browser. Use JPG, PNG or WEBP."));img.src=objectUrl}) }
   finally { URL.revokeObjectURL(objectUrl); }
  }
 } catch(err){throw Error("Could not open this image. Please use JPG, PNG or WEBP.");}
 const width=bitmap.width,height=bitmap.height;
 if(!width||!height) throw Error("This image file is damaged or unsupported.");
 let scale=Math.min(1,maxDim/Math.max(width,height)),quality=.84;
 const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
 if(!ctx) throw Error("Your browser could not process this image.");
 const make=()=>{canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));ctx.fillStyle="#111";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);return canvas.toDataURL("image/jpeg",quality)};
 let out=make();
 while(out.length>maxBytes&&quality>.48){quality-=.08;out=make()}
 while(out.length>maxBytes&&scale>.25){scale*=.78;out=make()}
 if(bitmap.close)bitmap.close();
 if(!out.startsWith("data:image/jpeg")) throw Error("Could not process this image.");
 if(out.length>maxBytes) throw Error("Image is too large after compression. Try a smaller image.");
 return out;
}
$("profilePhotoFile").addEventListener("change",async()=>{const file=$("profilePhotoFile").files[0];if(!file)return;try{profilePhotoPreview=await compressImage(file,700,300000);showPreview(profilePhotoPreview);$("saved").textContent="Photo ready. Press SAVE CHANGES."}catch(err){$("saved").textContent=err.message}});
$("removePhoto").onclick=async()=>{if(profilePhotoKey)await MediaStore.del(profilePhotoKey);profilePhotoKey="";profilePhotoPreview="";$("profilePhotoFile").value="";showPreview("");$("saved").textContent="Photo removed. Press SAVE CHANGES."};
$("profileForm").addEventListener("submit",async e=>{e.preventDefault();const accounts=[...fields.querySelectorAll(".account-edit")].map(row=>Object.fromEntries([...row.querySelectorAll("input")].map(i=>[i.dataset.field,i.value.trim()]))).filter(a=>a.platform);for(const a of accounts){if(!a.url)continue;try{const u=new URL(a.url);if(!["http:","https:"].includes(u.protocol))throw Error()}catch{$("saved").textContent="Please enter valid http/https profile links.";return}}
try{if(profilePhotoPreview){const key="profile-"+Date.now();await MediaStore.put(key,profilePhotoPreview);if(profilePhotoKey)await MediaStore.del(profilePhotoKey);profilePhotoKey=key;profilePhotoPreview=""}
const discordUrl=$("discordUrl").value.trim();if(discordUrl){try{const u=new URL(discordUrl);if(!["http:","https:"].includes(u.protocol))throw Error()}catch{$("saved").textContent="Please enter a valid Discord link (https://discord.gg/...).";return}}
const updated={discordUrl,name:nameInput.value.trim(),age:ageInput.value,country:$("displayCountry").value.trim(),photoKey:profilePhotoKey,accounts};await DB.set("site",updated);$("saved").textContent="Saved! Your profile is updated."}catch{$("saved").textContent="Could not save. Check browser storage and try again."}});
$("logout").onclick=async()=>{await DB.signOut();location.href="login.html"};

async function saveGames(){try{await DB.set("games",games);return true}catch(e){$("gameStatus").textContent="Could not save game details: "+(e.message||"try again");return false}}
function renderGames(){fillStatsSelect();const list=$("managedGames");list.innerHTML="";if(!games.length){list.innerHTML='<p class="empty-media">No games added yet.</p>';return}games.forEach(g=>{const row=document.createElement("div");row.className="managed-game";const title=document.createElement("strong");title.textContent=g.title;const remove=document.createElement("button");remove.type="button";remove.className="remove";remove.textContent="DELETE";remove.onclick=async()=>{games=games.filter(x=>x.id!==g.id);if(g.coverKey)await MediaStore.del(g.coverKey);if(g.gameIconKey)await MediaStore.del(g.gameIconKey);for(const k of (g.photoKeys||[]))await MediaStore.del(k);for(const v of (g.localVideos||[]))if(v.key)await MediaStore.del(v.key);await saveGames();renderGames()};row.append(title,remove);list.append(row)})}
async function storeFile(file,prefix,maxDim,maxBytes){const compressed=await compressImage(file,maxDim,maxBytes);const key=prefix+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,8);await MediaStore.put(key,compressed);return key}
async function storeVideo(file){
 if(!file || !file.type.startsWith("video/")) throw Error("Choose a valid video file (MP4 or WEBM).");
 if(file.size>50*1024*1024) throw Error("Video is too large. Maximum size is 50 MB (use a YouTube link for bigger videos).");
 const key="gamevideo-"+Date.now()+"-"+Math.random().toString(36).slice(2,8);
 await MediaStore.put(key,file);
 return {key,name:file.name,type:file.type,size:file.size};
}
let currentIconUrl="",iconTimer=0,iconToken=0;
function setIconPreview(url,msg){const box=$("iconPreview");box.replaceChildren();if(url){const i=document.createElement("img");i.src=url;i.alt="Game icon preview";i.onerror=()=>{box.textContent="?"};box.append(i)}else box.textContent="?";$("iconPreviewText").textContent=msg}
$("gameTitle").addEventListener("input",()=>{
 clearTimeout(iconTimer);const title=$("gameTitle").value.trim();currentIconUrl="";
 if(title.length<2){setIconPreview("","Type the game name and its icon appears here automatically.");return}
 setIconPreview("","Searching for icon…");
 iconTimer=setTimeout(async()=>{const token=++iconToken;const r=await GameIcon.findInfo(title);if(token!==iconToken)return;currentIconUrl=r.url;
  setIconPreview(r.url,r.url?"Icon found automatically ✓":r.failed?"Could not reach the icon search (check internet / adblock). You can upload an icon below.":"No exact match — try the full official name (e.g. \"Garena Free Fire\") or upload an icon below.")},500);
});
$("gameIconFile").addEventListener("change",async()=>{const f=$("gameIconFile").files[0];if(!f)return;try{setIconPreview(await compressImage(f,256,60000),"Using your uploaded icon ✓")}catch(err){setIconPreview("",err.message)}});
renderGames();
$("gameForm").addEventListener("submit",async e=>{
 e.preventDefault();const title=$("gameTitle").value.trim();if(!title)return;
 if(games.some(g=>g.title.toLowerCase()===title.toLowerCase())){$("gameStatus").textContent="This game is already in your collection.";return}
 const btn=$("gameForm").querySelector('button[type="submit"]');btn.disabled=true;btn.textContent="OPTIMIZING & SAVING...";
 let createdKeys=[];
 try{
  const coverFile=$("gameCover").files[0],photoFiles=[...$("gamePhotos").files].slice(0,8);
  const iconFile=$("gameIconFile").files[0];
  const gameIconKey=iconFile?await storeFile(iconFile,"gameicon",256,60000):"";
  if(gameIconKey)createdKeys.push(gameIconKey);
  const coverKey=coverFile?await storeFile(coverFile,"cover",1600,600000):"";
  if(coverKey)createdKeys.push(coverKey);
  const photoKeys=[];for(const file of photoFiles){const key=await storeFile(file,"gamephoto",2000,900000);photoKeys.push(key);createdKeys.push(key)}
  const videoUrl=$("gameVideo").value.trim(),videos=videoUrl?[videoUrl]:[];
  if(videoUrl){const u=new URL(videoUrl);if(!["http:","https:"].includes(u.protocol))throw Error("Enter a valid video URL.")}
  const localVideos=[];
  const localFiles=[...($("gameVideoFile")?.files||[])].slice(0,3);
  for(const file of localFiles){const item=await storeVideo(file);localVideos.push(item);createdKeys.push(item.key)}
  const game={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),title,description:$("gameDescription").value.trim(),category:$("gameCategory").value.trim(),gameIconKey,iconUrl:currentIconUrl,coverKey,photoKeys,videos,localVideos};
  games.push(game);
  if(await saveGames()){$("gameStatus").textContent="Game added successfully. Open Games to view its page.";e.target.reset();currentIconUrl="";setIconPreview("","Type the game name and its icon appears here automatically.");renderGames()}
  else {games=games.filter(g=>g.id!==game.id);for(const k of createdKeys)await MediaStore.del(k)}
 }catch(err){for(const k of createdKeys)await MediaStore.del(k);$("gameStatus").textContent=err.message||"Could not add this game. Check the selected files and try again."}
 btn.disabled=false;btn.innerHTML='ADD GAME <span>＋</span>';
});

async function savePersonal(){try{await DB.set("personal",personal);return true}catch(e){$("personalPhotoStatus").textContent="Could not save gallery information: "+(e.message||"try again");return false}}
async function renderPersonal(){const list=$("personalPhotoList");list.innerHTML="";if(!personal.length){list.innerHTML='<p class="empty-media">Your personal gallery is empty.</p>';return}for(const item of personal){const row=document.createElement("div");row.className="managed-game";const label=document.createElement("strong");label.textContent=item.caption||"My photo";const del=document.createElement("button");del.className="remove";del.type="button";del.textContent="DELETE";del.onclick=async()=>{personal=personal.filter(x=>x.id!==item.id);await MediaStore.del(item.key);await savePersonal();renderPersonal()};row.append(label,del);list.append(row)}}
$("personalPhotoForm").addEventListener("submit",async e=>{e.preventDefault();const files=[...$("personalPhotos").files].slice(0,12);if(!files.length)return;const btn=e.target.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent="OPTIMIZING PHOTOS...";
let added=[];try{const caption=$("personalPhotoTitle").value.trim();for(let i=0;i<files.length;i++){const key=await storeFile(files[i],"personal",1800,700000);added.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),key,caption:caption||(files.length>1?`Photo ${i+1}`:"")})}personal.push(...added);if(await savePersonal()){$("personalPhotoStatus").textContent=`Added ${added.length} photo(s) to your gallery.`;e.target.reset();renderPersonal()}else{for(const item of added)await MediaStore.del(item.key);personal=personal.filter(p=>!added.some(a=>a.id===p.id))}}catch(err){for(const item of added)await MediaStore.del(item.key);$("personalPhotoStatus").textContent=err.message||"Could not add photos. Try fewer images."}
btn.disabled=false;btn.innerHTML='ADD MY PHOTOS <span>＋</span>';
});

// ---- Player ID & stats ----
function fillStatsSelect(){const sel=$("statsGame"),prev=sel.value;sel.innerHTML="";
 if(!games.length){sel.append(new Option("Add a game first",""));loadStats();return}
 games.forEach(g=>sel.append(new Option(g.title,g.id)));if(games.some(g=>g.id===prev))sel.value=prev;loadStats()}
function loadStats(){const g=games.find(x=>x.id===$("statsGame").value),st=g?.stats||{};STAT_FIELDS.forEach(([k,id])=>$(id).value=st[k]||"")}
$("statsGame").addEventListener("change",loadStats);
$("statsForm").addEventListener("submit",async e=>{e.preventDefault();const g=games.find(x=>x.id===$("statsGame").value);if(!g){$("statsStatus").textContent="Add a game first.";return}
 g.stats=Object.fromEntries(STAT_FIELDS.map(([k,id])=>[k,$(id).value.trim()]));
 $("statsStatus").textContent=(await saveGames())?"Saved ✓ Visible to everyone.":"Could not save."});
fillStatsSelect();

})();
