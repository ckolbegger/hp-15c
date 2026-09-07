import Decimal from 'decimal.js';

// Extra working precision; every stored result is rounded to the HP's ten digits.
const D = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
const MAX = new D('9.999999999e99');
const MIN = new D('1e-99');
export class Calculator {
  constructor(saved) {
    this.stack = ['0', '0', '0', '0']; // X, Y, Z, T
    this.lastX = '0';
    this.entry = null;
    this.lift = false;
    this.error = false;
    this.overflow = false;
    this.on = true;
    this.shift = null;
    if (saved && Array.isArray(saved.stack) && saved.stack.length === 4) {
      try {
        const values = [...saved.stack, saved.lastX];
        if (values.every(v => new D(v).isFinite() && new D(v).abs().lte(MAX))) {
          this.stack = saved.stack.map(v => new D(v).toString());
          this.lastX = new D(saved.lastX).toString();
          this.lift = !!saved.lift;
          this.on = saved.on !== false;
        }
      } catch { /* Ignore incompatible saved sessions. */ }
    }
  }
  save() { return {stack: this.stack, lastX: this.lastX, lift: this.lift, on: this.on}; }
  push() { this.stack = [this.stack[0], this.stack[0], this.stack[1], this.stack[2]]; }
  entryValue() {
    if (this.entry === null) return new D(this.stack[0]);
    const [mantissa, exponent] = this.entry.split('e');
    return new D(mantissa === '-' ? '-0' : mantissa).mul(new D(10).pow(Number(exponent || 0)));
  }
  sync() { this.stack[0] = this.entryValue().toString(); }
  begin() {
    if (this.entry !== null) return;
    if (this.lift) this.push();
    this.entry = '0';
    this.lift = false;
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
    // Errors consume their acknowledgement key; overflow is a persistent flag.
    if (this.on && this.error) { this.error = false; return true; }
    if (key === 'ON') { this.on = !this.on; this.shift = null; this.overflow = false; return true; }
    if (!this.on) return false;
    if (this.overflow && key === 'BACK') { this.overflow = false; return true; }
    if (key === 'f' || key === 'g') { this.shift = key; return true; }
    if (this.shift) {
      const shifted = this.shift;
      this.shift = null;
      if (shifted === 'g' && key === 'BACK') key = 'CLX';
      else if (shifted === 'g' && key === 'ENTER') key = 'LASTX';
      else return false;
    }
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
      if (this.entry?.includes('e')) return true;
      const value = this.entryValue().abs();
      if ((!value.isZero() && value.lt('0.000001')) || value.gte('1e7')) return true;
      if (this.entry === null) {
        if (this.lift) this.push();
        this.entry = '1'; this.lift = false;
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
  display() {
    if (!this.on) return {mantissa:'', exponent:'', negative:false};
    if (this.error) return {mantissa:'Error 0', exponent:'', negative:false};
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
    const n = new D(this.stack[0]);
    const a = n.abs();
    const fixed = a.toFixed(4);
    if ((a.gt(0) && new D(fixed).isZero()) || fixed.split('.')[0].length > 10) {
      let [m,e] = a.toExponential(4).split('e');
      // FIX rounding cannot invent exponent 100 at the finite upper limit.
      if (Number(e) > 99) { m = '9.9999'; e = '99'; }
      return {mantissa:m, exponent:(Number(e)<0?'-':'')+String(Math.abs(Number(e))).padStart(2,'0'), negative:n.isNeg()&&!n.isZero()};
    }
    const places = Math.max(0, Math.min(4, 10-fixed.split('.')[0].length));
    let m = a.toFixed(places);
    if (!m.includes('.')) m += '.';
    return {mantissa:group(m), exponent:'', negative:n.isNeg()&&!n.isZero()};
  }
}

function group(mantissa) {
  const [integer, fraction] = mantissa.split('.');
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (fraction === undefined ? '' : '.'+fraction);
}
