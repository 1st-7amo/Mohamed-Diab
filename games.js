document.getElementById("year").textContent=new Date().getFullYear();

function initialsForGame(title){
 const words=(title||"Game").trim().split(/\s+/).filter(Boolean);
 return (words.length>1?words[0][0]+words[1][0]:words[0].slice(0,2)).toUpperCase();
}

(async()=>{
 let games=[];try{games=await DB.get("games",[])}catch{}
 const grid=document.getElementById("gamesGrid"),empty=document.getElementById("gamesEmpty");
 empty.hidden=games.length>0;
 for(const game of games){
  const a=document.createElement("a");a.className="game-card game-card-link";a.href=`game.html?id=${encodeURIComponent(game.id)}`;
  const cover=game.coverSrc||game.cover||(game.coverKey?await MediaStore.get(game.coverKey):"");
  if(cover){const img=document.createElement("img");img.className="game-cover";img.src=cover;img.alt=game.title+" cover";a.append(img)}
  const shade=document.createElement("div");shade.className="game-card-shade";a.append(shade);
  const symbol=document.createElement("div");symbol.className="game-symbol";
  const showFallback=()=>{symbol.replaceChildren();symbol.textContent=initialsForGame(game.title);symbol.classList.add("game-symbol-fallback")};
  const showIcon=src=>{
   const iconImg=document.createElement("img");iconImg.className="game-app-icon";iconImg.src=src;iconImg.alt=game.title+" game icon";
   iconImg.onerror=showFallback;symbol.replaceChildren(iconImg);symbol.classList.remove("game-symbol-fallback");
  };
  showFallback();
  // Icon is found automatically from the game name (cards don't wait for the network).
  const uploadedIcon=game.gameIconKey?await MediaStore.get(game.gameIconKey):"";
  if(uploadedIcon)showIcon(uploadedIcon); // an icon you uploaded yourself always wins
  else GameIcon.find(game.title).then(url=>{const src=url||game.iconUrl;if(src)showIcon(src)});
  symbol.setAttribute("aria-label",game.title+" game icon");a.append(symbol);
  const title=document.createElement("h2");title.textContent=game.title;a.append(title);
  const desc=document.createElement("p");desc.textContent=game.category||"OPEN GAME PAGE ↗";a.append(desc);grid.append(a);
 }
})();
