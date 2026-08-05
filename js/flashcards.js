/* =================================================================
   FLASHCARDS render
================================================================= */
const fcGrid = document.getElementById('fcGrid');
FC.forEach(([front,back])=>{
  const el = document.createElement('div');
  el.className='fc';
  el.setAttribute('role','button');
  el.setAttribute('tabindex','0');
  el.setAttribute('aria-label','Tarjeta flash: '+front+'. Pulsa Entre o espacio para ver la respuesta');
  el.innerHTML = '<div class="fc-inner"><div class="fc-face fc-front">'+front+'<span class="fc-hint">clic para girar</span></div><div class="fc-face fc-back">'+back+'</div></div>';
  const flip=()=>el.classList.toggle('flipped');
  el.addEventListener('click',flip);
  el.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}
  });
  fcGrid.appendChild(el);
});
