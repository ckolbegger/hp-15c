import {Advanced} from './advanced.js';
import {descriptor} from './matrix.js';
import {formatNumber, roundDisplay, group} from './format.js';
import {shiftedKeys} from './bindings.js';
import {D, PI, unary, power, coordinates, combinatorial} from './math.js';

// Extra working precision; every stored result is rounded to the HP's ten digits.
const MAX = new D('9.999999999e99');
const MIN = new D('1e-99');
export class Calculator {
  constructor(saved) {
    this.stack = ['0', '0', '0', '0']; // X, Y, Z, T
    this.lastX = '0';
    this.entry = null;
    this.lift = false;
    this.error = false;
    this.errorCode = 0;
    this.overflow = false;
    this.on = true;
    this.shift = null;
    this.pending = null;
    this.angleMode = 'DEG';
    this.format = {mode:'FIX',digits:4};
    if (saved && Array.isArray(saved.stack) && saved.stack.length === 4) {
      try {
        const values = [...saved.stack, saved.lastX];
        if (values.every(v => descriptor(v) || (new D(v).isFinite() && new D(v).abs().lte(MAX)))) {
          this.stack = saved.stack.map(v => descriptor(v)?v:new D(v).toString());
          this.lastX = descriptor(saved.lastX)?saved.lastX:new D(saved.lastX).toString();
          this.lift = !!saved.lift;
          this.on = saved.on !== false;
          if (['DEG','RAD','GRAD'].includes(saved.angleMode)) this.angleMode=saved.angleMode;
          if (['FIX','SCI','ENG'].includes(saved.format?.mode) && Number.isInteger(saved.format.digits) && saved.format.digits>=0 && saved.format.digits<=9 && (saved.format.integralDigits===undefined||(Number.isInteger(saved.format.integralDigits)&&saved.format.integralDigits>=-6&&saved.format.integralDigits<=9))) this.format={...saved.format};
        }
      } catch { /* Ignore incompatible saved sessions. */ }
    }
    this.advanced = new Advanced(this,saved);
    this.overflow=this.flags[9];
  }
  save() { return {advanced:this.advanced.save(), stack: this.stack, lastX: this.lastX, lift: this.lift, on: this.on, angleMode:this.angleMode, format:this.format}; }
  push() { this.imaginary = [this.imaginary[0],this.imaginary[0],this.imaginary[1],this.imaginary[2]]; this.stack = [this.stack[0], this.stack[0], this.stack[1], this.stack[2]]; }
  entryValue() {
    if (this.entry === null) return new D(this.stack[0]);
    const [mantissa, exponent] = this.entry.split('e');
    return new D(mantissa === '-' ? '-0' : mantissa).mul(new D(10).pow(Number(exponent || 0)));
  }
  sync() { this.stack[0] = this.entryValue().toString(); }
  begin() {
    if (this.entry !== null) return;
    if (this.lift) this.push();
    if (!this.preserveImaginary) this.imaginary[0]='0';
    this.preserveImaginary=false;
    this.entry = '0';
  }
  finish() {
    if (this.entry !== null) {
      this.stack[0] = this.normalize(this.entryValue());
      this.entry = null;
    }
  }
  normalize(value) {
    const n = new D(value).toSignificantDigits(10);
    if (n.abs().gt(MAX)) { this.overflow = true; return n.isNeg() ? MAX.neg().toString() : MAX.toString(); }
    return n.abs().lt(MIN) ? '0' : n.toString();
  }
  press(key) {
    this.inspection=null;this.message='';this.request=null;
    if(!this.error)this.errorCode=0;
    const wasEntry=this.entry!==null;
    const result=this._press(key);
    if(this.lastAction==='CLX'||(this.lastAction==='BACK'&&!wasEntry&&!this.overflow))this.preserveImaginary=true;
    else if(result&&this.lift&&this.entry===null&&this.lastAction!=='IM_VIEW'&&this.lastAction!=='PREFIX')this.preserveImaginary=false;
    this.flags[9]=this.overflow;
    return result;
  }
  _press(key) {
    // Errors consume their acknowledgement key; overflow is a persistent flag.
    if (this.on && this.error) { this.error = false; return true; }
    if (key === 'ON') { this.on = !this.on; this.shift = null; this.pending = null; this.overflow = false; return true; }
    if (!this.on) return false;
    if (this.overflow && key === 'BACK') { this.overflow = false; return true; }
    const raw=this.advanced.raw(key); if(raw!==null)return raw;
    if (key === 'f' || key === 'g') { this.shift = key; return true; }
    if (this.shift) {
      const shifted = this.shift;
      this.shift = null;
      key = this.user&&shifted==='f'&&['SQRT','EXP','POW10','POWER','RECIP'].includes(key)?key:shiftedKeys[shifted][key];
      if (!key) return false;
    }
    if (this.pending) {
      const pending=this.pending; this.pending=null;
      if (['FIX','SCI','ENG'].includes(pending) && (/^\d$/.test(key)||key==='TAN')) {
        this.finish(); const digits=key==='TAN'&&!descriptor(this.index)?new D(this.index).trunc().toNumber():Number(key); if(!Number.isFinite(digits)||digits>9){this.error=true;this.errorCode=3;return true;} this.format=digits<0?{mode:pending,digits:0,integralDigits:Math.max(-6,digits)}:{mode:pending,digits}; return true;
      }
      if (['HYP','AHYP'].includes(pending) && ['SIN','COS','TAN'].includes(key)) key=(pending==='AHYP'?'A':'')+key+'H';
      else return false;
    }
    if (['FIX','SCI','ENG','HYP','AHYP'].includes(key)) { this.pending=key; return true; }
    if (['DEG','RAD','GRAD'].includes(key)) { this.finish(); this.angleMode=key; return true; }
    this.lastAction=key;
    const advanced=this.advanced.handle(key); if(advanced!==null)return advanced;
    if (/^\d$/.test(key)) {
      this.begin();
      if (this.entry.includes('e')) {
        const [m,e] = this.entry.split('e');
        const negative = e.startsWith('-');
        const digits = e.replace('-','');
        this.entry = m+'e'+(negative?'-':'')+(digits+key).slice(-2);
      } else {
        const digits = this.entry.replace(/[-.]/g,'');
        if (digits.length >= 10) return true;
        if (this.entry === '0' || this.entry === '-0') this.entry = (this.entry.startsWith('-')?'-':'')+key;
        else this.entry += key;
      }
      this.sync(); return true;
    }
    if (key === '.') {
      this.begin();
      if (!this.entry.includes('.') && !this.entry.includes('e')) this.entry += '.';
      this.sync(); return true;
    }
    if (key === 'CHS') {
      if (this.entry !== null) {
        if (this.entry.includes('e')) {
          const [m,e] = this.entry.split('e');
          this.entry = m+'e'+(e.startsWith('-')?e.slice(1):'-'+e);
        } else this.entry = this.entry.startsWith('-')?this.entry.slice(1):'-'+this.entry;
        this.sync();
      } else { this.stack[0] = new D(this.stack[0]).neg().toString(); this.lift = true; }
      return true;
    }
    if (key === 'EEX') {
      if(descriptor(this.stack[0])&&this.entry===null){this.error=true;this.errorCode=1;return true;}
      if (this.entry?.includes('e')) return true;
      const value = this.entryValue().abs();
      if ((!value.isZero() && value.lt('0.000001')) || value.gte('1e7')) return true;
      if (this.entry === null) {
        if (this.lift) this.push();
        if(!this.preserveImaginary)this.imaginary[0]='0';
        this.preserveImaginary=false;this.entry = '1'; this.lift = false;
      } else if (value.isZero()) this.entry = '1';
      this.entry += 'e00'; this.sync(); return true;
    }
    if (key === 'BACK') {
      if (this.entry !== null) {
        if (this.entry.includes('e')) {
          const [m,e] = this.entry.split('e');
          const negative = e.startsWith('-');
          const digits = e.replace('-','');
          this.entry = digits === '00' ? m : m+'e'+(negative?'-':'')+'0'+digits[0];
        } else {
          this.entry = this.entry.slice(0,-1);
          if (this.entry === '' || this.entry === '-') this.entry = '0';
        }
        this.sync();
      } else { this.stack[0] = '0'; this.lift = false; }
      return true;
    }
    if (key === 'CLX') { this.entry = null; this.stack[0] = '0'; this.lift = false; return true; }
    if (key === 'ENTER') { this.finish(); this.push(); this.lift = false; return true; }
    if (['+','-','*','/'].includes(key)) {
      this.finish();
      const x = new D(this.stack[0]), y = new D(this.stack[1]);
      if (key === '/' && x.isZero()) { this.error = true; return true; }
      const result = key === '+' ? y.plus(x) : key === '-' ? y.minus(x) : key === '*' ? y.mul(x) : y.div(x);
      this.lastX = x.toString();
      this.stack = [this.normalize(result), this.stack[2], this.stack[3], this.stack[3]];
      this.lift = true; return true;
    }
    if (['POWER','PERCENT','DELTA_PERCENT','PERMUTE','COMBINE'].includes(key)) {
      this.finish();
      const x = new D(this.stack[0]), y = new D(this.stack[1]);
      const result = ['PERMUTE','COMBINE'].includes(key) ? combinatorial(y,x,key==='COMBINE') : key === 'POWER' ? power(y,x) : key === 'PERCENT' ? y.mul(x).div(100) : y.isZero() ? new D(NaN) : x.minus(y).div(y).mul(100);
      if (result.isNaN()) { this.error = true; return true; }
      this.lastX = x.toString(); this.stack[0] = this.normalize(result);
      if (['POWER','PERMUTE','COMBINE'].includes(key)) this.stack = [this.stack[0],this.stack[2],this.stack[3],this.stack[3]];
      this.lift = true; return true;
    }
    if (key === 'POLAR' || key === 'RECT') {
      this.finish(); const x=new D(this.stack[0]), y=new D(this.stack[1]);
      const result=coordinates(x,y,this.angleMode,key);
      this.lastX=x.toString(); this.stack[0]=this.normalize(result[0]); this.stack[1]=this.normalize(result[1]); this.lift=true; return true;
    }
    if (key === 'PI') {
      this.finish(); if (this.lift) this.push(); this.stack[0] = this.normalize(PI);if(!this.preserveImaginary)this.imaginary[0]='0'; this.lift = true; return true;
    }
    if (key === 'RND') {
      this.finish(); this.lastX = this.stack[0];this.lastImaginary=this.imaginary[0];
      this.stack[0] = this.normalize(roundDisplay(new D(this.stack[0]),this.format));
      this.lift = true; return true;
    }
    if (key === 'ROLLUP') {
      this.finish(); this.stack = [this.stack[3],this.stack[0],this.stack[1],this.stack[2]]; this.lift = true; return true;
    }
    if (Object.hasOwn(unary, key)) {
      this.finish();
      const x = new D(this.stack[0]);
      const result = unary[key](x,this.angleMode);
      if (result.isNaN()) { this.error = true; return true; }
      this.lastX = x.toString();this.lastImaginary=this.imaginary[0];
      this.stack[0] = this.normalize(result); this.lift = true; return true;
    }
    if (key === 'SWAP') {
      this.finish(); [this.stack[0], this.stack[1]] = [this.stack[1], this.stack[0]]; this.lift = true; return true;
    }
    if (key === 'ROLL') {
      this.finish(); this.stack = [this.stack[1], this.stack[2], this.stack[3], this.stack[0]]; this.lift = true; return true;
    }
    if (key === 'LASTX') {
      this.finish(); if (this.lift) this.push(); this.stack[0] = this.lastX; this.lift = true; return true;
    }
    return false;
  }
  completeNumerical(operation,result,bounds) {
    if(operation==='SOLVE')this.stack=[this.normalize(result.x),this.normalize(result.y),this.normalize(result.residual),this.stack[3]];
    else this.stack=[this.normalize(result.value),this.normalize(result.error),bounds.x,bounds.y];
    this.imaginary=Array(4).fill('0');this.flags[9]=this.overflow;
    this.entry=null;this.lift=true;
  }
  display() {
    const display=this.displayValue();
    if(this.radixComma)display.mantissa=display.mantissa.replace(/[.,]/g,c=>c==='.'?',':'.');
    return display;
  }
  displayValue() {
    if (!this.on) return {mantissa:'', exponent:'', negative:false};
    if (this.error) return {mantissa:'Error '+this.errorCode, exponent:'', negative:false};
    if(this.inspection)return {...this.inspection};
    if(descriptor(this.stack[0])&&this.entry===null){const m=this.matrices[this.stack[0][1]];return {mantissa:this.stack[0][1]+(m.lu?'--':'')+' '+m.rows+' '+m.cols,exponent:'',negative:false};}
    if (this.entry !== null) {
      const [m,e] = this.entry.split('e');
      let mantissa = m.replace('-','');
      if (e !== undefined) {
        // The exponent occupies positions 8–10; hidden mantissa digits stay in X.
        let positions = 0;
        mantissa = [...mantissa].filter(c => c === '.' ? positions <= 7 : ++positions <= 7).join('');
      } else mantissa = group(mantissa);
      return {mantissa:mantissa+(mantissa.includes('.')?'':'.'), exponent:e===undefined?'':e.padStart(2,'0'), negative:m.startsWith('-')};
    }
    return formatNumber(new D(this.stack[0]),this.format);
  }
}
