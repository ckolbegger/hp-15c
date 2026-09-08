import Decimal from 'decimal.js';
export const D = Decimal.clone({precision:40, rounding:Decimal.ROUND_HALF_UP});
export const PI = D.acos(-1);
export const unary = {
  SQRT: x => x.sqrt(),
  SQUARE: x => x.mul(x),
  RECIP: x => x.isZero() ? new D(NaN) : new D(1).div(x),
  EXP: x => x.gt(240) ? new D(Infinity) : x.lt(-240) ? new D(0) : x.exp(),
  POW10: x => x.gt(100) ? new D(Infinity) : x.lt(-100) ? new D(0) : new D(10).pow(x),
  LN: x => x.lte(0) ? new D(NaN) : x.ln(),
  LOG: x => x.lte(0) ? new D(NaN) : x.log(10),
  ABS: x => x.abs(),
  INT: x => x.trunc(),
  FRAC: x => x.minus(x.trunc()),
};
export function power(y,x) {
  if ((y.isZero() && x.lte(0)) || (y.isNeg() && !x.isInteger())) return new D(NaN);
  if (y.isZero()) return new D(0);
  const logMagnitude = y.abs().ln().mul(x);
  const sign = y.isNeg() && x.mod(2).abs().eq(1) ? -1 : 1;
  if (logMagnitude.gt(240)) return new D(sign*Infinity);
  if (logMagnitude.lt(-240)) return new D(0);
  return y.abs().pow(x).mul(sign);
}

// Original Advanced Functions Handbook, pp154–155: the HP's internal radian pi.
export const HP_PI = new D('3.141592653590');
export function angleHalfTurn(mode) { return mode==='DEG'?new D(180):mode==='GRAD'?new D(200):HP_PI; }
export function trig(x,mode,fn) {
  const half=angleHalfTurn(mode), reduced=x.mod(half.mul(2));
  const quadrant=reduced.div(half.div(2));
  if(quadrant.isInteger()) {
    const q=((quadrant.toNumber()%4)+4)%4;
    if(fn==='sin')return new D([0,1,0,-1][q]);
    if(fn==='cos')return new D([1,0,-1,0][q]);
    return new D(q%2 ? (reduced.isNeg()?-Infinity:Infinity) : 0);
  }
  return reduced.div(half).mul(PI)[fn]();
}
Object.assign(unary,{
  SIN:(x,mode)=>trig(x,mode,'sin'), COS:(x,mode)=>trig(x,mode,'cos'), TAN:(x,mode)=>trig(x,mode,'tan'),
  ASIN:(x,mode)=>mode==='RAD'?x.asin():x.asin().div(PI).mul(angleHalfTurn(mode)),
  ACOS:(x,mode)=>mode==='RAD'?x.acos():x.acos().div(PI).mul(angleHalfTurn(mode)),
  ATAN:(x,mode)=>mode==='RAD'?x.atan():x.atan().div(PI).mul(angleHalfTurn(mode)),
  SINH:x=>x.abs().gt(240)?new D(x.isNeg()?-Infinity:Infinity):x.sinh(),
  COSH:x=>x.abs().gt(240)?new D(Infinity):x.cosh(),
  TANH:x=>x.abs().gt(50)?new D(x.isNeg()?-1:1):x.tanh(),
  ASINH:x=>x.asinh(), ACOSH:x=>x.acosh(), ATANH:x=>x.atanh(),
});

function decimalToHms(x) {
  const a=x.abs(), hours=a.trunc(), minutes=a.minus(hours).mul(60);
  return hours.plus(minutes.trunc().div(100)).plus(minutes.minus(minutes.trunc()).mul(60).div(10000)).mul(x.isNeg()?-1:1);
}
function hmsToDecimal(x) {
  const a=x.abs(), hours=a.trunc(), minutes=a.minus(hours).mul(100);
  return hours.plus(minutes.trunc().div(60)).plus(minutes.minus(minutes.trunc()).mul(100).div(3600)).mul(x.isNeg()?-1:1);
}
// NIST DLMF 5.11.1, 5.5.1 and 5.5.3: recurrence, Stirling series, reflection.
// At z>=40, the first omitted term is below 1e-23, well beyond ten-digit storage.
function positiveGamma(z) {
  let product=new D(1);
  while(z.lt(40)) { product=product.mul(z); z=z.plus(1); }
  let log=z.minus('0.5').mul(z.ln()).minus(z).plus(PI.mul(2).ln().div(2));
  const coefficients=[[1,12],[-1,360],[1,1260],[-1,1680],[1,1188],[-691,360360]];
  for(let i=0;i<coefficients.length;i++) {
    const [a,b]=coefficients[i]; log=log.plus(new D(a).div(b).div(z.pow(2*i+1)));
  }
  return log.exp().div(product);
}
function factorial(x) {
  if(x.isNeg()&&x.isInteger())return new D(NaN);
  if(x.gte(70))return new D(Infinity);
  // Even the closest representable noninteger to these poles is below HP range.
  if(x.lt(-200))return new D(0);
  if(x.isInteger()) {
    let product=new D(1); for(let k=2;k<=x.toNumber();k++)product=product.mul(k); return product;
  }
  const z=x.plus(1);
  return z.lt('0.5') ? PI.div(z.mod(2).mul(PI).sin().mul(positiveGamma(new D(1).minus(z)))) : positiveGamma(z);
}
Object.assign(unary,{
  HMS:decimalToHms, HOURS:hmsToDecimal,
  TO_RAD:x=>x.div(180).mul(PI), TO_DEG:x=>x.div(PI).mul(180),
  FACTORIAL:factorial,
});
export function coordinates(x,y,mode,operation) {
  if(operation==='RECT')return [x.mul(trig(y,mode,'cos')),x.mul(trig(y,mode,'sin'))];
  const radius=x.mul(x).plus(y.mul(y)).sqrt();
  let angle=radius.isZero()?new D(0):D.atan2(y,x);
  if(mode!=='RAD')angle=angle.div(PI).mul(angleHalfTurn(mode));
  return [radius,angle];
}
export function combinatorial(n,r,combination) {
  if(!n.isInteger()||!r.isInteger()||n.lt(0)||r.lt(0)||r.gt(n)||n.gte('1e10')||r.gte('1e10'))return new D(NaN);
  const k=combination?D.min(r,n.minus(r)):r;
  // Symmetry makes this a valid lower-bound overflow shortcut for combinations.
  if(k.gt(1000))return new D(Infinity);
  let result=new D(1);
  for(let i=0;i<k.toNumber();i++) {
    result=result.mul(n.minus(i)); if(combination)result=result.div(i+1);
    if(result.gt('9.999999999e99'))return new D(Infinity);
  }
  return result;
}
