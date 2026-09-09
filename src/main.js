import './style.css';
import {Calculator} from './calculator.js';
import {keys,available,keyNames} from './keyboard.js';
let saved;
try { saved=JSON.parse(localStorage.getItem('hp15c-stage1')); } catch { /* Storage may be unavailable. */ }
const calc = new Calculator(saved);
const keyboard = document.querySelector('#keyboard');
const status = document.querySelector('#status');
let powerHeld=false,powerChord=false;
const polys = ['6,1 31,1 35,4 30,8 7,8 2,4','32,8 36,5 35,25 31,29 28,26 30,11','31,33 35,30 34,50 30,54 27,50 29,36','5,52 28,52 32,56 28,59 3,59 0,56','1,33 5,30 8,34 6,50 2,54 -1,50','3,7 7,10 6,25 3,29 0,26 1,10','6,27 28,27 32,31 28,34 6,34 2,31'];
const segments = {0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg',E:'adefg',r:'eg',o:'cdeg',A:'abcefg',B:'cdefg',C:'adef',D:'bcdeg','-':'g'};
function glyph(char,x) {
  return `<g transform="translate(${x},4) skewX(-2) scale(.8,1)">${polys.map((p,i)=>`<polygon points="${p}" fill="${(segments[char]||'').includes('abcdefg'[i])?'#424a3c':'#838b7010'}"/>`).join('')}</g>`;
}
const exchange = '<svg class="exchange" viewBox="0 0 12 20" aria-hidden="true"><path d="M1 0L11 5 1 10ZM11 10L1 15 11 20Z" fill="currentColor"/></svg>';
function legend(text) {
  if (text === '√x̅') return '<svg class="radical" viewBox="0 0 40 30" aria-hidden="true"><path d="M1 16L7 13 11 25 17 3H39" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="19" y="25" fill="currentColor" font-size="27" font-style="italic" font-family="Arial">x</text></svg>';
  if (text === '∫ʸˣ') return '<span class="integral">∫<span><sup>x</sup><sub>y</sub></span></span>';
  return text.replace('⇄',exchange);
}
function render() {
  const display = calc.display();
  let svg='',x=28;
  if (display.negative) svg+=glyph('-',0);
  for (const char of display.mantissa) {
    if(char==='.' || char===',') {
      svg+=`<circle cx="${x-7}" cy="62" r="3" fill="#424a3c"/>`;
      if(char===',') svg+=`<path d="M${x-5.5} 63l-3.5 4.5" stroke="#424a3c" stroke-width="2"/>`;
    } else {svg+=glyph(char,x);x+=41;}
  }
  if(display.exponent) {
    const e = display.exponent.replace('-','').padStart(2,'0');
    if(display.exponent.startsWith('-'))svg+=glyph('-',315);
    svg+=glyph(e[0],356)+glyph(e[1],397);
  }
  document.querySelector('#digits').innerHTML=svg;
  document.querySelector('#accessible-display').textContent=calc.on ? (display.negative?'-':'')+display.mantissa+(display.exponent?'e'+display.exponent:'') : 'Off';
  document.querySelector('#shift-indicator').textContent=calc.on?([calc.shift,calc.angleMode==='DEG'?'':calc.angleMode,calc.flags[8]?'C':'',calc.user?'USER':''].filter(Boolean).join('   ')):'';
  document.querySelector('#lcd').classList.toggle('blink',calc.overflow);
  for(const shift of ['f','g'])document.querySelector(`[data-key="${shift}"]`)?.setAttribute('aria-pressed',String(calc.shift===shift));
  updateInspector();
  try {localStorage.setItem('hp15c-stage1',JSON.stringify(calc.save()));} catch { /* Calculation works without persistence. */ }
}
for (const key of keys) {
  const button=document.createElement('button');
  button.type='button'; button.dataset.key=key.id;
  button.className='key'+(/^\d$/.test(key.id)?' number':'')+(['+','-','*','/'].includes(key.id)?' operator':'')+(key.id==='ENTER'?' enter':'')+(key.id==='f'?' shift-f':key.id==='g'?' shift-g':'');
  button.style.gridColumn=key.col+1;
  button.style.gridRow=key.id==='ENTER'?'3 / span 2':String(key.row+1);
  button.setAttribute('aria-label',(keyNames[key.id]||key.label)+(!available.has(key.id)?' (programming only)':''));
  button.title=`${keyNames[key.id]||key.label}${key.gold?' · f: '+key.gold:''}${key.blue?' · g: '+key.blue:''}${!available.has(key.id)?' · Programming base key; see guide for its shifted functions':''}`;
  button.innerHTML=`<span class="gold" aria-hidden="true">${legend(key.gold)}</span><span class="key-cap"><span class="primary" aria-hidden="true">${legend(key.label)}</span><span class="blue" aria-hidden="true">${legend(key.blue)}</span></span>`;
  let inspected=false;
  button.addEventListener('pointerdown',()=>{
    if(key.id==='ON'){powerHeld=true;powerChord=false;}
    if(key.id==='.'&&powerHeld){powerChord=true;inspected=true;press('RADIX');return;}
    if((calc.shift==='f'&&['COS','BACK'].includes(key.id))||(calc.shift==='g'&&key.id==='RCL')){inspected=true;press(key.id);}
  });
  const releaseInspection=()=>{if(key.id==='ON')powerHeld=false;if(inspected){calc.inspection=null;render();}};
  button.addEventListener('pointerup',releaseInspection);
  button.addEventListener('pointerleave',releaseInspection);
  button.addEventListener('pointercancel',releaseInspection);
  button.addEventListener('click',()=>{if(key.id==='ON'&&powerChord){powerChord=false;return;}if(inspected){inspected=false;return;}press(key.id);});
  keyboard.append(button);
}
function press(key) {
  if(numericalWorker){status.textContent='Calculation running. Use Cancel to stop it.';return;}
  const wasShift=calc.shift;
  const handled=calc.press(key);
  render();
  if (!handled && calc.on) status.textContent=`${wasShift?wasShift+' → ':''}${keys.find(k=>k.id===key)?.label||key} is a programming control, excluded from this nonprogrammable calculator.`;
  else if (calc.pending && typeof calc.pending==='object') status.textContent=`${calc.pending.kind} · Choose a register, matrix letter, or argument. Esc cancels.`;
  else if (calc.pending) status.textContent= ['FIX','SCI','ENG'].includes(calc.pending)?`${calc.pending} · Choose precision 0–9.`:`${calc.pending==='HYP'?'Hyperbolic':'Inverse hyperbolic'} · Choose SIN, COS or TAN.`;
  else if (calc.error) status.textContent=`Error ${calc.errorCode} · ${calc.message||errorMessages[calc.errorCode]||'Invalid operation'}. Press any key to dismiss.`;
  else if (calc.overflow) status.textContent='Overflow · Press ← or ON to clear blinking. Other calculation keys remain active.';
  else if(calc.message)status.textContent=calc.message;
  else status.textContent=calc.on?'RPN · Enter a number, ENTER, another number, then an operation.':'Powered off · Press ON to resume.';
  if(calc.request)startNumerical(calc.request);
  const b=[...keyboard.children].find(b=>b.dataset.key===key);
  if(b){b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),100);}
}
document.addEventListener('keydown',event=>{
  if (event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select'))return;
  if(event.key.toLowerCase()==='o'){event.preventDefault();if(!event.repeat){powerHeld=true;powerChord=false;}return;}
  if(event.key==='.'&&powerHeld){event.preventDefault();powerChord=true;press('RADIX');return;}
  // Preserve native activation and keyboard navigation for help/links/buttons.
  if ((event.key==='Enter'||event.key===' ') && event.target.closest('button,a') && !event.target.closest('#keyboard')) return;
  const mapping={Enter:'ENTER',Backspace:'BACK',Escape:'CLX',Delete:'CLX',e:'EEX',c:'CHS',f:'f',g:'g',o:'ON'};
  const key=mapping[event.key]||mapping[event.key.toLowerCase()]||(/^[0-9.+*/-]$/.test(event.key)?event.key:null);
  if(key){event.preventDefault();press(key);}
});
document.addEventListener('keyup',event=>{if(event.key.toLowerCase()==='o'&&powerHeld){powerHeld=false;if(!powerChord)press('ON');powerChord=false;}});
window.addEventListener('blur',()=>{powerHeld=false;powerChord=false;});
document.querySelector('#help-toggle').addEventListener('click',event=>{
  const guide=document.querySelector('#guide');guide.hidden=!guide.hidden;
  event.currentTarget.setAttribute('aria-expanded',String(!guide.hidden));
});
const frame=document.querySelector('.calculator-frame');
function size(){const scale=Math.min(1,document.querySelector('.calculator-stage').clientWidth/940);frame.style.width=`${940*scale}px`;frame.style.height=`${574*scale}px`;document.querySelector('.calculator').style.transform=`scale(${scale})`;}
const errorMessages={0:'Invalid mathematical operation',1:'This operation requires a scalar',2:'Insufficient or degenerate statistics',3:'Register or matrix element does not exist',6:'Invalid flag number',8:'No root found',10:'Insufficient calculator memory',11:'Incompatible matrix dimensions or result matrix'};
let numericalWorker=null,runSnapshot=null;
const functionInput=document.querySelector('#function-expression'),parameterInput=document.querySelector('#function-parameters');
try {const stored=JSON.parse(localStorage.getItem('hp15c-function'));if(stored){functionInput.value=stored.expression||'';parameterInput.value=stored.parameters||'';}}catch{}
function saveFunction(){try{localStorage.setItem('hp15c-function',JSON.stringify({expression:functionInput.value,parameters:parameterInput.value}));}catch{}}
functionInput.addEventListener('input',saveFunction);parameterInput.addEventListener('input',saveFunction);
function parseParameters(text){const values={};if(!text.trim())return values;const entries=text.split(/[,;\n]/).filter(s=>s.trim());if(entries.length>16)throw Error('Use at most 16 parameters.');for(const entry of entries){const match=entry.trim().match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)$/i);if(!match||['x','pi','e'].includes(match[1]))throw Error('Parameters use name=value, for example a=2, b=3. x, pi and e are reserved.');values[match[1]]=match[2];}return values;}
function stopNumerical(){if(numericalWorker)numericalWorker.terminate();numericalWorker=null;document.querySelector('#cancel-calculation').hidden=true;document.querySelector('#calculator').removeAttribute('aria-busy');}
function startNumerical(operation){
  calc.request=null;
  if(!functionInput.value.trim()){document.querySelector('#workbench').open=true;functionInput.focus();status.textContent='Enter f(x) below before using SOLVE or integration.';return;}
  let parameters;try{parameters=parseParameters(parameterInput.value);}catch(e){status.textContent=e.message;return;}
  runSnapshot={x:calc.stack[0],y:calc.stack[1]};
  numericalWorker=new Worker(new URL('./numerical-worker.js',import.meta.url),{type:'module'});
  document.querySelector('#cancel-calculation').hidden=false;document.querySelector('#calculator').setAttribute('aria-busy','true');
  status.textContent=operation==='SOLVE'?'Finding a root…':'Integrating f(x)…';
  numericalWorker.onmessage=({data})=>{
    stopNumerical();
    if(data.result)calc.completeNumerical(operation,data.result,runSnapshot);
    if(data.error){if(data.best)calc.completeNumerical('SOLVE',data.best,runSnapshot);calc.error=true;calc.errorCode=data.error==='8'?8:0;status.textContent=data.error==='8'?'Error 8 · No root found. Change the estimates or function.':data.error;}
    else status.textContent=operation==='SOLVE'?'Root in X, previous estimate in Y, residual in Z.':'Integral in X, estimated uncertainty in Y, original upper/lower bounds in Z/T.';
    render();
  };
  numericalWorker.onerror=()=>{stopNumerical();status.textContent='The calculation could not finish. Your input values are preserved.';};
  numericalWorker.postMessage({operation,expression:functionInput.value,parameters,angleMode:calc.angleMode,complexMode:calc.flags[8],...runSnapshot,format:calc.format,tolerance:'1e-11'});
}
document.querySelector('#cancel-calculation').addEventListener('click',()=>{stopNumerical();status.textContent='Calculation cancelled. Input values preserved.';});
document.querySelector('#solve-function').addEventListener('click',()=>press('SOLVE'));
document.querySelector('#integrate-function').addEventListener('click',()=>press('INTEGRATE'));
document.querySelector('#radix-toggle').addEventListener('click',()=>press('RADIX'));
function updateInspector(){
  const target=document.querySelector('#memory-inspector');if(!target)return;
  const describe=value=>typeof value==='string'&&value.startsWith('@')?'Matrix '+value.slice(1):value;
  const lines=['Stack: '+['X','Y','Z','T'].map((k,i)=>k+' = '+describe(calc.stack[i])+(calc.flags[8]?' + ('+calc.imaginary[i]+')i':'')).join(' · '),'LAST X: '+describe(calc.lastX)+(calc.flags[8]?' + ('+calc.lastImaginary+')i':''),'Index I: '+describe(calc.index),'Registers: '+calc.registers.slice(0,calc.registerLimit+1).map((v,i)=>'R'+i+'='+describe(v)).join(' · '),...Object.entries(calc.matrices).map(([name,m])=>name+' ('+m.rows+' × '+m.cols+(m.lu?', LU':'')+')'+(m.data.length?'\n'+Array.from({length:m.rows},(_,r)=>m.data.slice(r*m.cols,(r+1)*m.cols).join('   ')).join('\n'):''))];
  target.textContent=lines.join('\n\n');
}
new ResizeObserver(size).observe(document.querySelector('.calculator-stage'));size();render();
