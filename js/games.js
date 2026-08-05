/* =================================================================
   SUBTABS MINI-JUEGOS
================================================================= */
document.querySelectorAll('.subtab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.subtab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.game-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById(btn.dataset.panel).classList.add('active');
  });
});

/* =================================================================
   JUEGO DE EMPAREJAMIENTO
================================================================= */
let matchState = {selTerm:null, selDef:null, matched:0};
function shuffleArr(a){ const arr=[...a]; for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

function renderMatchGame(){
  matchState = {selTerm:null, selDef:null, matched:0};
  const termsEl = document.getElementById('matchTerms');
  const defsEl = document.getElementById('matchDefs');
  termsEl.innerHTML=''; defsEl.innerHTML='';
  const terms = MP.map((p,i)=>({text:p[0], id:i}));
  const defs = MP.map((p,i)=>({text:p[1], id:i}));
  shuffleArr(terms).forEach(t=>{
    const d = document.createElement('div');
    d.className='match-item'; d.textContent=t.text; d.dataset.id=t.id; d.dataset.type='term';
    d.addEventListener('click',()=>selectMatch(d));
    termsEl.appendChild(d);
  });
  shuffleArr(defs).forEach(f=>{
    const d = document.createElement('div');
    d.className='match-item'; d.textContent=f.text; d.dataset.id=f.id; d.dataset.type='def';
    d.addEventListener('click',()=>selectMatch(d));
    defsEl.appendChild(d);
  });
  updateMatchStatus();
}
function updateMatchStatus(){ document.getElementById('matchStatus').textContent = 'Emparejadas: '+matchState.matched+' / '+MP.length; }
function selectMatch(el){
  if(el.classList.contains('matched')) return;
  if(el.dataset.type==='term'){
    if(matchState.selTerm) matchState.selTerm.classList.remove('selected');
    matchState.selTerm = el; el.classList.add('selected');
  } else {
    if(matchState.selDef) matchState.selDef.classList.remove('selected');
    matchState.selDef = el; el.classList.add('selected');
  }
  if(matchState.selTerm && matchState.selDef){
    const t = matchState.selTerm, d = matchState.selDef;
    if(t.dataset.id === d.dataset.id){
      t.classList.remove('selected'); d.classList.remove('selected');
      t.classList.add('matched'); d.classList.add('matched');
      matchState.matched++; updateMatchStatus();
      matchState.selTerm=null; matchState.selDef=null;
    } else {
      t.classList.add('wrong'); d.classList.add('wrong');
      setTimeout(()=>{
        t.classList.remove('wrong','selected'); d.classList.remove('wrong','selected');
        matchState.selTerm=null; matchState.selDef=null;
      },550);
    }
  }
}
document.getElementById('matchReset').addEventListener('click', renderMatchGame);
renderMatchGame();

/* =================================================================
   PIZARRA TÁCTICA
================================================================= */
const dotsG = document.getElementById('dots');
function renderFormation(key){
  const f = FORMATIONS[key];
  document.getElementById('boardTitle').textContent = f.title;
  document.getElementById('boardDesc').textContent = f.desc;
  dotsG.innerHTML='';
  f.pos.forEach((p,i)=>{
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]); c.setAttribute('r',14);
    c.setAttribute('fill', key==='zona' ? '#0D1B2A' : '#FF6F00');
    c.setAttribute('stroke','#fff'); c.setAttribute('stroke-width','2');
    c.classList.add('dot');
    dotsG.appendChild(c);
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',p[0]); t.setAttribute('y',p[1]+4); t.setAttribute('text-anchor','middle');
    t.setAttribute('fill','#fff'); t.setAttribute('font-size','12'); t.setAttribute('font-family','Poppins');
    t.textContent = (i+1);
    dotsG.appendChild(t);
  });
}
document.querySelectorAll('#boardControls button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#boardControls button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderFormation(btn.dataset.f);
  });
});
renderFormation('overload');

