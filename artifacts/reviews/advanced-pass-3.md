# Advanced computation critic — final review

2026-09-08. Scope: storage/index, random sequence, statistics, flags, complex numerical functions/state, safe expression evaluation, SOLVE and integration worker contracts. Matrix findings and their score are recorded by the separate matrix reviewer.

## Result

Functionality/math:9.4/10. No remaining blocking findings in this reviewed scope. All12 critic groups passed after the second round of corrections, including the bounded subprocess test for complex TANH(1e99). A thirteenth regression group preserves the independently verified new complex-expression examples.

Weighted score: ordinary numerical results30%(9.7), state/storage/statistics25%(9.6), complex branches and range25%(9.3), numerical algorithm fidelity20%(8.7). This score acknowledges the documented bounded replacement algorithms and unresolved exact-ROM edge conventions; it is not a claim of bit-identical hardware emulation.

## Final fixes independently verified

- Complex forward periodic functions now use HP internal-pi reduction, reproducing both the π-key and large-radian handbook oracles.
- Extreme complex hyperbolics terminate promptly; the former1e99 TANH browser-lock case now returns1+0i. Bounded exponential intermediates and asymptotic tan/tanh branches avoid runaway evaluation.
- All prior EEX imaginary-state, CLEARΣ lift, complex predicate, zero-base power, large inverse-function and parser-domain regressions pass.
- SOLVE returns a ten-digit root and residual evaluated at that exact returned value. The worker returns best-candidate diagnostics with Error8. Independent no-root/discontinuity probes fail rather than returning misleading roots.
- Integration uncertainty follows FIX versus SCI/ENG display semantics in addition to numerical quadrature error. Memory thresholds exactly match original5-register SOLVE/23-register integration requirements, confirmed against Ownerp218.

## Worker and expression verification

Independent module-level worker simulations returned:

- SOLVE x²−2: X1.414213562,Y1.414213562,Z−1.055272156e−9, consistent with evaluating the returned root.
- Integral of abs(1+i) over[0,1] in complex mode: approximately1.414213562, with FIX4 uncertainty approximately.00005.
- SOLVE x²+1: Error8 plus finite best-candidate X/Y and f(X), rather than an untouched input stack.

Complex expression examples abs(1+i), sqrt(-1)*sqrt(-1), abs(complex(3,4)) and zero raised to1+i return sqrt2,−1,5 and0 respectively. The real-component output follows the original real-axis SOLVE/integration convention while permitting complex intermediates. This resolves the real-only expression limit noted in the previous report.

## UI evidence and visual scope

The parent developer reports live UI storage, sqrt2 SOLVE and x² integration checks passed; integration displayed X≈.3333333333,Y≈.00005,Z1,T0. Direct critic browser discovery still returned no browsers, so these live actions are developer-supplied evidence. Final screenshot inspection, when supplied, is recorded below. The previous independent face comparison scored9.05/10; do not reinterpret that as a new live-browser visual measurement.

The source shows calculator keys blocked during worker execution, explicit cancellation, and preservation of input values on cancellation. Final documentation should keep the remaining algorithm/seed-normalization and historical compatibility qualifications visible.

## Final supplied captures and approval

Critic inspected /tmp/hp15c-advanced-face.png and /tmp/hp15c-advanced-editor.png. The face retains the complete keyboard, smooth silver plate, segmented LCD and existing case geometry. The face capture visibly reports cancellation with X1.0000. The editor capture shows the mathematical expression and parameter controls, operation buttons and stack/register/matrix inspector. Full visual comparison and its final score belong to the separate visual/matrix critic; this report's final score is9.4/10 for its mathematical/functionality scope.

Parent live evidence additionally confirms Cancel preserved X1/Y0, SOLVE displayed the consistent rounded root and residual in the inspector, and x² integration returned X≈.3333333333,Y≈.00005,Z1,T0. These are explicitly developer-supplied live observations; engine and worker checks above were independently performed by this critic.

Approved. No outstanding blocking corrections in the reviewed mathematical scope. Exact ROM iteration sequences, final-digit edge behavior, seed normalization outside the ordinary interval and original physical timing remain qualified in the compatibility documentation.
