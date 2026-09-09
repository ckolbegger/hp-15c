import {D, PI, trig} from './math.js';
const z=(r,i=0)=>[new D(r),new D(i)];
export const add=(a,b)=>z(a[0].plus(b[0]),a[1].plus(b[1]));
export const neg=a=>z(a[0].neg(),a[1].neg());
export const sub=(a,b)=>add(a,neg(b));
export const mul=(a,b)=>z(a[0].mul(b[0]).minus(a[1].mul(b[1])),a[0].mul(b[1]).plus(a[1].mul(b[0])));
export function div(a,b) { const d=b[0].pow(2).plus(b[1].pow(2)); if(d.isZero())throw Error('0'); return z(a[0].mul(b[0]).plus(a[1].mul(b[1])).div(d),a[1].mul(b[0]).minus(a[0].mul(b[1])).div(d)); }
const abs=a=>a[0].pow(2).plus(a[1].pow(2)).sqrt();
const log=a=> { if(abs(a).isZero())throw Error('0'); return z(abs(a).ln(),D.atan2(a[1],a[0])); };
// Bound intermediate exponentials beyond the representable HP component range.
const bounded=x=>D.max(-500,D.min(500,x));
const sn=x=>trig(x,'RAD','sin'),cs=x=>trig(x,'RAD','cos');
const exp=a=> {const e=bounded(a[0]).exp();return z(e.mul(cs(a[1])),e.mul(sn(a[1])));};
const sqrt=a=> {const m=abs(a);if(m.isZero())return z(0);if(a[0].gte(0)){const r=m.plus(a[0]).div(2).sqrt();return z(r,a[1].div(r.mul(2)));}const i=m.minus(a[0]).div(2).sqrt();return z(a[1].abs().div(i.mul(2)),i.mul(a[1].lt(0)?-1:1));};
const sin=a=>z(sn(a[0]).mul(bounded(a[1]).cosh()),cs(a[0]).mul(bounded(a[1]).sinh()));
const cos=a=>z(cs(a[0]).mul(bounded(a[1]).cosh()),sn(a[0]).mul(bounded(a[1]).sinh()).neg());
const sinh=a=>z(bounded(a[0]).sinh().mul(cs(a[1])),bounded(a[0]).cosh().mul(sn(a[1])));
const cosh=a=>z(bounded(a[0]).cosh().mul(cs(a[1])),bounded(a[0]).sinh().mul(sn(a[1])));
const asin=a=>{
  if(a[0].isZero())return z(0,a[1].asinh());
  if(a[1].isZero()&&a[0].abs().lte(1))return z(a[0].asin());
  const alpha=abs(add(a,z(1))).plus(abs(sub(a,z(1)))).div(2);
  return z(D.max(-1,D.min(1,a[0].div(alpha))).asin(),D.max(1,alpha).acosh().mul(a[1].isZero()?(a[0].gt(0)?-1:1):(a[1].lt(0)?-1:1)));
};
const atan=a=>{
  const denominator=a[0].pow(2).plus(a[1].minus(1).pow(2)),numerator=a[0].pow(2).plus(a[1].plus(1).pow(2));
  if(denominator.isZero()||numerator.isZero())throw Error('0');
  let real=D.atan2(a[0].mul(2),new D(1).minus(a[0].pow(2)).minus(a[1].pow(2))).div(2);
  if(a[0].isZero()&&a[1].lt(-1))real=PI.div(-2);
  return z(real,numerator.div(denominator).ln().div(4));
};
export function complexUnary(key,a) {
  switch(key) {
    case 'SQRT': return sqrt(a);
    case 'SQUARE': return mul(a,a);
    case 'RECIP': return div(z(1),a);
    case 'ABS': return z(abs(a));
    case 'LN': return log(a);
    case 'LOG': return div(log(a),z(new D(10).ln()));
    case 'EXP': return exp(a);
    case 'POW10': return exp(mul(a,z(new D(10).ln())));
    case 'SIN': return sin(a);
    case 'COS': return cos(a);
    case 'TAN': {if(a[1].abs().gt(120))return z(0,a[1].lt(0)?-1:1);return div(sin(a),cos(a));}
    case 'SINH': return sinh(a);
    case 'COSH': return cosh(a);
    case 'TANH': {if(a[0].abs().gt(120))return z(a[0].lt(0)?-1:1);return div(sinh(a),cosh(a));}
    case 'ASIN': return asin(a);
    case 'ACOS': return sub(z(PI.div(2)),asin(a));
    case 'ATAN': return atan(a);
    case 'ASINH': return mul(z(0,-1),asin(mul(z(0,1),a)));
    case 'ACOSH': {const alpha=abs(add(a,z(1))).plus(abs(sub(a,z(1)))).div(2);return z(D.max(1,alpha).acosh(),D.max(-1,D.min(1,a[0].div(alpha))).acos().mul(a[1].lt(0)?-1:1));}
    case 'ATANH': return mul(z(0,-1),atan(mul(z(0,1),a)));
    default: throw Error('1');
  }
}
export function complexBinary(key,y,x) {
  if(key==='+')return add(y,x);
  if(key==='-')return sub(y,x);
  if(key==='*')return mul(y,x);
  if(key==='/')return div(y,x);
  if(key==='POWER') {
    if(abs(y).isZero()) {if(x[0].gt(0))return z(0);throw Error('0');}
    return exp(mul(x,log(y)));
  }
  throw Error('1');
}
