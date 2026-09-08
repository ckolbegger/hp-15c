import {D} from './math.js';
const MAX = new D('9.999999999e99');
export function group(mantissa) {
  const [integer,fraction]=mantissa.split('.');
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(fraction===undefined?'':'.'+fraction);
}
function usesScientific(n,{mode,digits}) {
  return mode!=='FIX' || (n.abs().gt(0)&&n.toDecimalPlaces(digits).isZero()) || n.abs().toFixed(digits).split('.')[0].length>10;
}
export function roundDisplay(n,format) {
  return usesScientific(n,format) ? n.toSignificantDigits(format.digits+1) : n.toDecimalPlaces(format.digits);
}
export function formatNumber(n,format) {
  const {mode,digits}=format, a=n.abs(), negative=n.lt(0);
  if(!usesScientific(n,format)) {
    const integerLength=a.toFixed(digits).split('.')[0].length;
    let mantissa=a.toFixed(Math.min(digits,10-integerLength));
    if(!mantissa.includes('.'))mantissa+='.';
    return {mantissa:group(mantissa),exponent:'',negative};
  }
  // Round at the requested precision BEFORE hiding the last three digits.
  const rounded=D.min(a.toSignificantDigits(digits+1),MAX);
  const e=rounded.isZero()?0:rounded.e;
  const exponent=mode==='ENG'?Math.floor(e/3)*3:e;
  const mantissaNumber=rounded.div(new D(10).pow(exponent));
  const integerLength=mantissaNumber.trunc().toString().length;
  const places=Math.max(0,digits+1-integerLength);
  let mantissa=mantissaNumber.toFixed(places,D.ROUND_DOWN);
  let count=0;
  mantissa=[...mantissa].filter(c=>c==='.'?count<=7:++count<=7).join('');
  if(!mantissa.includes('.'))mantissa+='.';
  return {mantissa,exponent:(exponent<0?'-':'')+String(Math.abs(exponent)).padStart(2,'0'),negative};
}
