import test from 'node:test';
import assert from 'node:assert/strict';
import {Calculator} from '../src/calculator.js';
import {D} from '../src/math.js';
import {complexUnary,complexBinary} from '../src/complex.js';
import {compileExpression,solveRoot,integrate} from '../src/expression.js';
function keys(c,sequence) {
  for(const key of sequence.split(' ')) {
    if(/^\d+(\.\d*)?$/.test(key))for(const digit of key)c.press(digit);
    else c.press(key);
  }
  return c;
}
const fresh=sequence=>keys(new Calculator(),sequence);
const digits=a=>a.map(v=>v.toSignificantDigits(10).toString());
test('critic: exact seeded Voyager random sequence and recall',()=>{
  const c=fresh('0.5764 STO f ENTER');
  for(const expected of ['0.3421980433','0.2809289446','0.2131517839','0.0209464412']){
    keys(c,'f ENTER');assert.equal(c.stack[0],expected);
    keys(c,'RCL f ENTER');assert.equal(c.stack[0],expected);
  }
});
test('critic: original statistics registers, two-result lift and prediction',()=>{
  const c=fresh('f GSB 3 ENTER 1 SUM 5 ENTER 2 SUM 7 ENTER 3 SUM');
  assert.deepEqual(c.registers.slice(2,8),['3','6','14','15','83','34']);
  c.stack=['9','8','7','6'];c.lift=false;keys(c,'g 0');assert.deepEqual(c.stack,['2','5','8','7']);
  c.stack=['9','8','7','6'];c.lift=true;keys(c,'g 0');assert.deepEqual(c.stack,['2','5','9','8']);
  c.stack=['4','8','7','6'];keys(c,'f .');assert.deepEqual(c.stack,['9','1','8','7']);assert.equal(c.lastX,'4');
});
test('critic: storage arithmetic order, LASTX and index indirection',()=>{
  const c=fresh('12.3456 CHS STO TAN 8 STO COS 3 STO - . 2 RCL COS');
  assert.equal(c.stack[0],'5');assert.equal(c.registers[12],'5');assert.equal(c.lastX,'0');
  keys(c,'2 RCL - COS');assert.equal(c.stack[0],'-3');assert.equal(c.registers[12],'5');
});
test('critic: CLx preserves imaginary entry but EEX following ENTER clears it',()=>{
  assert.deepEqual(fresh('2 ENTER 3 f TAN g BACK 4').imaginary,['3','0','0','0']);
  const c=fresh('2 ENTER 3 f TAN ENTER EEX 2');
  assert.equal(c.stack[0],'100');assert.equal(c.imaginary[0],'0');assert.equal(c.imaginary[1],'3');
});
test('critic: original complex branches and large negative arguments',()=>{
  assert.deepEqual(digits(complexUnary('ASIN',[new D('2.404'),new D(0)])),['1.570796327','-1.523910918']);
  assert.deepEqual(digits(complexUnary('ATAN',[new D(0),new D(2)])),['1.570796327','0.5493061443']);
  assert.deepEqual(digits(complexUnary('ASINH',[new D('-1e30'),new D(0)])),['-69.77069997','0']);
  assert.deepEqual(digits(complexUnary('ASIN',[new D('-1e30'),new D(0)])),['-1.570796327','69.77069997']);
  assert.deepEqual(digits(complexBinary('POWER',[new D(0),new D(0)],[new D(1),new D(1)])),['0','0']);
});
test('critic: expression precedence, domain safety and solver nonroots',()=>{
  assert.equal(compileExpression('-x^2')('2').toString(),'-4');
  assert.equal(compileExpression('2^3^2')('0').toString(),'512');
  assert.throws(()=>compileExpression('x.constructor'));
  assert.throws(()=>compileExpression('0^0')('0'));
  const root=solveRoot(compileExpression('x^2-2'),'1','2');
  assert.equal(root.x.toSignificantDigits(10).toString(),'1.414213562');
  assert.throws(()=>solveRoot(compileExpression('x^2+1'),'-1','1'));
  assert.throws(()=>solveRoot(compileExpression('1/(x-1)'),'0','2'));
});
test('critic: quadrature analytic examples and reversed limits',()=>{
  for(const [source,a,b,expected] of [['x^2','0','1','0.3333333333'],['sin(x)','0','1','0.4596976941'],['1/(1+x^2)','1','0','-0.7853981634']]){
    const r=integrate(compileExpression(source),a,b,'1e-10');
    assert.equal(r.value.toSignificantDigits(10).toString(),expected);assert.ok(r.error.gte(0));
  }
});
test('critic: clearing statistics is lift-neutral as listed in Appendix B',()=>{
  const c=fresh('2 ENTER + f GSB 1 f 7 4 2 +');
  assert.equal(c.stack[0],'3');
});
test('critic: complex equality predicates include imaginary parts',()=>{
  const c=fresh('0 ENTER 1 f TAN g *');
  assert.equal(c.message,'Condition false');
});
test('critic: complex real-axis trig preserves original HP argument reduction',()=>{
  const c=fresh('g 4 8 g 8 g EEX SIN');
  assert.equal(c.stack[0],'-4.1e-10');
  assert.equal(fresh('g 4 8 g 8 3.141592654 EEX 14 SIN').stack[0],'0.7990550814');
});
test('critic: advanced memory thresholds and integration display uncertainty',()=>{
  for(const [limit,key,error] of [[60,'SOLVE',0],[61,'SOLVE',10],[42,'INTEGRATE',0],[43,'INTEGRATE',10]]) {
    const c=new Calculator();c.registerLimit=limit;c.press(key);assert.equal(c.errorCode,error);
  }
  const fn=compileExpression('2');
  assert.equal(integrate(fn,'0','3','1e-11',{mode:'FIX',digits:2}).error.toSignificantDigits(10).toString(),'0.015');
  assert.equal(integrate(fn,'0','3','1e-11',{mode:'FIX',digits:4}).error.toSignificantDigits(10).toString(),'0.00015');
  const a=integrate(fn,'0','3','1e-11',{mode:'SCI',digits:7}).error;
  const b=integrate(fn,'0','3','1e-11',{mode:'SCI',digits:9}).error;
  assert.ok(a.div(b).minus(100).abs().lt('0.000001'));
  const root=solveRoot(compileExpression('x^2-2'),'1','2');
  assert.equal(root.residual.toString(),compileExpression('x^2-2')(root.x).toString());
});
test('critic: complex hyperbolic extreme input completes promptly',async()=>{
  const {spawnSync}=await import('node:child_process');
  const result=spawnSync(process.execPath,['--input-type=module','-e',"import{Calculator}from'./src/calculator.js';const c=new Calculator();c.press('SF');c.press('8');c.stack[0]='1e99';c.press('TANH');console.log(c.stack[0],c.error)"],{cwd:process.cwd(),timeout:5000,encoding:'utf8'});
  assert.ifError(result.error);assert.equal(result.status,0);assert.equal(result.stdout.trim(),'1 false');
});
test('critic: expressions evaluate complex intermediates and expose the real result',()=>{
  assert.equal(compileExpression('abs(1+i)',{},'DEG',true)('0').toSignificantDigits(10).toString(),'1.414213562');
  assert.equal(compileExpression('sqrt(-1)*sqrt(-1)',{},'DEG',true)('0').toString(),'-1');
  assert.equal(compileExpression('abs(complex(3,4))',{},'DEG',true)('0').toString(),'5');
  assert.equal(compileExpression('pow(complex(0,0),complex(1,1))',{},'DEG',true)('0').toString(),'0');
});
