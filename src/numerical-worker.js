import {compileExpression,solveRoot,integrate} from './expression.js';
self.onmessage=({data})=>{
  try {
    const fn=compileExpression(data.expression,data.parameters,data.angleMode,data.complexMode);
    const result=data.operation==='SOLVE'?solveRoot(fn,data.y,data.x):integrate(fn,data.y,data.x,data.tolerance,data.format);
    self.postMessage({result:Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.toString()]))});
  }catch(error){self.postMessage({error:error.message,best:error.best?Object.fromEntries(Object.entries(error.best).map(([k,v])=>[k,v.toString()])):undefined});}
};
