# Remaining nonprogrammable functions: independent oracles

2026-09-08. Reuses local original Owner’s Handbook (1985), searchable Owner’s Handbook (2011), and original Advanced Functions Handbook (1982 content in HP’s searchable reissue). Printed page references. The research dossier contains primary URLs. Where independently reconstructed numerical behavior is used, distinguish it from HP-published evidence.

## Storage, index, flags and display

Owner pp42–45,99–100,106–109,209–219:

- STO n, RCL n, f x-exchange n support0–9 and .0–.9; .0 meansR10. I (physicalTAN, abbreviated unshifted after an operation) addresses index itself. (i) (physicalCOS) uses absolute truncated index to address R0–R65. E.g I=-12.3456 addressesR.2. No implicit modulo of nonexistent registers; Error3.
- All storage/recall/exchange operations enable lift. RCL uses previous lift to decide whether to push. STO arithmetic computes register op X without modifying stack. RCL arithmetic computes X op register without touching Y/Z/T. These operations do not save LASTX (absent from AppendixB list).
- f CLEAR REG zeros all data registers, includingI, preserves stack/LASTX, is lift-neutral. Mode selection is also neutral.
- Startup data registers R0–R19 plusI. There are67 total registers; R2–R65 are64 convertible registers. `dd f DIM (i)` (physical fSIN COS), 1≤dd≤65, sets highest data-register index. Initialdd19, uncommitted46, no program bytes. Complex stack costs5; matrix elements and numerical algorithms consume common pool. `RCL DIM (i)` recallsdd. `g MEM` (gRCL) displays `dd uu pp-b`; startup `19 46 0-0`.
- g SF n / g CF n / g F? n (physicalg4/g5/g6). Flags0–9; nonexistent flag Error6. I indirection uses absolute integer part. Flag8 enables complex; clearing it destroys imaginary stack. Flag9 manually set also blinks, whether arithmetic overflow happened or not; BACK acknowledges without clearingX. OFF clears9. Flag operations are lift-neutral. F? and program conditionals need a clear nonprogramming predicate result/UI, not hidden skipping of nonexistent program lines.
- FIX/SCI/ENG I uses integer index for precision. Integration alone recognizes negative requested precision, down to−6 (smaller interpreted−6), although visual formatting remains constrained. See Ownerp247.
- f CLEAR PREFIX held displays10-digit unsigned mantissa, terminates entry, lift-neutral. ON+decimal toggles decimal/thousands conventions; preserve numeric values. The existing full keyboard is sufficient.

## Pseudorandom numbers

Ownerpp48–49: f ENTER generates; STO f ENTER setsseed; RCL f ENTER recallsseed; f may be omitted afterSTO/RCL. Seed0 at reset. Result becomes nextseed; repeated seed repeats sequence. Range[0,1). Outside-range seed is converted; manual does not specify exact conversion.

First-hand implementation author J.E.Patterson documents replication on15C/DM15: [HP-15C random number simulator](https://www.jepspectro.com/htmDoc/Random6.htm),2023-11-19. Equivalent exact integer recurrence for ten fractional digits:

`sNext=(1574352261*s+1017980433) mod10000000000`, result=sNext/1e10.

Independent BigInt calculation fromseed.5764 yields .3421980433,.2809289446,.2131517839,.0209464412,.1649215965. Firsttwo agree with HPmanualFIX4 .3422,.2809. This recurrence is primary independent-reimplementation evidence, not a formula published byHP. Use exactinteger arithmetic; ordinary binary multiplication loses low digits. Seed normalization outside range and inputs with more than10 fractional places require explicit compatibility documentation.

## Statistics

Ownerpp49–56,205–206,212:

- f CLEAR Σ (fGSB) clears R2–R7 ANDstack, not other registers; missing statistics register Error3.
- Data y ENTER x Σ+. gΣ+ removes pair. R2=n,R3=Σx,R4=Σx²,R5=Σy,R6=Σy²,R7=Σxy. Update all six with ten-digit storage behavior. X becomesn, Y/Z/T retained; LASTX=oldX; lift disabled. One-variable input still uses whateverY is present; it does not imply a separate dataset representation.
- g0 mean givesmeanX inX,meanY inY. gdecimal sample standard deviation gives sx inX,sy inY. fΣ+ linear regression gives interceptB inX,slopeA inY. These lift twice if enabled, once ifdisabled, then enablelift. They do not saveLASTX.
- fdecimal estimate gives predictedy inX andcorrelationr inY, saves original predictionx inLASTX. It must preserve sensible two-result stack behavior; verify detailed original trace if relying on exact deeper-stack contents.
- RCLΣ+ recalls Σx intoX,Σy intoY with two-result recall lift. Searchable2011p50 prose contains an apparent swapped-name typo: numeric registers establish X=R3,Y=R5.
- Let M=nΣx²−(Σx)²,N=nΣy²−(Σy)²,P=nΣxy−ΣxΣy. A=P/M;B=(Σy−AΣx)/n;r=P/sqrt(MN);sx=sqrt(M/[n(n−1)]), similarlysy. Mean needsn≠0; sample deviation/regression/estimate needn>1 and valid denominators/radicands, elseError2. Do not silently replace degenerate regression withzero slope.
- Clean golden dataset(x,y)=(1,3),(2,5),(3,7):n3,Σx6,Σx²14,Σy15,Σy²83,Σxy34; means2/5, sample sd1/2, intercept1/slope2, predictionx4→9,r1. Remove(2,5) then meansremain2/5; n2. Original farmer data and corrected data inOwnerpp51–55 provide additional roundedexamples.

## Complex numbers and branches

Ownerpp120–134; Advancedpp59–63. Two paired four-levelstacks and pairedLASTX. `real ENTER imag f I` combines by dropping entire pairedstack, moving oldrealY→realX,oldrealX→imagX, duplicatingT. It activatescomplex automatically. fRe↔Im also activatescomplex, swappingrealX/imagX only. gSF8 activateswithout moving values; gCF8 deletesimaginary state.

CHS and CLx affect REALX ONLY. ClearingX then enteringdigits preservesimagX. Other enabling/disabling math functions cause next numeric entry/recall to zeroimagX; neutralmodecommands preserve that pendingstate. ENTER, rolls,swap,LASTX movebothstacks. STO/RCL store/recall REALcomponent only; complexstorage requires tworegisters. f(i) is momentaryheld imaginaryX display, entry-terminating and lift-neutral.

Supported complex unaryset: sqrt,square,reciprocal,exp,10power,LN,LOG,ABS,alltrig/inverse/hyperbolic,coordinateconversions. ABS returns magnitude+0i. Supported binaryset:+,−,×,÷,y^x. Other functions ignoreimaginarystack rather than applying inventedcomplexGamma/complexpercent implementations.

Complextrig usesradians regardless DEG/RAD/GRAD; coordinateconversion alone usesselectedangle mode and transformsrealX/imagX (notY/X). Ordinaryreal-only domainerror is not automaticcomplexpromotion.

Branch graphs were visually inspected from embedded figures inAdvancedpp60–62:

- LN/sqrt useArg∈(−π,π]; negative real LN has+πimag; sqrtnegative real haspositiveimag.
- ASIN isodd. Realx>1 givesnegativeimag; x<−1 positiveimag. HPgoldenASIN2.404→1.5708−1.5239i. ACOS=π/2−ASIN.
- ATAN cut above+i has+π/2real; below−i −π/2real. Formula i/2·LN((i+z)/(i−z)), with boundarycare to preserveoddness.
- ACOSH realpart≥0; imag∈(−π,π]; realx<−1 gives+πimag.
- ASINH(z)=−iASIN(iz);ATANH(z)=−iATAN(iz); power=exp(exponent·LNbase).
- HPexample sqrt((1.2+4.7i)/(2.7+3.2i))→1.0491+.2406i.
- HPphasor example2∠65°+3∠40°→4.8863∠49.9612°.

## Matrices: handoff highlights

Separate matrix critic owns detailed review. Ownerpp141–160: matrixdescriptor referencesnameA–E/currentdimensions; DIM usesYrows,Xcolumns withoutdroppingstack. Redimension preservesflattenedrow-major prefix, paddingzeros/truncatingtail. USER advancesR0/R1 throughrow-majorcells, wraps1/1. MATRIX1 setsR0=R1=1;MATRIX0 clearsallmatrices. MATRIX4 transposesinplace. MATRIX7 maxabsoluterowsum;8Frobenius;9determinant andLUreplacement.

MatrixY÷X computes inverse(X)·Y and replacesX withLU;resultcannotaliasX. Product andMATRIX5(YᵀX) cannotalias eitheroperand. MATRIX6 residual=result−Y·X, mustpreserveextendedintermediateprecision. Scalar/matrixdivision means scalar·inverse(matrix), notelementwisereciprocal. Matrix-only dimensional/domainerrors generallyError11; scalar-onlyfunction applieddescriptor Error1; badcellError3; memoryError10.

## SOLVE/integration

Originalsubroutine source is deliberately replaced by user-authored bounded mathematicalexpression (nonprogrammingrequirement). Document chosen numerical algorithm rather than claimoriginalROMiterationsequence.

SOLVE: inputY/X twoestimates. ReturnXroot,Ynearby/previousestimate,Zf(root); failedsearchError8 retainsbestcandidateX,anotherestimateY,itsresidualZ (not an untouchedinitialstack). Displayprecision doesNOTcontrolSOLVE tolerance. HPexamplex²−3x−10:estimates0/10→5;0/−10→−2. Reject falseconvergenceatpoles/discontinuities orflatnonzero functions. Originalalgorithmsecantwithbracketing+parabolicfallback; allfirstthreeoutputroles explicitOwnerp183/Advancedp11.

Integration: lowerY,upperX; outputXintegral,Yestimateduncertainty,Zupper,Tlower (Ownerp202). Reverselimits reversesign;zero-lengthinterval returns0. Originaluncertainty followsfunctiondisplayrounding: FIXn absoluteδ=.5·10^(−n);SCI/ENGn δ(x)=.5·10^(−n+floor(log10|f(x)|));reporteduncertainty approximatelyintegralδ. HiddenSCI8/9 reduceuncertainty evenwithsamevisiblemantissa. Formula andfurtheralgorithmnoise estimate mustnotbeconfused withfixedarbitraryepsilon. Domainerrors/Error0,nomemoryError10 asapplicable. Complexmodealgorithms samplealongrealaxis and usefunctionREALpart, notgeneralcomplexrootsearch (Advancedp63).

## Remaining error map

Error0 improperreal/complexmath;1unsupportedmatrixoperation;2statistics;3register/cell;4nonexistentlabel/programline(originalprogrammachineryexcluded);5nestedsubroutinecapacity(excluded);6flag;7recursiveSOLVE/integrate;8noroot;9hardwarediagnostic(excluded);10memory;11matrixarguments. Avoid returningError0 for every failure.
