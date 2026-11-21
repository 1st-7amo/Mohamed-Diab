// Shared visitor counter stored in your Supabase database: +1 each time the home page is opened.
// The owner's own visits (while logged in) are not counted.
(async()=>{
 const out=document.getElementById("visitorCount");
 if(!out)return;
 try{
  if(!DB.sb)throw new Error("Supabase not configured");
  let n;
  if(await DB.session()){
   const {data,error}=await DB.sb.from("counters").select("count").eq("name","home").maybeSingle();
   if(error)throw error;n=data?data.count:0;
  }else{
   const {data,error}=await DB.sb.rpc("hit_counter",{counter_name:"home"});
   if(error)throw error;n=data;
  }
  out.textContent=Number(n).toLocaleString("en-US");
 }catch{out.textContent="—"}
})();
