let deferredPrompt;
const btn=document.getElementById("btn-install");
window.addEventListener("beforeinstallprompt",e=>{
 e.preventDefault();
 deferredPrompt=e;
 btn.style.display="block";
});
btn.addEventListener("click",()=>{
 deferredPrompt.prompt();
 deferredPrompt=null;
});
