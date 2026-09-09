// Row-major transcription of the original 1982 faceplate. ENTER spans rows 3–4.
export const keys = [
 ['SQRT','√x̅','A','x²'],['EXP','eˣ','B','LN'],['POW10','10ˣ','C','LOG'],['POWER','yˣ','D','%'],['RECIP','1/x','E','Δ%'],['CHS','CHS','MATRIX','ABS'],['7','7','FIX','DEG'],['8','8','SCI','RAD'],['9','9','ENG','GRD'],['/','÷','SOLVE','x≤y'],
 ['SST','SST','LBL','BST'],['GTO','GTO','HYP','HYP⁻¹'],['SIN','SIN','DIM','SIN⁻¹'],['COS','COS','(i)','COS⁻¹'],['TAN','TAN','I','TAN⁻¹'],['EEX','EEX','RESULT','π'],['4','4','x⇄','SF'],['5','5','DSE','CF'],['6','6','ISG','F?'],['*','×','∫ʸˣ','x=0'],
 ['RS','R/S','PSE','P/R'],['GSB','GSB','Σ','RTN'],['ROLL','R↓','PRGM','R↑'],['SWAP','x⇄y','REG','RND'],['BACK','←','PREFIX','CLx'],['ENTER','ENTER','RAN #','LSTx'],['1','1','→R','→P'],['2','2','→H.MS','→H'],['3','3','→RAD','→DEG'],['-','−','Re⇄Im','TEST'],
 ['ON','ON','',''],['f','f','',''],['g','g','',''],['STO','STO','FRAC','INT'],['RCL','RCL','USER','MEM'],['0','0','x!','x̄'],['.','•','ŷ,r','s'],['SUM','Σ+','L.R.','Σ−'],['+','+','Pᵧ,ₓ','Cᵧ,ₓ']
].map((k,i)=>({id:k[0],label:k[1],gold:k[2],blue:k[3],row:i<30?Math.floor(i/10):3,col:i<30?i%10:i-30+(i>=35?1:0)}));
export const available = new Set(['STO','RCL','SUM','SIN','COS','TAN','SQRT','EXP','POW10','POWER','RECIP','CHS','EEX','ENTER','BACK','ROLL','SWAP','ON','f','g','0','1','2','3','4','5','6','7','8','9','.','+','-','*','/']);
export const keyNames = {CHS:'Change sign',EEX:'Enter exponent',ENTER:'Enter',BACK:'Backspace',ROLL:'Roll stack down',SWAP:'Exchange X and Y',ON:'Power',f:'Gold shift',g:'Blue shift','/':'Divide','*':'Multiply','-':'Subtract','+':'Add','.':'Decimal point'};
