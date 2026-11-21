function showPhoto(src,alt){
 let viewer=document.getElementById("photoLightbox");
 if(!viewer){
  viewer=document.createElement("div");viewer.id="photoLightbox";viewer.className="photo-lightbox";
  viewer.innerHTML='<button class="photo-lightbox-close" type="button" aria-label="Close photo">×</button><img alt=""><p class="photo-lightbox-hint">CLICK OUTSIDE OR PRESS ESC TO CLOSE</p>';
  document.body.append(viewer);
  viewer.addEventListener("click",e=>{if(e.target===viewer||e.target.classList.contains("photo-lightbox-close"))viewer.classList.remove("open")});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")viewer.classList.remove("open")});
 }
 const large=viewer.querySelector("img");large.src=src;large.alt=alt;viewer.classList.add("open");
}
function renderStats(game){
 const st=game.stats;
 if(!st||!Object.values(st).some(Boolean))return;
 const box=document.getElementById("playerStats");
 const rows=[["PLAYER ID",st.id,true],["IN-GAME NAME",st.nick],["RANK",st.rank],["K/D",st.kd],["WINS",st.wins],["HOURS PLAYED",st.hours]].filter(r=>r[1]);
 box.innerHTML='<div class="eyebrow">PLAYER CARD</div><h2>MY <span class="gold">STATS.</span></h2>';
 const grid=document.createElement("div");grid.className="stats-grid";
 for(const [label,value,copy] of rows){
  const cell=document.createElement("div");cell.className="stat-cell"+(copy?" stat-id":"");
  const l=document.createElement("span");l.textContent=label;const v=document.createElement("strong");v.textContent=value;cell.append(l,v);
  if(copy){const b=document.createElement("button");b.type="button";b.className="copy-btn";b.textContent="COPY";
   b.onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText(value);ok=true}catch{const t=document.createElement("textarea");t.value=value;document.body.append(t);t.select();try{ok=document.execCommand("copy")}catch{}t.remove()}
    b.textContent=ok?"COPIED ✓":"PRESS & HOLD ID";setTimeout(()=>b.textContent="COPY",1800)};cell.append(b)}
  grid.append(cell);
 }
 box.append(grid);box.hidden=false;
}
const params=new URLSearchParams(location.search),id=params.get("id");
document.getElementById("year").textContent=new Date().getFullYear();
(async()=>{let games=[];try{games=await DB.get("games",[])}catch{}
const game=games.find(g=>g.id===id),hero=document.getElementById("gameHero");
if(!game){hero.innerHTML='<div class="game-not-found"><h1>GAME NOT FOUND.</h1><a class="action-btn action-primary" href="games.html">BACK TO GAMES ↗</a></div>';return;}
document.title=`${game.title} | Mohamed Diab`;
const coverSrc=game.coverSrc||game.cover||(game.coverKey?await MediaStore.get(game.coverKey):"");
const cover=document.createElement("div");cover.className="game-detail-cover";if(coverSrc){const img=document.createElement("img");img.onerror=()=>img.remove();img.src=coverSrc;img.alt=game.title+" cover";cover.append(img)}
const copy=document.createElement("div");copy.className="game-detail-copy";const eyebrow=document.createElement("div");eyebrow.className="eyebrow";eyebrow.textContent="MY GAME COLLECTION";copy.append(eyebrow);
const h=document.createElement("h1");h.textContent=game.title;copy.append(h);const c=document.createElement("p");c.className="detail-category";c.textContent=game.category||"GAMING";copy.append(c);hero.append(cover,copy);renderStats(game);
document.getElementById("gameDescription").textContent=game.description||"More information about this game will be added soon.";document.getElementById("gameCategory").textContent=game.category||"";
const gallery=document.getElementById("gameGallery");let photos=game.photoSrcs||game.photos||[];if(game.photoKeys?.length)photos=await Promise.all(game.photoKeys.map(k=>MediaStore.get(k)));
for(let i=0;i<photos.length;i++){const img=document.createElement("img");img.src=photos[i];img.alt=game.title+" gallery image "+(i+1);img.loading="lazy";img.onerror=()=>{img.remove();if(!gallery.children.length)gallery.innerHTML='<p class="empty-media">No photos added to this gallery yet.</p>'};img.tabIndex=0;img.setAttribute("role","button");img.title="Click to enlarge";const full=photos[i];img.addEventListener("click",()=>showPhoto(full,img.alt));img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showPhoto(full,img.alt)}});gallery.append(img)}
if(!gallery.children.length)gallery.innerHTML='<p class="empty-media">No photos added to this gallery yet.</p>';
const videos=document.getElementById("gameVideos");(game.videos||[]).forEach(url=>{const wrap=document.createElement("div");wrap.className="video-frame";let embed="";
try{const u=new URL(url);let vid=u.searchParams.get("v");if(u.hostname.includes("youtu.be"))vid=u.pathname.slice(1);if(u.hostname.includes("youtube.com")&&u.pathname.startsWith("/shorts/"))vid=u.pathname.split("/")[2];if(vid&&/^[\\w-]{6,}$/.test(vid))embed=`https://www.youtube-nocookie.com/embed/${vid}`;else if(u.hostname.includes("youtube.com")||u.hostname.includes("youtu.be"))embed=url}catch{}
if(embed){const iframe=document.createElement("iframe");iframe.src=embed;iframe.title=game.title+" video";iframe.loading="lazy";iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";iframe.allowFullscreen=true;wrap.append(iframe)}else{const video=document.createElement("video");video.src=url;video.controls=true;video.preload="metadata";wrap.append(video)}videos.append(wrap)});
for(const item of (game.localVideos||[])){
 if(!item.key)continue;
 const blob=await MediaStore.get(item.key);if(!blob)continue;
 const wrap=document.createElement("div");wrap.className="video-frame";
 const video=document.createElement("video");video.controls=true;video.preload="metadata";video.playsInline=true;
 if(typeof blob==="string")video.src=blob;else{const src=URL.createObjectURL(blob);video.src=src;video.addEventListener("emptied",()=>URL.revokeObjectURL(src),{once:true})}
 wrap.append(video);videos.append(wrap);
}
if(!videos.children.length)videos.innerHTML='<p class="empty-media">No videos added to this game yet.</p>';
})();
