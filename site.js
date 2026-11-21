const defaults={name:"Mohamed Diab",age:"",country:"Egypt EG",discordUrl:"https://discord.gg/3UR9kdqS3",accounts:[
{platform:"TikTok",username:"@mohamed_diabb_1",url:"https://www.tiktok.com/@mohamed_diabb_1"},
{platform:"Facebook",username:"",url:""},
{platform:"Instagram",username:"",url:""},
{platform:"Discord",username:"",url:""},
{platform:"WhatsApp",username:"",url:""}
]};
(async()=>{
let data;try{data=await DB.get("site",null)}catch{}
data=data||defaults;
{const btn=document.getElementById("discordBtn"),url=data.discordUrl!==undefined?data.discordUrl:defaults.discordUrl;
 let ok=false;try{ok=/^https?:$/.test(new URL(url).protocol)}catch{}
 if(ok)btn.href=url;else btn.hidden=true}
const name=data.name||defaults.name;
document.getElementById("name").textContent=name;
document.getElementById("nameValue").textContent=name;
document.getElementById("ageValue").textContent=data.age?data.age:"Add your age";
document.getElementById("countryValue").textContent=data.country||"Egypt EG";
document.getElementById("initials").textContent=(name.trim().split(/\s+/).map(x=>x[0]).join("").slice(0,1)||"M").toUpperCase();
const profilePhoto=document.getElementById("profilePhoto");
(async()=>{const photo=data.photoSrc||data.photo||(data.photoKey?await MediaStore.get(data.photoKey):"");if(photo){profilePhoto.src=photo;profilePhoto.hidden=false;document.getElementById("initials").hidden=true;}})();
document.getElementById("year").textContent=new Date().getFullYear();
const accounts=data.accounts||defaults.accounts;
const primary=accounts.find(a=>a.url);
const handle=document.getElementById("mainHandle");
if(primary){handle.textContent=primary.username||primary.platform;handle.href=primary.url}else{handle.textContent="Social accounts";handle.removeAttribute("href")}
const icons={
TikTok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.2a6.9 6.9 0 0 1-4.2-1.4v8.1a6.2 6.2 0 1 1-5.4-6.1v3.2a3.1 3.1 0 1 0 2.2 3V1.5h3.2c.2 2.1 1.9 3.9 4.2 4.1z"/></svg>',
Facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.6V13h2.7v8z"/></svg>',
Instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
Discord:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.7 5.2A18 18 0 0 0 15.3 4l-.5 1a16 16 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.2C1.5 9.3.7 13.3 1.1 17.2a18 18 0 0 0 5.4 2.7l1.2-2a11 11 0 0 1-1.9-.9l.5-.4a12.8 12.8 0 0 0 11.4 0l.5.4a11 11 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.5-3.2-12zM8.8 14.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/></svg>',
WhatsApp:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.4-.5.2-.4v-.4c0-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.4a9 9 0 0 0 3.5 3.1c.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.1s.2-1 .2-1.1-.2-.2-.4-.3z"/></svg>'
};
const list=document.getElementById("accounts");
accounts.forEach(a=>{
 if(!a.platform)return;
 const platform=a.platform.trim();
 const known=icons[platform]||'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2zm0-4h-2V6h2z"/></svg>';
 const link=document.createElement(a.url?"a":"span");
 link.className="social-icon-link"+(a.url?"":" disabled");
 if(a.url){link.href=a.url;link.target="_blank";link.rel="noopener";link.title=platform+(a.username?" "+a.username:"");}
 else {link.title=platform+" — add link in Owner Dashboard";link.setAttribute("aria-label",link.title);}
 link.innerHTML=known;list.append(link);
});

})();

// Reveal sections as they enter the viewport, with a safe fallback.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}
