import {D} from './math.js';
export const descriptor=v=>typeof v==='string'&&/^@[A-E]$/.test(v);
export const empty=()=>({rows:0,cols:0,data:[]});
export const copy=a=>({...a,data:[...a.data],lu:a.lu?{...a.lu,piv:[...a.lu.piv]}:undefined});
const check=b=>{if(!b)throw Error('11');};
export function dimension(a,rows,cols) {
  check(Number.isInteger(rows)&&Number.isInteger(cols)&&rows>=0&&cols>=0&&rows*cols<=64);
  if(!rows||!cols)return empty();
  return {rows,cols,data:Array.from({length:rows*cols},(_,i)=>a.data[i]||'0')};
}
export function transpose(a) {return {rows:a.cols,cols:a.rows,data:Array.from({length:a.data.length},(_,i)=>a.data[(i%a.rows)*a.cols+Math.floor(i/a.rows)])};}
export function map(a,fn) {return {rows:a.rows,cols:a.cols,data:a.data.map(v=>fn(new D(v)).toString())};}
export function combine(a,b,fn) {check(a.rows===b.rows&&a.cols===b.cols);return {rows:a.rows,cols:a.cols,data:a.data.map((v,i)=>fn(new D(v),new D(b.data[i])).toString())};}
export function product(a,b) {
  check(a.cols===b.rows&&a.rows>0&&b.cols>0);
  return {rows:a.rows,cols:b.cols,data:Array.from({length:a.rows*b.cols},(_,i)=>{
    let s=new D(0);for(let k=0;k<a.cols;k++)s=s.plus(new D(a.data[Math.floor(i/b.cols)*a.cols+k]).mul(b.data[k*b.cols+i%b.cols]));return s.toString();
  })};
}
export function factor(a) {
  check(a.rows===a.cols&&a.rows>0);
  if(a.lu)return copy(a);
  const n=a.rows,d=a.data.map(v=>new D(v)),piv=Array.from({length:n},(_,i)=>i);let sign=1;
  for(let k=0;k<n;k++) {
    let p=k;for(let j=k+1;j<n;j++)if(d[j*n+k].abs().gt(d[p*n+k].abs()))p=j;
    if(p!==k){for(let j=0;j<n;j++)[d[k*n+j],d[p*n+j]]=[d[p*n+j],d[k*n+j]];[piv[k],piv[p]]=[piv[p],piv[k]];sign=-sign;}
    // Compatibility choice: a tiny positive pivot approximates HP singular perturbation.
    if(d[k*n+k].isZero())d[k*n+k]=new D('1e-99');
    for(let i=k+1;i<n;i++){d[i*n+k]=d[i*n+k].div(d[k*n+k]);for(let j=k+1;j<n;j++)d[i*n+j]=d[i*n+j].minus(d[i*n+k].mul(d[k*n+j]));}
  }
  return {rows:n,cols:n,data:d.map(v=>v.toString()),lu:{piv,sign}};
}
export function solve(a,b) {
  const f=factor(a),n=a.rows;check(b.rows===n);
  const d=f.data.map(v=>new D(v)),out=[];
  for(let c=0;c<b.cols;c++) {
    const v=f.lu.piv.map(i=>new D(b.data[i*b.cols+c]));
    for(let i=0;i<n;i++)for(let j=0;j<i;j++)v[i]=v[i].minus(d[i*n+j].mul(v[j]));
    for(let i=n-1;i>=0;i--){for(let j=i+1;j<n;j++)v[i]=v[i].minus(d[i*n+j].mul(v[j]));v[i]=v[i].div(d[i*n+i]);}
    for(let i=0;i<n;i++)out[i*b.cols+c]=v[i].toString();
  }
  return {rows:n,cols:b.cols,data:out};
}
export const inverse=a=>solve(a,{rows:a.rows,cols:a.rows,data:Array.from({length:a.rows*a.rows},(_,i)=>i% (a.rows+1)===0?'1':'0')});
export function determinant(a) {const f=factor(a);return f.data.reduce((v,x,i)=>i%(a.rows+1)===0?v.mul(x):v,new D(f.lu.sign));}
export const rowNorm=a=>D.max(0,...Array.from({length:a.rows},(_,r)=>a.data.slice(r*a.cols,(r+1)*a.cols).reduce((s,v)=>s.plus(new D(v).abs()),new D(0))));
export const frobenius=a=>a.data.reduce((s,v)=>s.plus(new D(v).pow(2)),new D(0)).sqrt();
// Combination/permutation keys pack stacked real/imaginary rows and interleaved columns.
export function transform(a,operation) {
  if(operation===2){check(a.rows%2===0);return {rows:a.rows/2,cols:a.cols*2,data:Array.from({length:a.data.length},(_,i)=>a.data[Math.floor(i/(2*a.cols))*a.cols+Math.floor((i%(2*a.cols))/2)+(i%2)*a.data.length/2])};}
  check(a.cols%2===0);const rows=a.rows*2,cols=a.cols/2;
  return {rows,cols,data:Array.from({length:a.data.length},(_,i)=>a.data[(Math.floor(i/cols)%a.rows)*a.cols+2*(i%cols)+Math.floor(i/(a.rows*cols))])};
}
export function complexPartition(a,expand) {
  if(expand){check(a.rows%2===0);const n=a.rows/2,m=a.cols;return {rows:a.rows,cols:m*2,data:Array.from({length:a.data.length*2},(_,i)=>{const r=Math.floor(i/(2*m)),c=i%(2*m),imag=(r<n)!==(c<m);const v=new D(a.data[(r%n+(imag?n:0))*m+c%m]);return (r<n&&c>=m?v.neg():v).toString();})};}
  check(a.cols%2===0);return {rows:a.rows,cols:a.cols/2,data:a.data.filter((_,i)=>i%a.cols<a.cols/2)};
}
