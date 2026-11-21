// Media storage. With Supabase configured, files go to the public "media" bucket (visible to every visitor).
// Without it, they stay in this browser's IndexedDB.
const MediaStore=(()=>{
 const DB_NAME="mdWebsiteMedia", STORE="images", BUCKET="media";
 const cloud=()=>typeof DB!=="undefined"&&!!DB.sb; // (DB is a top-level const, so it is NOT on window)
 function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
 async function put(key,value){
  if(cloud()){
   const blob=(typeof value==="string"&&value.startsWith("data:"))?await (await fetch(value)).blob():value;
   const {error}=await DB.sb.storage.from(BUCKET).upload(key,blob,{upsert:true,cacheControl:"31536000",contentType:blob.type||undefined});
   if(error)throw new Error("Upload failed: "+error.message);
   try{const r=await fetch(DB.sb.storage.from(BUCKET).getPublicUrl(key).data.publicUrl,{method:"HEAD"});
    if(!r.ok)throw new Error("Upload worked but the file is not public (HTTP "+r.status+"). In Supabase > Storage, make the \"media\" bucket Public.")}
   catch(e){if(/not public/.test(e.message))throw e}
   return true;
  }
  const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(value,key);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error)})
 }
 // Cloud: returns a public URL string. Local: returns the stored data URL / Blob.
 async function get(key){
  if(!key)return null;
  if(cloud())return DB.sb.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
  const db=await openDB();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,"readonly").objectStore(STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})
 }
 async function del(key){
  if(!key)return;
  if(cloud()){await DB.sb.storage.from(BUCKET).remove([key]);return}
  const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})
 }
 return {put,get,del};
})();
