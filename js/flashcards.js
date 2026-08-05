/* =================================================================
   FLASHCARDS render
================================================================= */
const fcGrid = document.getElementById('fcGrid');
FC.forEach(([front,back])=>{
  const el = document.createElement('div');
  el.className='fc';
  el.innerHTML = '<div class="fc-inner"><div class="fc-face fc-front">'+front+'<span class="fc-hint">clic para girar</span></div><div class="fc-face fc-back">'+back+'</div></div>';
  el.addEventListener('click',()=>el.classList.toggle('flipped'));
  fcGrid.appendChild(el);
});
