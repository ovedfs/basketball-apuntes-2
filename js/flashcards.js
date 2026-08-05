/* =================================================================
   FLASHCARDS render (cuadrícula completa)
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

/* =================================================================
   Estudio por tarjetas: contador "Tarjeta X / Y" + barra de progreso
   + persistencia en localStorage
================================================================= */
const fcStudyCard = document.getElementById('fcStudyCard');
if(fcStudyCard){
  const fcCounter   = document.getElementById('fcCounter');
  const fcStudyPct  = document.getElementById('fcStudyPct');
  const fcStudyFill = document.getElementById('fcStudyFill');
  const fcStudyFront= document.getElementById('fcStudyFront');
  const fcStudyBack = document.getElementById('fcStudyBack');
  const fcPrev      = document.getElementById('fcPrev');
  const fcNext      = document.getElementById('fcNext');
  const total = FC.length;
  const FC_INDEX_KEY = 'basquetpro-fc-index';
  let fcIndex = 0;

  try {
    const saved = parseInt(localStorage.getItem(FC_INDEX_KEY), 10);
    if (!isNaN(saved) && saved >= 0 && saved < total) fcIndex = saved;
  } catch(e) {}

  function saveIndex(){
    try { localStorage.setItem(FC_INDEX_KEY, fcIndex); } catch(e) {}
  }

  function renderStudyCard(){
    fcStudyFront.innerHTML = FC[fcIndex][0] + '<span class="fc-hint">clic para girar</span>';
    fcStudyBack.innerHTML = FC[fcIndex][1];
    fcStudyCard.classList.remove('flipped');
    fcCounter.textContent = 'Tarjeta '+(fcIndex+1)+' de '+total;
    const pct = total>0 ? Math.round(((fcIndex+1)/total)*100) : 0;
    fcStudyPct.textContent = pct+'%';
    fcStudyFill.style.width = pct+'%';
    fcPrev.disabled = fcIndex===0;
    fcNext.disabled = fcIndex===total-1;
    saveIndex();
  }

  fcStudyCard.setAttribute('role','button');
  fcStudyCard.setAttribute('tabindex','0');
  fcStudyCard.addEventListener('click',()=>fcStudyCard.classList.toggle('flipped'));
  fcStudyCard.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();fcStudyCard.classList.toggle('flipped');}
  });
  fcPrev.addEventListener('click',()=>{ if(fcIndex>0){fcIndex--;renderStudyCard();} });
  fcNext.addEventListener('click',()=>{ if(fcIndex<total-1){fcIndex++;renderStudyCard();} });
  renderStudyCard();
}
