import test from 'node:test';
import assert from 'node:assert/strict';
import {Calculator} from '../src/calculator.js';
import {compileExpression,solveRoot,integrate} from '../src/expression.js';
import {D} from '../src/math.js';
const press=(c,s)=>{for(const k of s.split(' '))if(/^[0-9.]+$/.test(k))for(const d of k)c.press(d);else c.press(k);return c;};
const fresh=s=>press(new Calculator(),s);
test('flags use I indirectly, retain stack and distinguish invalid flags',()=>{
 const c=fresh('8 STO TAN g 4 TAN');assert.equal(c.flags[8],true);press(c,'g 5 8');assert.deepEqual(c.imaginary,['0','0','0','0']);
 press(c,'9 g 4 9');assert.equal(c.overflow,true);press(c,'BACK');assert.equal(c.stack[0],'9');assert.equal(c.flags[9],false);
 press(c,'12 STO TAN g 4 TAN');assert.equal(c.errorCode,6);
});
test('direct allocation, indirect extended storage, memory and mode precision',()=>{
 const c=fresh('65 f SIN COS 40 STO TAN 123 STO COS RCL COS');assert.equal(c.stack[0],'123');assert.equal(c.registers[40],'123');
 press(c,'2 STO TAN f 7 TAN');assert.deepEqual(c.format,{mode:'FIX',digits:2});press(c,'g RCL');assert.match(c.message,/R65/);
 press(c,'19 f SIN COS');assert.equal(c.registers[40],'0');press(c,'40 STO TAN RCL COS');assert.equal(c.errorCode,3);
});
test('DSE and ISG update the designated register and report predicates',()=>{
 const c=fresh('0.00602 STO 0 f 6 0');assert.equal(c.registers[0],'2.00602');assert.equal(c.message,'Condition false');
 press(c,'f 6 0 f 6 0 f 6 0');assert.equal(c.registers[0],'8.00602');assert.equal(c.message,'Condition true');
 press(c,'f 5 0');assert.equal(c.registers[0],'6.00602');assert.equal(c.message,'Condition true');
});
test('advanced state survives reload including complex registers and radix',()=>{
 const c=fresh('2 ENTER 3 f TAN 7 STO 1 0.5764 STO ENTER RADIX');const restored=new Calculator(JSON.parse(JSON.stringify(c.save())));
 assert.deepEqual(restored.save(),c.save());assert.equal(restored.display().mantissa,'0,5764');
 const broken=c.save();broken.advanced.matrices.A={rows:900,cols:900,data:[]};assert.doesNotThrow(()=>new Calculator(broken));
});
test('full mantissa is neutral and decimal comma changes presentation only',()=>{
 const c=fresh('1 ENTER 3 / f BACK');assert.equal(c.display().mantissa,'3333333333');assert.equal(c.stack[0],'0.3333333333');
 press(c,'RADIX');assert.equal(c.display().mantissa,'0,3333');press(c,'2 *');assert.equal(c.stack[0],'0.6666666666');
});
test('numerical return contracts include rounded root residual and failure candidate',()=>{
 const fn=compileExpression('x^2-2'),result=solveRoot(fn,1,2);assert.equal(result.residual.toString(),fn(result.x).toString());
 const c=new Calculator();c.completeNumerical('SOLVE',result,{x:'2',y:'1'});assert.equal(c.stack[0],'1.414213562');assert.equal(c.stack[2],'-1.055272156e-9');
 assert.throws(()=>solveRoot(compileExpression('x^2+1'),-1,1),e=>e.message==='8'&&e.best&&e.best.residual.eq(compileExpression('x^2+1')(e.best.x)));
 const integral=integrate(compileExpression('x^2'),0,1,'1e-11',{mode:'FIX',digits:4});c.completeNumerical('INTEGRATE',integral,{x:'1',y:'0'});
 assert.deepEqual(c.stack,['0.3333333333','0.00005','1','0']);
 const coarse=integrate(compileExpression('10*x'),1,2,'1e-11',{mode:'SCI',digits:3});
 const fine=integrate(compileExpression('10*x'),1,2,'1e-11',{mode:'SCI',digits:8});assert.ok(coarse.error.div(fine.error).gt(99999));
});
test('expression parser rejects code and bounded recursion, accepts parameters',()=>{
 assert.equal(compileExpression('a*x+b',{a:'2',b:'3'})(4).toString(),'11');
 for(const s of ['x=3','globalThis','sin.constructor(x)','(()=>1)()', '('.repeat(100)+'x'+')'.repeat(100)])assert.throws(()=>compileExpression(s));
});
test('complex polar converts only complex X and leaves complex Y intact',()=>{
 const c=fresh('7 ENTER 8 f TAN 3 ENTER 4 f TAN g 1');assert.equal(c.stack[0],'5');assert.equal(c.imaginary[0],'53.13010235');assert.equal(c.stack[1],'7');assert.equal(c.imaginary[1],'8');
 press(c,'f 1');assert.ok(new D(c.stack[0]).minus(3).abs().lt('1e-8'));assert.ok(new D(c.imaginary[0]).minus(4).abs().lt('1e-8'));
});
test('negative indirect precision affects integration and survives reload',()=>{
 const c=fresh('3 CHS STO TAN f 8 TAN');assert.deepEqual(c.format,{mode:'SCI',digits:0,integralDigits:-3});
 assert.deepEqual(new Calculator(c.save()).format,c.format);
 const result=integrate(compileExpression('2'),0,1,'1e-10',c.format);assert.equal(result.error.toSignificantDigits(10).toString(),'500');
 press(c,'9 CHS STO TAN f 7 TAN');assert.equal(c.format.integralDigits,-6);
});
test('numerical completion clears imaginary outputs and persists overflow',()=>{
 const c=fresh('2 ENTER 3 f TAN');c.completeNumerical('INTEGRATE',{value:'1e101',error:'1'},{x:'1',y:'0'});
 assert.deepEqual(c.imaginary,['0','0','0','0']);assert.equal(c.flags[9],true);assert.equal(new Calculator(c.save()).overflow,true);
});
