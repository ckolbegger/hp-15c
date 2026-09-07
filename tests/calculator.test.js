import test from 'node:test';
import assert from 'node:assert/strict';
import {Calculator} from '../src/calculator.js';
function run(sequence, calculator=new Calculator()) { for(const key of sequence.split(' ')) { if(/^\d{2,}$/.test(key))for(const digit of key)calculator.press(digit); else calculator.press(key); } return calculator; }
const examples = [
 ['addition','2 ENTER 3 +','5'], ['subtraction order','9 ENTER 6 -','3'],
 ['division order','9 ENTER 6 /','1.5'], ['multiplication','9 ENTER 6 *','54'],
 ['manual chain','9 ENTER 17 + 4 - 4 /','5.5'],['ENTER duplicates','5 ENTER +','10'],
 ['repeat ENTER','2 ENTER ENTER ENTER + + +','8'], ['T repeats','1 ENTER 2 ENTER 3 ENTER 4 + + + +','11'],
 ['result lifts','2 ENTER 3 + 4 *','20'], ['decimal exactness','. 1 ENTER . 2 +','0.3'],
 ['negative operand','5 CHS ENTER 2 *','-10'],['negative exponent','6 . 6262 EEX 34 CHS ENTER 50 *','3.3131e-32'],
 ['edit mantissa','12345 BACK 9 ENTER','12349'], ['clear preserves Y','12 ENTER 3 g BACK 4 +','16'],
 ['backspace after result','2 ENTER 3 + BACK','0'],['ten significant digits','1 ENTER 3 / 3 *','0.9999999999'],
 ['roll stack','1 ENTER 2 ENTER 3 ENTER 4 ROLL','3'],['exchange','2 ENTER 3 SWAP','2'],
 ['last X','8 ENTER 2 / g ENTER','2'],['underflow','1 EEX 99 CHS ENTER 10 /','0'],
 ['CHS after ENTER enables lift','5 ENTER CHS 2 +','-3'],['sign before exponent digits','2 EEX CHS 3 ENTER','0.002'],
 ['repeated decimal ignored','1 . 2 . 3 ENTER','1.23'], ['ten digit entry limit','12345678901 ENTER','1234567890']
];
for(const [name,sequence,expected] of examples) test(name,()=>assert.equal(run(sequence).stack[0],expected));
test('FIX4 is presentation rounding',()=>assert.equal(run('1 ENTER 3 / 3 *').display().mantissa,'1.0000'));
test('division error acknowledges without executing key or losing stack',()=>{
 const c=run('8 ENTER 0 /'); assert.equal(c.error,true); assert.deepEqual(c.stack,['0','8','0','0']);
 c.press('7'); assert.equal(c.error,false); assert.equal(c.stack[0],'0'); c.press('2'); assert.equal(c.stack[0],'2');
});
test('overflow saturates and signals',()=>{const c=run('9 EEX 99 ENTER 9 *');assert.equal(c.stack[0],'9.999999999e+99');assert.ok(c.overflow);c.press('BACK');assert.equal(c.overflow,false);});
test('power retains stack and ignores other keys when off',()=>{const c=run('12 ENTER ON 8');assert.equal(c.on,false);assert.equal(c.stack[0],'12');c.press('ON');assert.equal(c.display().mantissa,'12.0000');});
test('unsupported shifted digit does not calculate',()=>{const c=run('12 f 7');assert.equal(c.stack[0],'12');assert.equal(c.shift,null);});
test('malformed storage is ignored',()=>{const c=new Calculator({stack:['bad','0','0','0'],lastX:'0'});assert.equal(c.stack[0],'0');});
test('EEX restrictions',()=>{for(const seq of ['12345678 EEX','. 0000001 EEX'])assert.ok(!run(seq).entry.includes('e'));});
test('reload retains stack and last X',()=>{const c=run('8 ENTER 2 /');const restored=new Calculator(JSON.parse(JSON.stringify(c.save())));assert.deepEqual(restored.stack,c.stack);assert.equal(restored.lastX,'2');});
test('overflow presentation never invents a three-digit exponent',()=>{
 const c=run('9 EEX 99 ENTER 9 *'); assert.deepEqual(c.display(),{mantissa:'9.9999',exponent:'99',negative:false});
 c.press('ON');c.press('ON');assert.equal(c.overflow,false);assert.equal(c.stack[0],'9.999999999e+99');
});
test('scientific entry reserves three positions while retaining ten mantissa digits',()=>{
 const c=run('1 . 234567890 EEX 99');assert.equal(c.display().mantissa,'1.234567');assert.equal(c.display().exponent,'99');assert.equal(c.stack[0],'1.23456789e+99');
});
test('fixed display has dedicated thousands separators',()=>assert.equal(run('12345 ENTER').display().mantissa,'12,345.0000'));
test('all ordinary entry strings fit ten numeral positions',()=>assert.equal(run('. 00000000000000000000001').display().mantissa.replace(/[^0-9]/g,'').length,10));
test('overflow does not consume calculation keys and flag survives ordinary operations',()=>{
 const c=run('9 EEX 99 ENTER 9 *');c.press('CHS');
 assert.equal(c.stack[0],'-9.999999999e+99');assert.equal(c.overflow,true);
 c.press('BACK');assert.equal(c.overflow,false);assert.equal(c.stack[0],'-9.999999999e+99');
});
test('ON acknowledges Error0 without switching off or changing operands',()=>{
 const c=run('8 ENTER 0 / ON');assert.equal(c.error,false);assert.equal(c.on,true);assert.deepEqual(c.stack,['0','8','0','0']);
});
