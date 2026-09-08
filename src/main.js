import './style.css';
import {Calculator} from './calculator.js';
import {keys,available,keyNames} from './keyboard.js';
let saved;
try { saved=JSON.parse(localStorage.getItem('hp15c-stage1')); } catch { /* Storage may be unavailable. */ }
const calc = new Calculator(saved);
const keyboard = document.querySelector('#keyboard');
const status = document.querySelector('#status');
const polys = ['6,1 31,1 35,4 30,8 7,8 2,4','32,8 36,5 35,25 31,29 28,26 30,11','31,33 35,30 34,50 30,54 27,50 29,36','5,52 28,52 32,56 28,59 3,59 0,56','1,33 5,30 8,34 6,50 2,54 -1,50','3,7 7,10 6,25 3,29 0,26 1,10','6,27 28,27 32,31 28,34 6,34 2,31'];
const segments = {0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg',E:'adefg',r:'eg',o:'cdeg','-':'g'};
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
  document.querySelector('#shift-indicator').textContent=calc.on?([calc.shift,calc.angleMode==='DEG'?'':calc.angleMode].filter(Boolean).join('   ')):'';
  document.querySelector('#lcd').classList.toggle('blink',calc.overflow);
  for(const shift of ['f','g'])document.querySelector(`[data-key="${shift}"]`)?.setAttribute('aria-pressed',String(calc.shift===shift));
  try {localStorage.setItem('hp15c-stage1',JSON.stringify(calc.save()));} catch { /* Calculation works without persistence. */ }
}
for (const key of keys) {
  const button=document.createElement('button');
  button.type='button'; button.dataset.key=key.id;
  button.className='key'+(/^\d$/.test(key.id)?' number':'')+(['+','-','*','/'].includes(key.id)?' operator':'')+(key.id==='ENTER'?' enter':'')+(key.id==='f'?' shift-f':key.id==='g'?' shift-g':'');
  button.style.gridColumn=key.col+1;
  button.style.gridRow=key.id==='ENTER'?'3 / span 2':String(key.row+1);
  button.setAttribute('aria-label',(keyNames[key.id]||key.label)+(!available.has(key.id)?' (base function not yet available)':''));
  button.title=`${keyNames[key.id]||key.label}${key.gold?' · f: '+key.gold:''}${key.blue?' · g: '+key.blue:''}${!available.has(key.id)?' · Base function not yet available; see guide for shifted functions':''}`;
  button.innerHTML=`<span class="gold" aria-hidden="true">${legend(key.gold)}</span><span class="key-cap"><span class="primary" aria-hidden="true">${legend(key.label)}</span><span class="blue" aria-hidden="true">${legend(key.blue)}</span></span>`;
  button.addEventListener('click',()=>press(key.id));
  keyboard.append(button);
}
function press(key) {
  const wasShift=calc.shift;
  const handled=calc.press(key);
  render();
  if (!handled && calc.on) status.textContent=`${wasShift?wasShift+' → ':''}${keys.find(k=>k.id===key)?.label||key} is available in a later stage. Your calculation is unchanged.`;
  else if (calc.pending) status.textContent= ['FIX','SCI','ENG'].includes(calc.pending)?`${calc.pending} · Choose precision 0–9.`:`${calc.pending==='HYP'?'Hyperbolic':'Inverse hyperbolic'} · Choose SIN, COS or TAN.`;
  else if (calc.error) status.textContent='Error 0 · Invalid mathematical operation. Press any key to restore the previous value.';
  else if (calc.overflow) status.textContent='Overflow · Press ← or ON to clear blinking. Other calculation keys remain active.';
  else status.textContent=calc.on?'RPN · Enter a number, ENTER, another number, then an operation.':'Powered off · Press ON to resume.';
  const b=[...keyboard.children].find(b=>b.dataset.key===key);
  if(b){b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),100);}
}
document.addEventListener('keydown',event=>{
  if (event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select'))return;
  // Preserve native activation and keyboard navigation for help/links/buttons.
  if ((event.key==='Enter'||event.key===' ') && event.target.closest('button,a') && !event.target.closest('#keyboard')) return;
  const mapping={Enter:'ENTER',Backspace:'BACK',Escape:'CLX',Delete:'CLX',e:'EEX',c:'CHS',f:'f',g:'g',o:'ON'};
  const key=mapping[event.key]||mapping[event.key.toLowerCase()]||(/^[0-9.+*/-]$/.test(event.key)?event.key:null);
  if(key){event.preventDefault();press(key);}
});
document.querySelector('#help-toggle').addEventListener('click',event=>{
  const guide=document.querySelector('#guide');guide.hidden=!guide.hidden;
  event.currentTarget.setAttribute('aria-expanded',String(!guide.hidden));
});
const frame=document.querySelector('.calculator-frame');
function size(){const scale=Math.min(1,document.querySelector('.calculator-stage').clientWidth/940);frame.style.width=`${940*scale}px`;frame.style.height=`${574*scale}px`;document.querySelector('.calculator').style.transform=`scale(${scale})`;}
new ResizeObserver(size).observe(document.querySelector('.calculator-stage'));size();render();
