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
},{rootMargin:"-30% 0px -60% 0px"});
sections.forEach(s=>io.observe(s));

