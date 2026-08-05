/* =================================================================
   EXAMEN - Variables globales e inicialización
================================================================= */
let examQuestions = [], examIndex = 0, examAnswers = [], qSeconds=0, qTimerInterval=null;

/* =================================================================
   FUNCIONES DEL EXAMEN
================================================================= */
function startExam(){
  qSeconds = parseInt(document.getElementById('timerSelect').value,10)||0;
  const pool = shuffleArr(QB);
  examQuestions = pool.slice(0,30);
  examIndex = 0;
  examAnswers = new Array(30).fill(null);
  document.getElementById('examStart').style.display='none';
  document.getElementById('examResults').style.display='none';
  document.getElementById('examQuizScreen').style.display='block';
  renderQuestion();
}

function renderQuestion(){
  clearInterval(qTimerInterval);
  const q = examQuestions[examIndex];
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
  document.getElementById('nextBtn').disabled = true;
  const timerEl = document.getElementById('qTimer');
  if(qSeconds>0){
    let t=qSeconds; timerEl.textContent = '⏱ '+t+'s';
    qTimerInterval = setInterval(()=>{
      t--; timerEl.textContent='⏱ '+t+'s';
      if(t<=0){ clearInterval(qTimerInterval); if(examAnswers[examIndex]===null) answerQuestion(-1); }
    },1000);
  } else { timerEl.textContent=''; }
}

function answerQuestion(idx){
  if(examAnswers[examIndex]!==null) return;
  clearInterval(qTimerInterval);
  const q = examQuestions[examIndex];
  examAnswers[examIndex] = idx;
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
}

function nextQuestion(){
  examIndex++;
  if(examIndex<30) renderQuestion();
  else finishExam();
}

function finishExam(){
  document.getElementById('examQuizScreen').style.display='none';
  let aciertos=0; const errorsByModule={};
  const reportRows = [];
  examQuestions.forEach((q,i)=>{
    const isOk = examAnswers[i]===q[3];
    if(isOk) aciertos++;
    else errorsByModule[q[0]] = (errorsByModule[q[0]]||0)+1;
    reportRows.push({n:i+1,pregunta:q[1],userA: examAnswers[i]>=0 ? q[2][examAnswers[i]] : '(sin responder)', correctA:q[2][q[3]], ok:isOk, exp:q[4]});
  });
  const errores = 30-aciertos;
  const pct = Math.round(aciertos/30*100);
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

  document.getElementById('examResults').style.display='block';
}

/* =================================================================
   EVENT LISTENERS DEL EXAMEN
================================================================= */
document.getElementById('startExamBtn').addEventListener('click', startExam);
document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('retryBtn').addEventListener('click', startExam);
document.getElementById('printBtn').addEventListener('click', ()=>window.print());
document.getElementById('toggleReportBtn').addEventListener('click', ()=>{
  const r = document.getElementById('reportContent');
  r.style.display = r.style.display==='none' ? 'block' : 'none';
});
