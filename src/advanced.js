import {D,unary,coordinates} from './math.js';
import {complexUnary,complexBinary} from './complex.js';
import * as M from './matrix.js';
import {formatNumber} from './format.js';
const letters={SQRT:'A',EXP:'B',POW10:'C',POWER:'D',RECIP:'E',A:'A',B:'B',C:'C',D:'D',E:'E'};
const scalar=v=>{if(M.descriptor(v))throw Error('1');return new D(v);};
const arithmetic=(a,b,op)=>{if(op==='/'&&b.isZero())throw Error('0');return op==='+'?a.plus(b):op==='-'?a.minus(b):op==='*'?a.mul(b):a.div(b);};
export class Advanced {
  constructor(c,saved) {
    this.c=c;
    c.registers=Array(66).fill('0');c.index='0';c.registerLimit=19;c.seed='0';c.flags=Array(10).fill(false);c.imaginary=Array(4).fill('0');c.lastImaginary='0';c.user=false;c.radixComma=false;c.resultMatrix='A';c.matrices=Object.fromEntries('ABCDE'.split('').map(k=>[k,M.empty()]));c.message='';c.inspection=null;c.preserveImaginary=false;
    if(saved?.advanced) {
      const a=saved.advanced;
      try {
        const valid=v=>M.descriptor(v)||(typeof v==='string'&&new D(v).isFinite()&&new D(v).abs().lte('9.999999999e99'));
        if(!Array.isArray(a.registers)||a.registers.length!==66||!a.registers.every(valid)||!valid(a.index)||!Number.isInteger(a.registerLimit)||a.registerLimit<1||a.registerLimit>65)throw Error();
        if(!Array.isArray(a.imaginary)||a.imaginary.length!==4||!a.imaginary.every(v=>!M.descriptor(v)&&valid(v))||!valid(a.lastImaginary)||M.descriptor(a.lastImaginary))throw Error();
        if(!Array.isArray(a.flags)||a.flags.length!==10||!a.flags.every(v=>typeof v==='boolean')||!/^\d{1,10}$/.test(a.seed)||!Object.hasOwn(c.matrices,a.resultMatrix))throw Error();
        let elements=0;
        for(const name of 'ABCDE') {const m=a.matrices[name];if(!m||!Number.isInteger(m.rows)||!Number.isInteger(m.cols)||m.rows<0||m.cols<0||m.rows*m.cols>64||!Array.isArray(m.data)||m.data.length!==m.rows*m.cols||!m.data.every(v=>valid(v)&&!M.descriptor(v)))throw Error();if(m.lu&&(!Array.isArray(m.lu.piv)||m.lu.piv.length!==m.rows||new Set(m.lu.piv).size!==m.rows||!m.lu.piv.every(i=>Number.isInteger(i)&&i>=0&&i<m.rows)||![1,-1].includes(m.lu.sign)))throw Error();elements+=m.data.length;}
        if(elements+(a.flags[8]?5:0)>65-a.registerLimit)throw Error();
        for(const k of ['registers','index','registerLimit','seed','flags','imaginary','lastImaginary','resultMatrix','matrices'])c[k]=structuredClone(a[k]);
        c.user=!!a.user;c.radixComma=!!a.radixComma;c.preserveImaginary=!!a.preserveImaginary;
      }catch { /* Keep a clean advanced state if persistence is incompatible. */ }
    }
  }
  save() {const c=this.c;return Object.fromEntries(['registers','index','registerLimit','seed','flags','imaginary','lastImaginary','user','radixComma','resultMatrix','matrices','preserveImaginary'].map(k=>[k,c[k]]));}
  guard(action) {
    const c=this.c,snapshot=structuredClone({...this.save(),stack:c.stack,lastX:c.lastX,entry:c.entry,lift:c.lift,overflow:c.overflow});
    try{return action();}catch(e){Object.assign(c,snapshot);c.pending=null;c.shift=null;c.error=true;c.errorCode=/^\d+$/.test(e.message)?Number(e.message):0;c.message=/^\d+$/.test(e.message)?'':e.message;return true;}
  }
  free() {const c=this.c;return 65-c.registerLimit-(c.flags[8]?5:0)-Object.values(c.matrices).reduce((n,m)=>n+m.data.length,0);}
  setMatrix(name,value) {
    const c=this.c;if(!Object.hasOwn(c.matrices,name))throw Error('11');
    if(this.free()+c.matrices[name].data.length<value.data.length)throw Error('10');
    c.matrices[name]={...value,data:value.data.map(v=>c.normalize(v))};
  }
  recall(value,imaginary='0') {const c=this.c;c.finish();if(c.lift)c.push();c.stack[0]=value;c.imaginary[0]=c.preserveImaginary?c.imaginary[0]:imaginary;c.lift=true;c.preserveImaginary=false;}
  pair(x,y) {const c=this.c;c.finish();if(c.lift)c.push();c.push();c.stack[0]=c.normalize(x);c.stack[1]=c.normalize(y);c.imaginary[0]='0';c.imaginary[1]='0';c.lift=true;}
  flag(n,on) {const c=this.c;if(n<0||n>9||!Number.isInteger(n))throw Error('6');if(n===8&&on&&!c.flags[8]&&this.free()<5)throw Error('10');c.flags[n]=on;if(n===8&&!on){c.imaginary=Array(4).fill('0');c.lastImaginary='0';}if(n===9)c.overflow=on;}
  address(key,dot) {
    const c=this.c;if(key==='TAN'||key==='I')return 'I';
    if(key==='COS'||key==='INDIRECT'){if(M.descriptor(c.index))return c.index;return scalar(c.index).abs().trunc().toNumber();}
    if(/^\d$/.test(key))return Number(key)+(dot?10:0);
    return null;
  }
  register(address,value) {
    const c=this.c;if(address!=='I'&&(!Number.isInteger(address)||address<0||address>c.registerLimit))throw Error('3');
    if(value!==undefined){if(address==='I')c.index=value;else c.registers[address]=value;}
    return address==='I'?c.index:c.registers[address];
  }
  raw(key) {
    const c=this.c,p=c.pending;
    if(!p||typeof p!=='object')return null;
    return this.guard(()=>{
      if(key==='f')return true;
      if(key==='g'){p.stackElement=true;return true;}
      if(key==='BACK'||key==='CLX'){c.pending=null;c.shift=null;return true;}
      if(['STO','RCL','EXCHANGE','DSE','ISG'].includes(p.kind)) {
        if(['+','-','*','/'].includes(key)&&!p.op){p.op=key;return true;}
        if(key==='.'&&!p.dot){p.dot=true;return true;}
        if(key==='CHS'||key==='MATRIX'){p.matrix=true;return true;}
        if(key==='SIN'||key==='DIM'){p.dim=true;return true;}
        if(key==='EEX'||key==='RESULT'){c.pending=null;c.finish();if(p.kind==='STO'){if(!M.descriptor(c.stack[0]))throw Error('1');c.resultMatrix=c.stack[0][1];}else this.recall('@'+c.resultMatrix);return true;}
        if(key==='ENTER'||key==='RANDOM'){c.pending=null;c.finish();if(p.kind==='STO'){const v=scalar(c.stack[0]).abs();c.seed=v.minus(v.trunc()).mul('1e10').trunc().toFixed(0);c.lift=true;}else this.recall(new D(c.seed).div('1e10').toString());return true;}
        if(key==='SUM'&&p.kind==='RCL'){c.pending=null;this.stats('SUM_RECALL');return true;}
        if(p.dim&&key==='COS'){c.pending=null;this.recall(String(c.registerLimit));return true;}
        let name=letters[key];
        if(key==='TAN'&&(p.dim||p.matrix)&&M.descriptor(c.index))name=c.index[1];
        const address=this.address(key,p.dot);
        if(!name&&M.descriptor(address))name=address[1];
        if(name){c.pending=null;return this.matrixAccess(p,name);}
        if(address===null){c.pending=null;return false;}
        c.finish();c.pending=null;const v=this.register(address),x=c.stack[0];
        if(p.kind==='STO'){this.register(address,p.op?c.normalize(arithmetic(scalar(v),scalar(x),p.op)):x);c.lift=true;}
        else if(p.kind==='RCL'){if(p.op){c.stack[0]=c.normalize(arithmetic(scalar(x),scalar(v),p.op));c.lift=true;}else this.recall(v);}
        else if(p.kind==='EXCHANGE'){this.register(address,x);c.stack[0]=v;c.lift=true;}
        else {const value=scalar(v),n=value.trunc(),fraction=value.minus(n).abs(),limit=fraction.mul(1000).trunc(),step=fraction.mul('1e5').trunc().mod(100);const next=n.plus((p.kind==='ISG'?1:-1)*(step.isZero()?1:step.toNumber()));this.register(address,c.normalize(next.plus(value.minus(n))));c.message=(p.kind==='ISG'?next.gt(limit):next.lte(limit))?'Condition true':'Condition false';c.lift=true;}
        return true;
      }
      c.pending=null;c.finish();
      if(p.kind==='DIM') {
        if(key==='COS'){const limit=Math.max(1,scalar(c.stack[0]).trunc().toNumber());if(limit>65||this.free()+c.registerLimit-limit<0)throw Error('10');for(let i=limit+1;i<66;i++)c.registers[i]='0';c.registerLimit=limit;return true;}
        const name=letters[key]||(key==='TAN'&&M.descriptor(c.index)?c.index[1]:null);if(!name)throw Error('11');
        const rows=scalar(c.stack[1]).abs().trunc().toNumber(),cols=scalar(c.stack[0]).abs().trunc().toNumber();if(rows*cols>64)throw Error('10');this.setMatrix(name,M.dimension(c.matrices[name],rows,cols));return true;
      }
      if(p.kind==='RESULT'){const name=letters[key]||(key==='TAN'&&M.descriptor(c.index)?c.index[1]:null);if(!name)throw Error('11');c.resultMatrix=name;return true;}
      if(['SF','CF','FLAG','TEST','MATRIX'].includes(p.kind)) {
        const n=key==='TAN'?scalar(c.index).abs().trunc().toNumber():/^\d$/.test(key)?Number(key):-1;
        if(p.kind==='MATRIX')return this.matrixFunction(n);
        if(p.kind==='TEST'){if(n<0||n>9)throw Error('1');const x=scalar(c.stack[0]),y=scalar(c.stack[1]);const equal=x.eq(y)&&(!c.flags[8]||c.imaginary[0]===c.imaginary[1]),zero=x.eq(0)&&(!c.flags[8]||new D(c.imaginary[0]).isZero());const result=[()=>!zero,()=>x.gt(0),()=>x.lt(0),()=>x.gte(0),()=>x.lte(0),()=>equal,()=>!equal,()=>x.gt(y),()=>x.lt(y),()=>x.gte(y)][n]();c.message=result?'Condition true':'Condition false';return true;}
        if(n<0||n>9)throw Error('6');if(p.kind==='FLAG')c.message=(n===9?c.overflow:c.flags[n])?'Flag set':'Flag clear';else this.flag(n,p.kind==='SF');return true;
      }
      return false;
    });
  }
  matrixAccess(p,name) {
    const c=this.c;c.finish();let a=c.matrices[name];
    if(p.dim){this.pair(a.cols,a.rows);return true;}
    if(p.matrix){if(p.kind==='RCL')this.recall('@'+name);else if(M.descriptor(c.stack[0]))this.setMatrix(name,M.copy(c.matrices[c.stack[0][1]]));else this.setMatrix(name,M.map(a,()=>scalar(c.stack[0])));c.lift=true;return true;}
    const row=scalar(p.stackElement?c.stack[1]:c.registers[0]).abs().trunc().toNumber(),col=scalar(p.stackElement?c.stack[0]:c.registers[1]).abs().trunc().toNumber();
    if(row<1||col<1||row>a.rows||col>a.cols)throw Error('3');const i=(row-1)*a.cols+col-1,old=a.data[i];
    if(p.kind==='STO'||p.kind==='EXCHANGE') {const value=scalar(p.stackElement?c.stack[2]:c.stack[0]);a=M.copy(a);delete a.lu;a.data[i]=p.op?c.normalize(arithmetic(new D(old),value,p.op)):value.toString();this.setMatrix(name,a);}
    if(p.stackElement){if(p.kind==='STO'){c.stack=[c.stack[2],c.stack[3],c.stack[3],c.stack[3]];c.imaginary=[c.imaginary[2],c.imaginary[3],c.imaginary[3],c.imaginary[3]];}else {c.stack=[old,c.stack[2],c.stack[3],c.stack[3]];c.imaginary=['0',c.imaginary[2],c.imaginary[3],c.imaginary[3]];}}
    else if(p.kind==='RCL')this.recall(old);else if(p.kind==='EXCHANGE')c.stack[0]=old;
    if(c.user&&!p.stackElement){let next=i+1;if(next===a.data.length)next=0;c.registers[0]=String(Math.floor(next/a.cols)+1);c.registers[1]=String(next%a.cols+1);}
    c.lift=true;return true;
  }
  stats(key) {
    const c=this.c;if(c.registerLimit<7)throw Error('3');c.finish();
    if(key==='CLEAR_STATS'){for(let i=2;i<=7;i++)c.registers[i]='0';c.stack=Array(4).fill('0');c.imaginary=Array(4).fill('0');return true;}
    if(key==='SUM'||key==='SUM_MINUS'){
      const x=scalar(c.stack[0]),y=scalar(c.stack[1]),sign=key==='SUM'?1:-1;
      const values=[new D(1),x,x.mul(x),y,y.mul(y),x.mul(y)];
      values.forEach((v,i)=>c.registers[i+2]=c.normalize(scalar(c.registers[i+2]).plus(v.mul(sign))));c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];c.stack[0]=c.registers[2];c.lift=false;return true;
    }
    const [n,sx,sxx,sy,syy,sxy]=c.registers.slice(2,8).map(scalar);
    if(key==='SUM_RECALL'){this.pair(sx,sy);return true;}
    if(n.isZero()||(key!=='MEAN'&&n.lte(1)))throw Error('2');
    if(key==='MEAN'){this.pair(sx.div(n),sy.div(n));return true;}
    const m=n.mul(sxx).minus(sx.pow(2)),q=n.mul(syy).minus(sy.pow(2)),p=n.mul(sxy).minus(sx.mul(sy));
    if(m.lt(0)||q.lt(0))throw Error('2');
    if(key==='STD'){this.pair(m.div(n.mul(n.minus(1))).sqrt(),q.div(n.mul(n.minus(1))).sqrt());return true;}
    if(m.isZero())throw Error('2');const slope=p.div(m),intercept=sy.minus(slope.mul(sx)).div(n);
    if(key==='REGRESSION'){this.pair(intercept,slope);return true;}
    if(q.isZero())throw Error('2');const x=scalar(c.stack[0]);c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];
    c.stack=[c.normalize(intercept.plus(slope.mul(x))),c.normalize(p.div(m.mul(q).sqrt())),c.stack[1],c.stack[2]];c.imaginary=['0','0',c.imaginary[1],c.imaginary[2]];c.lift=true;return true;
  }
  matrixFunction(n) {
    const c=this.c;c.finish();if(n===0){c.matrices=Object.fromEntries('ABCDE'.split('').map(k=>[k,M.empty()]));return true;}
    if(n===1){c.registers[0]='1';c.registers[1]='1';return true;}
    if((n===7||n===8)&&!M.descriptor(c.stack[0])){c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];c.message='Scalar argument: no matrix norm calculated.';return true;}
    if(n<2||n>9||!M.descriptor(c.stack[0]))throw Error('11');
    const name=c.stack[0][1],a=c.matrices[name],result=c.resultMatrix;
    if(n===2||n===3)this.setMatrix(name,M.complexPartition(a,n===2));
    if(n===4)this.setMatrix(name,M.transpose(a));
    if(n===5||n===6){if(!M.descriptor(c.stack[1])||[c.stack[1][1],name].includes(result))throw Error('11');const y=c.matrices[c.stack[1][1]],product=M.product(n===5?M.transpose(y):y,a);this.setMatrix(result,n===5?product:M.combine(c.matrices[result],product,(b,v)=>b.minus(v)));this.drop('@'+result);return true;}
    if(n===7||n===8){c.lastX=c.stack[0];c.stack[0]=c.normalize(n===7?M.rowNorm(a):M.frobenius(a));}
    if(n===9){const determinant=M.determinant(a);this.setMatrix(result,M.factor(a));c.lastX=c.stack[0];c.stack[0]=c.normalize(determinant);}
    c.lift=true;return true;
  }
  drop(value,imag='0') {const c=this.c;c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];c.stack=[value,c.stack[2],c.stack[3],c.stack[3]];c.imaginary=[imag,c.imaginary[2],c.imaginary[3],c.imaginary[3]];c.lift=true;}
  matrixOperation(key) {
    const c=this.c;c.finish();const x=c.stack[0],y=c.stack[1],xm=M.descriptor(x),ym=M.descriptor(y),a=xm?c.matrices[x[1]]:null,b=ym?c.matrices[y[1]]:null,r=c.resultMatrix;
    if(xm&&['PERMUTE','COMBINE'].includes(key)){this.setMatrix(x[1],M.transform(a,key==='PERMUTE'?3:2));c.lift=true;return true;}
    if(xm&&key==='CHS'){this.setMatrix(x[1],M.map(a,v=>v.neg()));c.lift=true;return true;}
    if(xm&&key==='RECIP'){this.setMatrix(r,M.inverse(a));c.lastX=x;c.stack[0]='@'+r;c.lift=true;return true;}
    if(!['+','-','*','/'].includes(key))throw Error('1');
    let result;
    if(xm&&ym){if((key==='*'&&[x[1],y[1]].includes(r))||(key==='/'&&r===x[1]))throw Error('11');result=key==='*'?M.product(b,a):key==='/'?M.solve(a,b):M.combine(b,a,(v,w)=>arithmetic(v,w,key));if(key==='/')this.setMatrix(x[1],M.factor(a));}
    else {const matrix=xm?a:b,number=scalar(xm?y:x);result=key==='/'&&xm?M.map(M.inverse(matrix),v=>v.mul(number)):M.map(matrix,v=>xm?arithmetic(number,v,key):arithmetic(v,number,key));}
    this.setMatrix(r,result);this.drop('@'+r);return true;
  }
  handle(key) {
    const c=this.c;
    if(['STO','RCL','EXCHANGE','DIM','RESULT','MATRIX','SF','CF','FLAG','TEST','DSE','ISG'].includes(key)){c.pending={kind:key};return true;}
    if(['SUM','SUM_MINUS','CLEAR_STATS','MEAN','STD','REGRESSION','ESTIMATE'].includes(key))return this.guard(()=>this.stats(key));
    return this.guard(()=>{
      if(key==='USER'){c.finish();c.user=!c.user;return true;}
      if(key==='CLEAR_REG'){c.finish();c.registers.fill('0');c.index='0';return true;}
      if(key==='RANDOM'){c.finish();c.seed=((1574352261n*BigInt(c.seed)+1017980433n)%10000000000n).toString();this.recall(new D(c.seed).div('1e10').toString());return true;}
      if(key==='PREFIX'){c.finish();c.pending=null;c.shift=null;c.inspection={mantissa:scalar(c.stack[0]).abs().toExponential(9).split('e')[0].replace('.',''),exponent:'',negative:false};return true;}
      if(key==='RADIX'){c.radixComma=!c.radixComma;return true;}
      if(key==='MEM'){c.message=`Memory: R0–R${c.registerLimit} + I; ${this.free()} free registers; ${Object.values(c.matrices).reduce((n,m)=>n+m.data.length,0)} matrix elements.`;c.inspection={mantissa:`${c.registerLimit} ${this.free()} 0-0`,exponent:'',negative:false};return true;}
      if(key==='SOLVE'||key==='INTEGRATE'){c.finish();scalar(c.stack[0]);scalar(c.stack[1]);if(this.free()<(key==='SOLVE'?5:23))throw Error('10');c.request=key;return true;}
      if(key==='X_LE_Y'||key==='X_EQ_0'){c.finish();c.message=(key==='X_LE_Y'?scalar(c.stack[0]).lte(scalar(c.stack[1])):(scalar(c.stack[0]).isZero()&&(!c.flags[8]||new D(c.imaginary[0]).isZero())))?'Condition true':'Condition false';return true;}
      if(['MAKE_COMPLEX','RE_IM','IM_VIEW'].includes(key)) {
        c.finish();if(key==='IM_VIEW'){c.inspection=formatNumber(new D(c.imaginary[0]),c.format);return true;}
        scalar(c.stack[0]);this.flag(8,true);
        if(key==='MAKE_COMPLEX'){scalar(c.stack[1]);const real=c.stack[1],imag=c.stack[0];c.stack=[real,c.stack[2],c.stack[3],c.stack[3]];c.imaginary=[imag,c.imaginary[2],c.imaginary[3],c.imaginary[3]];}
        else [c.stack[0],c.imaginary[0]]=[c.imaginary[0],c.stack[0]];
        c.lift=true;return true;
      }
      const isOperation=['+','-','*','/','POWER','PERCENT','DELTA_PERCENT','PERMUTE','COMBINE','POLAR','RECT','CHS','RND',...Object.keys(unary)].includes(key);
      if(isOperation&&(M.descriptor(c.stack[0])||(['+','-','*','/','POWER','PERCENT','DELTA_PERCENT','PERMUTE','COMBINE','POLAR','RECT'].includes(key)&&M.descriptor(c.stack[1]))))return this.matrixOperation(key);
      if(!c.flags[8])return null;
      if(['ROLL','ROLLUP','SWAP','LASTX'].includes(key)) {
        c.finish();const s=c.stack,i=c.imaginary;
        if(key==='ROLL'){c.stack=[s[1],s[2],s[3],s[0]];c.imaginary=[i[1],i[2],i[3],i[0]];}
        if(key==='ROLLUP'){c.stack=[s[3],s[0],s[1],s[2]];c.imaginary=[i[3],i[0],i[1],i[2]];}
        if(key==='SWAP'){[s[0],s[1]]=[s[1],s[0]];[i[0],i[1]]=[i[1],i[0]];}
        if(key==='LASTX')this.recall(c.lastX,c.lastImaginary);c.lift=true;return true;
      }
      if(key==='POLAR'||key==='RECT'){c.finish();const result=coordinates(scalar(c.stack[0]),new D(c.imaginary[0]),c.angleMode,key);c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];c.stack[0]=c.normalize(result[0]);c.imaginary[0]=c.normalize(result[1]);c.lift=true;return true;}
      if(['+','-','*','/','POWER','SQRT','SQUARE','RECIP','ABS','LN','LOG','EXP','POW10','SIN','COS','TAN','ASIN','ACOS','ATAN','SINH','COSH','TANH','ASINH','ACOSH','ATANH'].includes(key)) {
        c.finish();const x=[scalar(c.stack[0]),new D(c.imaginary[0])];
        const binary=['+','-','*','/','POWER'].includes(key),result=binary?complexBinary(key,[scalar(c.stack[1]),new D(c.imaginary[1])],x):complexUnary(key,x);
        if(result.some(v=>v.isNaN()))throw Error('0');
        const re=c.normalize(result[0]),im=c.normalize(result[1]);
        if(binary)this.drop(re,im);else{c.lastX=c.stack[0];c.lastImaginary=c.imaginary[0];c.stack[0]=re;c.imaginary[0]=im;c.lift=true;}return true;
      }
      return null;
    });
  }
}
