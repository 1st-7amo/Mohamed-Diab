document.getElementById("year").textContent=new Date().getFullYear();
(async()=>{
 let items=[];try{items=await DB.get("personal",[])}catch{}
 const grid=document.getElementById("personalPhotoGrid"),empty=document.getElementById("personalPhotosEmpty");empty.hidden=items.length>0;
 for(const item of items){
  const src=item.src||await MediaStore.get(item.key);if(!src)continue;
  const card=document.createElement("figure");card.className="personal-photo-card";
  const img=document.createElement("img");img.onerror=()=>card.remove();img.src=src;img.alt=item.caption||"Mohamed Diab personal photo";img.loading="lazy";
  const open=()=>showPhoto(src,img.alt);
  card.tabIndex=0;card.setAttribute("role","button");card.setAttribute("aria-label","Open photo");
  card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
  card.append(img);
  if(item.caption){const cap=document.createElement("figcaption");cap.textContent=item.caption;card.append(cap)}
  grid.append(card);
 }
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
})();
