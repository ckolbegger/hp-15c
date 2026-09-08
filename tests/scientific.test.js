import test from 'node:test';
import assert from 'node:assert/strict';
import {Calculator} from '../src/calculator.js';
export function run(sequence, c=new Calculator()) {
  for (const key of sequence.split(' ')) {
    if (/^\d+(\.\d*)?$/.test(key)) for (const digit of key) c.press(digit);
    else c.press(key);
  }
  return c;
}
test('square root uses X, preserves the deeper stack, and saves LAST X',()=>{
 const c=run('7 ENTER 9 SQRT');
 assert.deepEqual(c.stack,['3','7','0','0']);assert.equal(c.lastX,'9');
 run('2 +',c);assert.equal(c.stack[0],'5');
});
test('base and blue-shift logarithms, exponentials and reciprocal',()=>{
 for(const [sequence,expected] of [['2 EXP','7.389056099'],['2 POW10','100'],['100 g POW10','2'],['1 g EXP','0'],['4 RECIP','0.25'],['3 g SQRT','9']])assert.equal(run(sequence).stack[0],expected,sequence);
});
test('gold fraction and blue integer/absolute/roll-up functions',()=>{
 assert.equal(run('12.75 CHS f STO').stack[0],'-0.75');
 assert.equal(run('12.75 CHS g STO').stack[0],'-12');
 assert.equal(run('12 CHS g CHS').stack[0],'12');
 assert.deepEqual(run('1 ENTER 2 ENTER 3 ENTER 4 g ROLL').stack,['1','4','3','2']);
});
test('power drops stack, percent and percent change retain their base',()=>{
 assert.equal(run('2 ENTER 3 POWER').stack[0],'8');
 assert.equal(run('2 CHS ENTER 3 POWER').stack[0],'-8');
 const p=run('200 ENTER 15 g POWER');assert.deepEqual(p.stack,['30','200','0','0']);assert.equal(p.lastX,'15');
 assert.equal(run('80 ENTER 100 g RECIP').stack[0],'25');
});
test('domain errors preserve operands and LAST X',()=>{
 for(const sequence of ['1 CHS SQRT','0 RECIP','0 g EXP','0 g POW10','0 ENTER 0 POWER','2 CHS ENTER 0.5 POWER','0 ENTER 2 g RECIP']){
   const c=run(sequence);assert.equal(c.error,true,sequence);assert.equal(c.lastX,'0',sequence);
 }
});
test('pi recalls ten digits without overwriting LAST X; exponentials respect range',()=>{
 const c=run('2 ENTER 4 + g EEX');assert.equal(c.stack[0],'3.141592654');assert.equal(c.stack[1],'6');assert.equal(c.lastX,'4');
 assert.equal(run('1000 EXP').overflow,true);assert.equal(run('1000 CHS EXP').stack[0],'0');
});
test('display mode prefixes consume their precision digit without entering it',()=>{
 const c=run('123.4567895 f 8 6');assert.deepEqual(c.display(),{mantissa:'1.234568',exponent:'02',negative:false});
 run('f 8 8',c);assert.equal(c.display().mantissa,'1.234567');
 run('g SWAP',c);assert.equal(c.stack[0],'123.45679');
 run('f 7 2',c);assert.equal(c.display().mantissa,'123.46');
 assert.equal(c.shift,null);
});
test('engineering notation rounds significant digits and uses multiples of three',()=>{
 const c=run('0 ENTER + 0.012345 f 9 1');assert.deepEqual(c.display(),{mantissa:'12.',exponent:'-03',negative:false});
 run('f 9 3',c);assert.equal(c.display().mantissa,'12.35');
 run('10 *',c);assert.equal(c.display().mantissa,'123.5');
});
test('degree trig, inverse functions, radians and grads',()=>{
 for(const [seq,value] of [['30 SIN','0.5'],['60 COS','0.5'],['45 TAN','1'],['0.5 g SIN','30'],['0.5 g COS','60'],['1 g TAN','45'],['g 9 100 SIN','1']])assert.equal(run(seq).stack[0],value,seq);
 const c=run('g 8 g EEX SIN');assert.equal(c.stack[0],'-4.1e-10');
 assert.equal(run('g 8 3.141592654 EEX 14 SIN').stack[0],'0.7990550814');
});
test('hyperbolic prefix composes with a trig key and validates inverse domains',()=>{
 assert.equal(run('1 f GTO SIN').stack[0],'1.175201194');
 assert.equal(run('1 f GTO COS').stack[0],'1.543080635');
 assert.equal(run('1 f GTO TAN').stack[0],'0.761594156');
 assert.equal(run('1 g GTO SIN').stack[0],'0.881373587');
 assert.equal(run('0 g GTO COS').error,true);
 assert.equal(run('2 g SIN').error,true);
 assert.equal(run('1 g GTO TAN').overflow,true);
});
test('mode changes terminate entry but preserve stack-lift and survive reload',()=>{
 const c=run('5 ENTER g 8 2 +');assert.equal(c.stack[0],'7');
 run('f 8 3',c);const restored=new Calculator(c.save());assert.equal(restored.angleMode,'RAD');assert.deepEqual(restored.format,{mode:'SCI',digits:3});
});
test('neutral modes preserve an enabled lift through number entry',()=>{
 const c=run('2 ENTER + 3 f 7 2 4 +');assert.equal(c.stack[0],'7');assert.equal(c.stack[1],'4');
});
test('decimal hours and signed H.MMSS conversions match handbook example',()=>{
 const c=run('1.2345 f 2');assert.equal(c.stack[0],'1.14042');assert.equal(c.lastX,'1.2345');
 run('g 2',c);assert.equal(c.stack[0],'1.2345');
 assert.equal(run('1.2345 CHS f 2').stack[0],'-1.14042');
 assert.equal(run('1.14042 CHS g 2').stack[0],'-1.2345');
});
test('degree/radian conversions operate independently of angle mode',()=>{
 const c=run('40.5 f 3');assert.equal(c.stack[0],'0.7068583471');
 run('g 3',c);assert.equal(c.stack[0],'40.5');
 assert.equal(run('g 9 180 f 3').stack[0],'3.141592654');
});
test('polar and rectangular replace X/Y, preserve Z/T, save original X',()=>{
 const c=run('99 ENTER 5 ENTER 10 g 1');assert.deepEqual(c.stack,['11.18033989','26.56505118','99','0']);assert.equal(c.lastX,'10');
 assert.deepEqual(run('3 ENTER 4 CHS g 1').stack.slice(0,2),['5','143.1301024']);
 assert.deepEqual(run('30 ENTER 12 f 1').stack.slice(0,2),['10.39230485','6']);
 assert.deepEqual(run('0 ENTER 0 g 1').stack.slice(0,2),['0','0']);
});
test('factorial includes Gamma and rejects negative-integer poles',()=>{
 for(const [seq,value] of [['0 f 0','1'],['8 f 0','40320'],['0.5 CHS f 0','1.772453851'],['1.5 CHS f 0','-3.544907702'],['0.5 f 0','0.8862269255'],['69 f 0','1.711224524e+98']])assert.equal(run(seq).stack[0],value,seq);
 assert.equal(run('2 CHS f 0').error,true);assert.equal(run('70 f 0').overflow,true);
});
test('permutations/combinations have original operand order and domain limits',()=>{
 assert.equal(run('5 ENTER 2 f +').stack[0],'20');
 assert.equal(run('52 ENTER 4 g +').stack[0],'270725');
 assert.equal(run('9999999999 ENTER 1 g +').stack[0],'9999999999');
 assert.equal(run('5 ENTER 0 g +').stack[0],'1');
 for(const seq of ['2 ENTER 3 f +','2.5 ENTER 1 g +','2 CHS ENTER 1 g +','1 EEX 10 ENTER 2 g +'])assert.equal(run(seq).error,true,seq);
 assert.equal(run('9999999999 ENTER 9999999999 f +').overflow,true);
});
