import {complexUnary,complexBinary} from './complex.js';
import {D, PI, unary, power, combinatorial} from './math.js';
// A small expression grammar, never JavaScript. No properties, assignments or calls outside this list.
export function compileExpression(source,parameters={},mode='RAD',complexMode=false) {
  if(typeof source!=='string'||source.length>2000)throw Error('Enter an expression of at most 2000 characters.');
  const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-zA-Z][a-zA-Z0-9_]*|\*\*|[+*/^(),-]|\S/g)||[];
  if(tokens.length>512)throw Error('Expression is too complex.');
  let pos=0,depth=0;
  const constants={pi:PI,e:new D(1).exp(),...parameters};
  const functions={sqrt:'SQRT',abs:'ABS',exp:'EXP',ln:'LN',log:'LOG',log10:'LOG',sin:'SIN',cos:'COS',tan:'TAN',asin:'ASIN',acos:'ACOS',atan:'ATAN',sinh:'SINH',cosh:'COSH',tanh:'TANH',asinh:'ASINH',acosh:'ACOSH',atanh:'ATANH',floor:null,ceil:null,int:'INT',frac:'FRAC',factorial:'FACTORIAL',square:'SQUARE',recip:'RECIP',pow10:'POW10',hms:'HMS',hours:'HOURS',rad:'TO_RAD',deg:'TO_DEG',pow:'POWER',perm:'PERMUTE',comb:'COMBINE',complex:'COMPLEX'};
  function expression(min=0) {
    if(++depth>64)throw Error('Expression nesting is too deep.');
    let t=tokens[pos++],node;
    if(t==='+'||t==='-')node={op:'unary'+t,a:expression(3)};
    else if(t==='('){node=expression();if(tokens[pos++]!==')')throw Error('Missing closing parenthesis.');}
    else if(t&&/^(?:\d|\.)/.test(t))node={value:new D(t)};
    else if(t==='x')node={variable:true};
    else if(t==='i'&&complexMode)node={imaginary:true};
    else if(Object.hasOwn(constants,t))node={value:new D(constants[t])};
    else if(Object.hasOwn(functions,t)&&tokens[pos++]==='('){node={fn:t,a:expression()};if(['pow','perm','comb','complex'].includes(t)){if(tokens[pos++]!==',')throw Error('Function needs two arguments.');node.b=expression();}if(tokens[pos++]!==')')throw Error('Function needs one argument and a closing parenthesis.');}
    else throw Error('Unknown value or function: '+(t||'end of expression'));
    while(pos<tokens.length){const op=tokens[pos],prec={'+':1,'-':1,'*':2,'/':2,'^':4,'**':4}[op];if(!prec||prec<min)break;pos++;node={op,a:node,b:expression(prec+(prec===4?0:1))};}
    depth--;return node;
  }
  const tree=expression();if(pos!==tokens.length)throw Error('Unexpected token: '+tokens[pos]);
  function evalNode(n,x) {
    if(n.value)return n.value;if(n.variable)return x;
    const a=evalNode(n.a,x);
    if(n.fn==='pow')return power(a,evalNode(n.b,x));
    if(n.fn==='perm'||n.fn==='comb')return combinatorial(a,evalNode(n.b,x),n.fn==='comb');
    if(n.fn==='complex')throw Error('Enable complex mode to use complex().');
    if(n.fn)return n.fn==='floor'?a.floor():n.fn==='ceil'?a.ceil():unary[functions[n.fn]](a,mode);
    if(n.op==='unary-')return a.neg();if(n.op==='unary+')return a;
    const b=evalNode(n.b,x);
    return n.op==='+'?a.plus(b):n.op==='-'?a.minus(b):n.op==='*'?a.mul(b):n.op==='/'?a.div(b):power(a,b);
  }
  function evalComplex(n,x) {
    if(n.value)return [n.value,new D(0)];if(n.variable)return [x,new D(0)];if(n.imaginary)return [new D(0),new D(1)];
    const a=evalComplex(n.a,x);
    if(n.fn==='complex')return [a[0],evalComplex(n.b,x)[0]];
    if(n.fn==='perm'||n.fn==='comb')return [combinatorial(a[0],evalComplex(n.b,x)[0],n.fn==='comb'),a[1]];
    if(n.fn==='pow')return complexBinary('POWER',a,evalComplex(n.b,x));
    if(n.fn){if(['floor','ceil','int','frac','factorial','hms','hours','rad','deg'].includes(n.fn))return [n.fn==='floor'?a[0].floor():n.fn==='ceil'?a[0].ceil():unary[functions[n.fn]](a[0],mode),a[1]];return complexUnary(functions[n.fn],a);}
    if(n.op==='unary-')return a.map(v=>v.neg());if(n.op==='unary+')return a;
    return complexBinary(n.op==='^'||n.op==='**'?'POWER':n.op,a,evalComplex(n.b,x));
  }
  return value=> {const y=complexMode?evalComplex(tree,new D(value))[0]:evalNode(tree,new D(value));if(!y.isFinite())throw Error('Function is undefined at x = '+value);return y;};
}
export function solveRoot(fn,a,b) {
  a=new D(a);b=new D(b);if(a.eq(b))b=b.plus(D.max('0.01',a.abs().mul('0.01')));
  const output=(x,y)=>{x=x.toSignificantDigits(10);return {x,y:y.toSignificantDigits(10),residual:fn(x)};};
  let fa=fn(a),fb=fn(b);
  let best=fa.abs().lt(fb.abs())?{x:a,y:b,residual:fa}:{x:b,y:a,residual:fb};
  const fail=()=>{const e=Error('8');e.best=output(best.x,best.y);throw e;};if(fa.isZero())return output(a,a);if(fb.isZero())return output(b,a);
  for(let k=0;k<150;k++) {
    const bracket=fa.mul(fb).lt(0);
    let next=fb.eq(fa)?b.plus(D.max(1,b.abs().mul('0.1'))):b.minus(fb.mul(b.minus(a)).div(fb.minus(fa)));
    if(bracket&&(next.lte(D.min(a,b))||next.gte(D.max(a,b))||k%4===3))next=a.plus(b).div(2);
    if(!next.isFinite()||next.abs().gt('1e99'))fail();
    let f;try{f=fn(next);}catch{fail();}
    if(f.abs().lt(best.residual.abs()))best={x:next,y:b,residual:f};
    if(f.isZero()||(f.abs().lte('1e-20')&&next.minus(b).abs().lte(D.max(1,next.abs()).mul('1e-10'))))return output(next,b);
    if(next.eq(b))fail();
    if(bracket&&fa.mul(f).lt(0)){b=next;fb=f;}else{a=b;fa=fb;b=next;fb=f;}
  }
  fail();
}
// Adaptive Gauss–Kronrod 15/7, with a bounded subdivision budget and error estimate.
export function integrate(fn,lower,upper,tolerance='1e-8',format=null) {
  let a=new D(lower),b=new D(upper),sign=new D(1);if(a.gt(b)){[a,b]=[b,a];sign=sign.neg();}
  if(a.eq(b))return {value:new D(0),error:new D(0)};
  const nodes=['.9914553711208126392','.9491079123427585245','.8648644233597690728','.7415311855993944399','.5860872354676911303','.4058451513773971669','.2077849550078984676','0'];
  const weights=['.0229353220105292250','.0630920926299785533','.1047900103222501838','.1406532597155259187','.1690047266392679028','.1903505780647854099','.2044329400752988924','.2094821410847278280'];
  const gauss=['.1294849661688696933','.2797053914892766679','.3818300505051189450','.4179591836734693878'];
  let evaluations=0;
  function panel(left,right) {
    const m=left.plus(right).div(2),h=right.minus(left).div(2);let k=new D(0),g=new D(0),uncertainty=new D(0);
    for(let i=0;i<8;i++){const offset=h.mul(nodes[i]);const samples=i===7?[fn(m)]:[fn(m.minus(offset)),fn(m.plus(offset))];const sum=samples.reduce((s,v)=>s.plus(v),new D(0));if(format){for(const v of samples){const exponent=format.mode==='FIX'?0:v.isZero()?-99:v.abs().e;uncertainty=uncertainty.plus(new D(10).pow(exponent-(format.integralDigits??format.digits)).mul('0.5').mul(weights[i]));}}evaluations+=i===7?1:2;k=k.plus(sum.mul(weights[i]));if(i%2===1)g=g.plus(sum.mul(gauss[(i-1)/2]));}
    return {left,right,value:k.mul(h),error:k.minus(g).mul(h).abs(),uncertainty:uncertainty.mul(h).abs()};
  }
  let panels=[panel(a,b)],value=panels[0].value,error=panels[0].error,uncertainty=panels[0].uncertainty;
  const tol=new D(tolerance);
  while(error.gt(tol.mul(D.max(format&&format.mode!=='FIX'?'1e-99':1,value.abs())))) {
    if(evaluations>30000)throw Error('Integration did not converge within the evaluation limit.');
    panels.sort((p,q)=>q.error.comparedTo(p.error));const old=panels.shift(),m=old.left.plus(old.right).div(2);
    if(m.eq(old.left)||m.eq(old.right))throw Error('Integration interval cannot be subdivided further.');
    const l=panel(old.left,m),r=panel(m,old.right);value=value.minus(old.value).plus(l.value).plus(r.value);error=D.max(0,error.minus(old.error).plus(l.error).plus(r.error));uncertainty=uncertainty.minus(old.uncertainty).plus(l.uncertainty).plus(r.uncertainty);panels.push(l,r);
  }
  return {value:value.mul(sign),error:error.plus(uncertainty)};
}
