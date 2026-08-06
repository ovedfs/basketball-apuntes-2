/* =================================================================
   EXAMEN - Variables globales e inicialización
   + persistencia en localStorage para retomar
================================================================= */
let examQuestions = [], examIndex = 0, examAnswers = [], qSeconds=0, qTimerInterval=null;
const EXAM_STATE_KEY = 'basquetpro-exam-state';
let examStartTime = null;

/* =================================================================
   Feedback auditivo (Web Audio API) — opcional, persistido en localStorage
================================================================= */
let soundEnabled = true, audioCtx=null;
const SOUND_KEY='basquetpro-exam-sound';
function getAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended') audioCtx.resume();
  return audioCtx;
}
function playBeep(freq,dur,type){
  try{
    const ctx=getAudioCtx();
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type=type||'sine'; o.frequency.setValueAtTime(freq,ctx.currentTime);
    g.gain.setValueAtTime(0.001,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18,ctx.currentTime+0.015);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur/1000);
    o.start(); o.stop(ctx.currentTime+dur/1000);
  }catch(e){}
}
function playCorrectSound(){ playBeep(760,120,'sine'); setTimeout(()=>playBeep(1100,170,'sine'),140); }
function playWrongSound(){ playBeep(260,260,'square'); }
function initExamSound(){
  const cb = document.getElementById('soundToggle');
  if(!cb) return;
  try{ cb.checked = (localStorage.getItem(SOUND_KEY)!=='false'); }catch(e){}
  soundEnabled = cb.checked;
  cb.addEventListener('change',()=>{
    soundEnabled = cb.checked;
    try{ localStorage.setItem(SOUND_KEY, cb.checked); }catch(e){}
  });
}

/* --- Persistencia del estado del examen --- */
function saveExamState(){
  try {
    localStorage.setItem(EXAM_STATE_KEY, JSON.stringify({
      questions: examQuestions,
      answers: examAnswers,
      index: examIndex,
      seconds: qSeconds,
      startedAt: examStartTime
    }));
  } catch(e) {}
}

function clearExamState(){
  try { localStorage.removeItem(EXAM_STATE_KEY); } catch(e) {}
}

function loadExamState(){
  try {
    const raw = localStorage.getItem(EXAM_STATE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

/* =================================================================
   FUNCIONES DEL EXAMEN
================================================================= */
function startExam(resume){
  if(resume){
    const saved = loadExamState();
    if(saved){
      examQuestions = saved.questions;
      examAnswers = saved.answers;
      examIndex = saved.index;
      qSeconds = saved.seconds;
      examStartTime = saved.startedAt;
    }
  } else {
    qSeconds = parseInt(document.getElementById('timerSelect').value,10)||0;
    const pool = shuffleArr(QB);
    examQuestions = pool.slice(0,30);
    examIndex = 0;
    examAnswers = new Array(30).fill(null);
    examStartTime = Date.now();
    const resumeBtn = document.getElementById('resumeExamBtn');
    if(resumeBtn) resumeBtn.style.display='none';
  }
  document.getElementById('examStart').style.display='none';
  document.getElementById('examResults').style.display='none';
  document.getElementById('examQuizScreen').style.display='block';
  renderQuestion();
}

function renderQuestion(){  clearInterval(qTimerInterval);  const q = examQuestions[examIndex];
  document.getElementById('qCounter').textContent = 'Pregunta '+(examIndex+1)+' / 30';
  document.getElementById('examProgressFill').style.width = ((examIndex)/30*100)+'%';
  document.getElementById('qText').textContent = q[1];
  const optsEl = document.getElementById('qOptions');
  optsEl.innerHTML='';
  q[2].forEach((opt,i)=>{
    const b = document.createElement('button');
    b.className='opt-btn'; b.textContent = opt;
    b.addEventListener('click',()=>answerQuestion(i));
    optsEl.appendChild(b);
  });
  document.getElementById('qFeedback').style.display='none';
  const allAnswered = examAnswers[examIndex] !== null;
  document.getElementById('nextBtn').disabled = !allAnswered;
  const timerEl = document.getElementById('qTimer');
  if(qSeconds>0 && !allAnswered){
    let t=qSeconds; timerEl.textContent = '⏱ '+t+'s';
    qTimerInterval = setInterval(()=>{
      t--; timerEl.textContent='⏱ '+t+'s';
      if(t<=0){ clearInterval(qTimerInterval); if(examAnswers[examIndex]===null) answerQuestion(-1); }
    },1000);
  } else { timerEl.textContent=''; }
}

function answerQuestion(idx){
  if(examAnswers[examIndex]!==null) return;  clearInterval(qTimerInterval);  const q = examQuestions[examIndex];
  examAnswers[examIndex] = idx;
  if(soundEnabled){
    if(idx===q[3]) playCorrectSound(); else playWrongSound();
  }
  const buttons = document.querySelectorAll('#qOptions .opt-btn');
  buttons.forEach((b,i)=>{
    b.disabled = true;
    if(i===q[3]) b.classList.add('correct');
    else if(i===idx) b.classList.add('incorrect');
  });
  const fb = document.getElementById('qFeedback');
  fb.style.display='block';
  fb.innerHTML = (idx===q[3] ? '<strong style="color:var(--verde)">¡Correcto!</strong> ' : '<strong style="color:var(--rojo)">Incorrecto.</strong> ') + q[4];
  document.getElementById('nextBtn').disabled = false;
  saveExamState();
}

function nextQuestion(){
  examIndex++;
  if(examIndex < examQuestions.length) renderQuestion();
  else finishExam();
  saveExamState();
}

function finishExamEarly(){
  finishExam();
}

function finishExam(){
  document.getElementById('examQuizScreen').style.display='none';
  const total = examQuestions.length;
  let aciertos=0; const errorsByModule={};
  const reportRows = [];
  examQuestions.forEach((q,i)=>{
    const isOk = examAnswers[i]===q[3];
    if(isOk) aciertos++;
    else errorsByModule[q[0]] = (errorsByModule[q[0]]||0)+1;
    reportRows.push({n:i+1,pregunta:q[1],userA: examAnswers[i]>=0 ? q[2][examAnswers[i]] : '(sin responder)', correctA:q[2][q[3]], ok:isOk, exp:q[4]});
  });
  const errores = total-aciertos;
  const pct = total>0 ? Math.round(aciertos/total*100) : 0;
  const ring = document.getElementById('scoreRing');
  const color = pct>=70?'var(--verde)':pct>=50?'var(--amber)':'var(--rojo)';
  ring.style.background = 'conic-gradient('+color+' '+(pct*3.6)+'deg, #E8EAED 0deg)';
  ring.innerHTML = '<div style="background:var(--card);border-radius:50%;width:112px;height:112px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><span style="color:'+color+'">'+pct+'</span><span style="font-size:.6rem;color:#8a94a6;">/ 100</span></div>';
  document.getElementById('aciertosCount').textContent = aciertos;
  document.getElementById('erroresCount').textContent = errores;

  const recoBox = document.getElementById('recoBox');
  const sortedMods = Object.entries(errorsByModule).sort((a,b)=>b[1]-a[1]).slice(0,3);
  if(sortedMods.length===0){
    recoBox.innerHTML = '<div class="tip success"><strong>¡Excelente!</strong> No se detectaron errores concentrados en ningún módulo. Sigue reforzando con las flashcards.</div>';
  } else {
    let html = '<h3>Recomendaciones personalizadas</h3>';
    sortedMods.forEach(([mod,count])=>{
      html += '<div class="tip"><strong>'+MODULOS[mod]+'</strong> ('+count+' error(es)) — '+RECO[mod]+'</div>';
    });
    recoBox.innerHTML = html;
  }

  let reportHtml = '<h3>Reporte detallado</h3>';
  reportRows.forEach(r=>{
    reportHtml += '<div class="report-row '+(r.ok?'':'wrong')+'"><strong>P'+r.n+'.</strong> '+r.pregunta+'<br>Tu respuesta: <span class="'+(r.ok?'tag-ok':'tag-bad')+'">'+r.userA+'</span>'+(r.ok?'':' · Correcta: <span class="tag-ok">'+r.correctA+'</span>')+'<br><em style="color:#5b6577;">'+r.exp+'</em></div>';
  });
  document.getElementById('reportContent').innerHTML = reportHtml;
  document.getElementById('reportContent').style.display='none';
  clearExamState();

  document.getElementById('examResults').style.display='block';
}

/* =================================================================
   EVENT LISTENERS DEL EXAMEN
================================================================= */
const startBtn = document.getElementById('startExamBtn');
if(startBtn) startBtn.addEventListener('click', ()=>startExam(false));

const nextBtnEl = document.getElementById('nextBtn');
if(nextBtnEl) nextBtnEl.addEventListener('click', nextQuestion);

const retryBtn = document.getElementById('retryBtn');
if(retryBtn) retryBtn.addEventListener('click', ()=>startExam(false));

const resumeBtnEl = document.getElementById('resumeExamBtn');
if(resumeBtnEl) resumeBtnEl.addEventListener('click', ()=>startExam(true));

const finishEarlyBtn = document.getElementById('finishExamEarlyBtn');
if(finishEarlyBtn) finishEarlyBtn.addEventListener('click', finishExamEarly);

const printBtnEl = document.getElementById('printBtn');
if(printBtnEl) printBtnEl.addEventListener('click', ()=>{
  const reportContent = document.getElementById('reportContent');
  const scoreRing = document.getElementById('scoreRing');
  const aciertosCount = document.getElementById('aciertosCount');
  const erroresCount = document.getElementById('erroresCount');
  const recoBox = document.getElementById('recoBox');
  
  if(!reportContent || !scoreRing) return;
  
  const reportHtml = reportContent.innerHTML;
  const total = examQuestions.length;
  const aciertos = parseInt(aciertosCount.textContent) || 0;
  const errores = parseInt(erroresCount.textContent) || 0;
  const pct = total>0 ? Math.round(aciertos/total*100) : 0;
  const color = pct>=70?'#1E8E5A':pct>=50?'#B7791F':'#C62828';
  
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if(printWindow){
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resultados del Examen - BasquetPro</title>
        <style>
          body{font-family:'Inter',Arial,sans-serif;max-width:800px;margin:0 auto;padding:2rem;color:#000;}
          h1{color:#0D1B2A;border-bottom:3px solid #FF6F00;padding-bottom:.5rem;}
          .score-ring{width:120px;height:120px;border-radius:50%;background:conic-gradient(${color} ${pct*3.6}deg, #E8EAED 0deg);display:flex;align-items:center;justify-content:center;margin:1rem auto;}
          .score-inner{background:#fff;width:100px;height:100px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;}
          .score-pct{font-size:2rem;font-weight:800;color:${color};}
          .score-label{font-size:.7rem;color:#666;}
          .results-grid{display:flex;gap:1rem;justify-content:center;margin:1.5rem 0;}
          .result-box{border:2px solid;border-radius:10px;padding:1rem;text-align:center;flex:1;}
          .result-box.ok{border-color:#1E8E5A;color:#1E8E5A;}
          .result-box.bad{border-color:#C62828;color:#C62828;}
          .result-box .big{font-size:2rem;font-weight:800;}
          .tip{background:#FFF3E0;border-left:4px solid #B7791F;padding:1rem;margin:1rem 0;border-radius:6px;}
          .tip strong{color:#B7791F;}
          h3{margin-top:2rem;color:#0D1B2A;}
          .report-row{border:1px solid #ddd;border-radius:6px;padding:.7rem;margin-bottom:.6rem;break-inside:avoid;}
          .report-row.wrong{background:#fff3f3;}
          .tag-ok{color:#1E8E5A;font-weight:600;}
          .tag-bad{color:#C62828;font-weight:600;}
          @media print{body{padding:0;} .no-print{display:none;}}
        </style>
      </head>
      <body>
        <h1>📊 Resultados del Examen</h1>
        <div class="score-ring">
          <div class="score-inner">
            <div class="score-pct">${pct}</div>
            <div class="score-label">/ 100</div>
          </div>
        </div>
        <div class="results-grid">
          <div class="result-box ok"><div class="big">${aciertos}</div>Aciertos</div>
          <div class="result-box bad"><div class="big">${errores}</div>Errores</div>
        </div>
        ${recoBox ? '<div>'+recoBox.innerHTML+'</div>' : ''}
        <h3>Reporte Detallado</h3>
        <div>${reportHtml}</div>
        <script>window.onload=function(){window.print();}</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
});

const toggleBtn = document.getElementById('toggleReportBtn');
if(toggleBtn) toggleBtn.addEventListener('click', ()=>{
  const r = document.getElementById('reportContent');
  if(r) r.style.display = r.style.display==='none' ? 'block' : 'none';
});
(function(){
  const saved = loadExamState();
  const resumeBtn = document.getElementById("resumeExamBtn");
  if(saved && resumeBtn){
    const answered = saved.answers.filter(a=>a!==null).length;
    const d = document.createElement("div");
    d.className="tip";
    d.innerHTML = "<strong>Examen guardado</strong> — has respondido " + answered + "/30 preguntas.";
    const btn = document.createElement("button");
    btn.className="btn-secondary";
    btn.textContent="Retomar";
    btn.style.marginLeft="auto";
    btn.style.fontSize=".75rem";
    btn.addEventListener("click", ()=>startExam(true));
    d.appendChild(btn);
    resumeBtn.replaceWith(d);
  } else if(resumeBtn){
    resumeBtn.style.display="none";
  }
})();
initExamSound();