/* =================================================================
   NAVEGACIÓN PRINCIPAL (tabs)
================================================================= */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('active');b.removeAttribute('aria-current');});
    btn.classList.add('active');
    btn.setAttribute('aria-current','true');
    document.querySelectorAll('main.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+btn.dataset.view).classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  });
});

/* Barra de progreso de lectura (solo relevante en Apuntes) */
window.addEventListener('scroll',()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
  document.getElementById('readbar').style.width = (isFinite(pct)?pct:0)+'%';
});

/* Sidebar: resaltar sección activa */
const sections = document.querySelectorAll('.module-section');
const sideLinks = document.querySelectorAll('.side-link');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      sideLinks.forEach(l=>l.classList.remove('active'));
      const link = document.querySelector('.side-link[data-target="'+e.target.id+'"]');
      if(link) link.classList.add('active');
    }
  });
}, {rootMargin:"-30% 0px -60% 0px"});
sections.forEach(s=>io.observe(s));

/* Sidebar: indicador de progreso de lectura en Apuntes */
const sideFill = document.getElementById('sideProgressFill');
const sidePct = document.getElementById('sideProgressPct');
function updateSideProgress(){
  if(!sideFill || !sidePct || sections.length===0) return;
  const y = window.scrollY;
  const firstTop = sections[0].getBoundingClientRect().top + y;
  const lastBottom = sections[sections.length-1].getBoundingClientRect().bottom + y;
  const range = lastBottom - firstTop;
  let pct = range>0 ? (y - firstTop)/range*100 : 100;
  pct = Math.max(0, Math.min(100, pct));
  sideFill.style.width = pct+'%';
  sidePct.textContent = Math.round(pct)+'%';
}
window.addEventListener('scroll', updateSideProgress, {passive:true});
window.addEventListener('resize', updateSideProgress);
window.addEventListener('load', updateSideProgress);
updateSideProgress();

/* =================================================================
   Lazy loading de vídeos embebidos (cargar solo al hacerse visibles)
================================================================= */
/*
  Nota: los iframes con srcdoc NO se recargan en Chrome/Safari al
  asignarles src después. Por eso reemplazamos el nodo por uno nuevo.
*/
function lazyLoadVideo(iframe){
  if(!iframe.dataset.src) return;
  const src = iframe.dataset.src;
  const fresh = document.createElement('iframe');
  ['title','allowfullscreen'].forEach(a=>{
    const v = iframe.getAttribute(a);
    if(v!==null) fresh.setAttribute(a,v);
  });
  fresh.setAttribute('loading','lazy');
  fresh.setAttribute('src', src);
  iframe.parentNode.replaceChild(fresh, iframe);
}
if('IntersectionObserver' in window){
  const videoObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && e.target.dataset.src){
        lazyLoadVideo(e.target);
        videoObserver.unobserve(e.target);
      }
    });
  },{rootMargin:'150px'});
  document.querySelectorAll('iframe[data-src]').forEach(f=>videoObserver.observe(f));
}else{
  /* Fallback para navegadores antiguos: cargar inmediatamente */
  document.querySelectorAll('iframe[data-src]').forEach(lazyLoadVideo);
}

/* =================================================================
   Registro del Service Worker (PWA / modo offline)
================================================================= */
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js')
      .catch(err=>console.warn('Registro de Service Worker falló:',err));
  });
}

