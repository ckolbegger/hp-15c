# Advanced computation critic — second review

2026-09-08. All nine first-review critic regression groups now pass. Rechecked root residual consistency, integration display uncertainty, memory limits and worker/UI source. Matrix review remains separate; direct browser inventory currently returns no browsers.

## Corrections verified

Complex EEX clears imaginary X appropriately, negative large ASIN/ASINH no longer throw, positive-real zero-base complex powers returnzero, expression0^0 is rejected, CLEARΣ preserves lift, and complex equality checks include imaginary parts. Root results now recompute residual at the returned ten-digit X. Failed root searches attach best-candidate diagnostics.

Memory reservation is confirmed against original Ownerp218: SOLVE5 registers, integration23. Independent threshold tests pass at5/4 and23/22 free registers. Constant integral2 over[0,3] returns display-derived uncertainty.015 atFIX2 and.00015 atFIX4; SCI7 versusSCI9 changes uncertainty by100. The worker's quadrature estimate is added separately. Reversed limits and analytic examples remain correct.

## Two remaining blocking defects

1. Complex forward trigonometry bypasses the HP internal-pi argument convention. With flag8 set, π-key SIN produces−4.102067615e−10 instead of original−4.1e−10. Large3.141592654e14 SIN produces−.7838710237 instead of original+.7990550814. Advanced Handbookp156 explicitly includes complex trigonometry and the periodic components of complex exponentials/hyperbolics in the p-dependent functions. Reuse the original reduction rather than host mathematical sine for these components.
2. Complex TANH of1e99+0i hangs synchronous computation. I interrupted the independent Node probe after it failed to return for over a minute. The correct finite result is1+0i. Use stable bounded formulas for complex hyperbolics and exponential extremes; synchronous key presses must not lock the browser. A subprocess test with a five-second bound now captures this failure safely.

The critic test file now includes12 groups, with new original-radian, memory/uncertainty and bounded extreme-input regressions. Run these after the fixes.

Current math/functionality score8.8/10. Prior six corrections are resolved, but a valid finite input can still freeze interaction and a documented forward-trig result has the wrong sign. No new visual score until a final screenshot/UI review is available.

## Explicit scope limits

The expression parser currently supports real expressions. Original complex-mode subroutines could use complex intermediate calculations and return their real part to SOLVE/integration (Advancedp63). The agreed specification permits a scalar expression replacement; document its real-only limit clearly rather than claiming full original program-driven solver capability. The selected Gauss–Kronrod and bounded root algorithms are numerical substitutes, not original ROM iteration reproduction.
