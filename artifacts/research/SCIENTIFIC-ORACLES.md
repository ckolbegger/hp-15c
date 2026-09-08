# Scientific-function test oracles

Independent critic research, 2026-09-07. Primary sources already archived: Owner’s Handbook (1985 original and searchable2011), Advanced Functions Handbook (1982). URLs and provenance in RESEARCH.md. Page references below are printed pages.

## Stack and input invariants

Owner’s pp24–35,209–212: unary mathematics replaces X, preserves Y/Z/T, saves old X in LASTX, terminates entry, enables lift. This covers ABS, INT, FRAC, RND, reciprocal, factorial, sqrt/square, trig/inverse/hyperbolic, logs/exponentials, time/angle conversions. CHS differs: no LASTX save. Binary arithmetic, power, permutations/combinations drop stack: Y=oldZ, Z=oldT, T retained, LASTX=oldX. Percent/delta-percent save LASTX but leave Y/Z/T intact. Coordinate conversions replace X/Y together, preserve Z/T, save oldX in LASTX.

Display and angle-mode changes terminate entry but preserve existing lift state. `2 ENTER f FIX 2 3 +` →5. π is recalled constant respecting lift, internally3.141592654; does not replace LASTX. Domain error acknowledgment restores prior values and consumes acknowledgment key.

## Numerical examples and domains

Owner’s pp24–31,205–206:

| Function | Oracle |
|---|---|
| INT/FRAC | -123.4567 →-123/-.4567; truncate toward zero |
| reciprocal |25→.04; zero Error0 |
| sqrt/square |sqrt3.9 FIX4→1.9748;12.3²→151.29; negative sqrt Error0 |
| LN/exp | LN45 FIX4→3.8067;exp3.4012→30.0001; LN≤0 Error0 |
| LOG/10^x | LOG12.4578→1.0954;10^3.1354→1365.8405; LOG≤0 Error0 |
| power |2^1.4→2.6390;2^-1.4→.3789;(-2)^3→-8 |
| power domains | Negative Y needs integer X; zero Y needs X>0;0^0 Error0 |
| percent |Y15.76 X3→X.4728,Y15.76; subsequent+→16.2328 |
| delta-percent |Y15.76 X14.12→FIX4 -10.4061,Y retained;Y=0 Error0 |
| factorial |8!=40320;0!=1; integers0..69 fit; fractional x means Γ(x+1), including negative nonintegers.(-.5)!=1.772453851;(-1.5)!=-3.544907702. Negative integers are poles |
| P/C |5P2=20;5C2=10; require integers0≤X≤Y<1e10 |
| inverse trig |ASIN/ACOS require absoluteX≤1; ATAN finiteX; selected angle units |
| inverse hyperbolic |ACOSH X≥1; ATANH Error0 only for absoluteX>1 per appendix. Endpoints±1 should distinguish overflow from domain error |
| H.MS/H |1.2345→1.14042→1.2345; negative sign applies to entire value |
| RAD/DEG |40.5 degrees→FIX4 .7069→40.5000 |
| polar |Y5 X10→X11.18033989,Y26.56505118 degrees;Y3 X-4→X5,Y143.1301024; angle[-180,180] |
| rectangular |Y30 X12→X10.39230485,Y6; uses selected mode |

Factorial pole handling and zero-vector polar angle deserve an explicit compatibility decision if no original trace is available. ATANH endpoint signed saturation follows mathematical infinity and appendix’s strict domain inequality; label this inference.

## Display and RND

Owner’s pp58–60: FIX n fractional places; SCI n additional significant digits; ENG n additional significant digits, NOT n engineering-mantissa fractional places. ENG exponent multiple3.

-123.4567895 SCI6→1.234568 exponent02; SCI8→1.234567 exponent02. SCI7/8/9 round hidden requested digit, then show six fractional digits; carries can affect visible digits.
- .012345 ENG1→12. exponent-03; ENG3→12.35 exponent-03; times10→123.5 exponent-03.
- RND changes internalX to requested precision, including hidden SCI7–9 digits. Format changes alone do not changeX.

## Original radian trigonometry

Advanced pp150–157: internal p=3.141592653590; HP computes trig(x·π/p), NOT mathematical trig(x). Key π=3.141592654. Original oracles:

- RAD π-key SIN→-4.100000000e-10, neither0 nor host sin(3.141592654).
- RAD314159265400000 SIN→.7990550814 (ordinary sine has opposite sign).
- RAD104348 SIN→-.00001100815000.

Decimal-modulo reduce by2p and center around nearest zero before scaling to host radians, avoiding binary cancellation nearπ. DEG/GRAD likewise need decimal argument reduction before conversion. Exact quadrants should return exact zero; tangent poles need explicit handling. Rectangular conversion also uses p in RAD (Advanced p156); inverse real trig is not listed among p-dependent functions.

Advanced pp150–151: algebraic functions round correctly; extreme transcendental results may differ by several final-place units. Common host-math examples alone do not establish ROM identity.

## Gamma implementation method

Fractional factorial uses Γ(x+1) via the recurrence and reflection identities in [NIST DLMF5.5](https://dlmf.nist.gov/5.5), and six terms of the log-Gamma expansion in [DLMF5.11.1](https://dlmf.nist.gov/5.11#E1). Positive arguments are shifted to at least40 before expansion; the first omitted term is below1e-23 there. Arithmetic uses40 decimal working digits, with final HP10-digit rounding. Nonnegative integer factorials use exact products. Negative integer poles produce Error0. Negative nonintegers below-200 underflow at HP storage precision; x≥70 overflows. This approximates the mathematical Gamma function rather than claiming HP firmware internals.

Permutations/combinations require0≤r≤n<1e10 integers. Combinations use symmetry min(r,n-r). Products stop once final magnitude is certain to exceed HP range; a selected count over1000 after symmetry already guarantees overflow, keeping extreme input bounded.

Zero rectangular vector is assigned polar angle0 as an explicit compatibility choice without a hardware oracle. Tangent singularity sign and ATANH endpoint overflow remain inferences from the handbook’s domain/error list.
