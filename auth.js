// Owner login with Supabase Auth (real server-side authentication).
const form=document.getElementById("loginForm"),user=document.getElementById("username"),pass=document.getElementById("password");
const error=document.getElementById("error"),button=form.querySelector('button[type="submit"]');
if(!DB.sb)error.textContent="Supabase is not set up yet. Fill supabase-config.js first (see SUPABASE-SETUP.txt).";
DB.session().then(s=>{if(s)location.replace("admin.html")});
form.addEventListener("submit",async e=>{
 e.preventDefault();error.textContent="";
 if(!DB.sb){error.textContent="Supabase is not set up yet. Fill supabase-config.js first.";return}
 button.disabled=true;
 const {error:err}=await DB.sb.auth.signInWithPassword({email:user.value.trim(),password:pass.value});
 button.disabled=false;
 if(err){error.textContent=/network|fetch/i.test(err.message)?"Could not reach Supabase. Check your internet.":"Wrong email or password. Try again.";return}
 location.href="admin.html";
});
