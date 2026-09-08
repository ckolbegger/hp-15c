# Scientific pass 3 — independent critic

2026-09-07. Scope: signed decimal-hours/H.MMSS conversions, degrees/radians conversion, rectangular/polar coordinates, factorial/Gamma and permutations/combinations. Also checked complete scientific change against baseline d64efa2 and the agreed three implementation groups. Research reused: original Owner’s Handbook pp25–31,47–48,205–206,212 and archived SCIENTIFIC-ORACLES.md.

## Independent evidence

- Full55-test suite passed, including all38 original arithmetic regressions.
-64 independent combination/permutation cases compared against Python exact integer math across n=0,1,5,20,69,100,200 with boundary, small and central r; all passed, including overflow classification.
-21 factorial/Gamma probes included ordinary positive/negative fractions, large negative values and five inputs immediately beside negative poles. Sixteen ordinary cases agree with independent Python gamma to ten-digit rounding tolerance. The five near-pole binary-float comparisons are not reliable decimal oracles: conversion to binary changes the tiny distance from a pole. Direct asymptotic checks support the engine’s scale/sign there, but this is explicitly not a hardware-trace comparison.
- Twelve coordinate round trips covering all four quadrants in DEG/RAD/GRAD reproduced the original3/4 components at ten significant digits. Checked axes and radius1e99 cases separately.
- Four unrounded time round trips, including negative and fractional-second inputs, returned original decimal hours. Documented1.2345→1.14042 example remains covered by suite.
- Independent physical dispatch f+/g+ with stack X2,Y5,Z8,T9 returned20/10, dropped Y/Z to8/9, repeated T9 and saved LASTX2. g1/f1 coordinate operations preserved Z8/T9 and saved originalX. Negative HOURS preserved deeper stack and saved originalX.

## Scope and spec audit

The combined release implements all three selected groups: real unary/log/power/percent manipulation; display and angle modes plus trig/inverse/hyperbolic families; time/coordinate conversions and factorial/combinatorics. Physical gold/blue legend bindings agree with archived keyboard transcription. Prior arithmetic remains covered. Original radian precision and hidden SCI/ENG precision remain explicitly documented.

Storage, statistical accumulation/regression, random sequence, complex numbers, matrices, SOLVE/integration, full-mantissa inspection, radix switching and program machinery remain deferred, matching the selected release scope. This is not a claim that all future nonprogrammable calculator functionality has shipped.

Documentation correction supplied to developer: the README Stage-one section still had a present-tense statement that all scientific functions were inactive. Remove or mark that statement as historical so it does not contradict the release inventory.

## Scores and decision

Implemented functionality/math:9.5/10. Weighted results40%(9.8), stack/LASTX25%(9.7), domains/overflow20%(9.2), historical fidelity15%(8.8). No blocking implementation corrections were found. Factorial poles, zero-vector polar angle and tangent-pole signs remain compatibility choices rather than independently traced original hardware behavior.

Visual:9.05/10 carried from the independent pass1 comparison against original-front.jpg and pass2 supplied screenshot inspection. No new calculator-face geometry was introduced in pass3; the new quick guide is outside the face. This is a retained score, not a claim of a new independent live-browser session. Parent will supply final live UI evidence; append that separately.

Approved for manual testing after the documentation correction and final browser verification. There is no need for another numerical implementation pass based on this review.

## Final supplied UI evidence

Developer completed live mouse/keyboard sequences52 ENTER4 g+→270,725.0000;-.5 f0→1.7725;5 ENTER10 g1→11.1803 then x⇄y→26.5651. Critic independently inspected /tmp/hp15c-scientific-pass-3.png:26.5651 is visible, full keyboard and clean metal plate are retained, no obvious visual regression. Visual score9.05/10 confirmed for this supplied capture. README stale wording was fixed. Final verdict: approved, math9.5/10 and visual9.05/10; no outstanding blocking corrections.
