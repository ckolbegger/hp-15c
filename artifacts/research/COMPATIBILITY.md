# Computation release: coverage and compatibility

This release implements the nonprogramming calculation families specified for the HP-15C. It is a behavioral recreation, not a ROM emulator. Original manuals, photographs and independent test oracles remain in this folder. The in-app quick guide lists the physical key sequences.

## Implemented coverage

- Four-level real and imaginary stacks, LAST X, entry/exponent editing, range handling, FIX/SCI/ENG and DEG/RAD/GRAD, decimal-point/comma conventions and full-mantissa inspection.
- Real scientific operations, permutations/combinations and factorial/Gamma; supported complex arithmetic, powers, roots, logarithms, trig/inverse/hyperbolic functions, magnitude and coordinate conversion.
- Direct and indirect STO/RCL, storage/recall arithmetic, index I, exchanges, memory allocation, flags, USER matrix stepping, DSE/ISG register updates and readable predicate results.
- Reproducible random sequence with seed storage/recall; statistics accumulation/removal, means, sample deviations, regression, estimates/correlation and shared statistics registers.
- A–E matrices: dimensions, indexed/sequential elements, copy/fill, scalar/matrix arithmetic, transpose, norms, inverse, determinant/LU, linear systems, residual, MATRIX0–9 and complex packing/block transformations.
- SOLVE and integration through a constrained expression editor, including parameters and complex intermediates. Roots/sample positions are real; complex mode uses the function's real component, as in the original numerical operations.

## Intentional interface differences

No program recorder, instruction execution, labels, branches or subroutines are implemented. Those printed legends remain authentic. Shared flag/index/conditional functions operate directly; conditions are reported as text instead of skipping a nonexistent instruction. USER advances matrix indices; unshifted scientific keys remain usable, and f + a top-row scientific key also executes its primary function in USER mode. This avoids turning those keys into calls to unavailable user labels.

The function editor replaces recorded subroutines. It accepts explicit arithmetic and named functions, never arbitrary JavaScript. Enter two estimates or lower/upper bounds in Y/X, then use the calculator SOLVE/integral keys or the editor buttons. A worker keeps the UI responsive; Cancel terminates it and preserves inputs. The read-only memory inspector reveals the stack, registers and matrices without changing the face.

Momentary display functions support pointer hold/release. Keyboard activation keeps inspection visible until the next key. ON + decimal, keyboard O + decimal, or the explicit toggle changes the radix convention. The original three-second matrix-key hold-to-null cancellation gesture is not reproduced; use normal click/touch for matrix operations.

## Numerical implementation choices

Values stored in calculator registers and matrix elements are rounded to ten significant digits. Decimal arithmetic uses extra working precision. This does not claim identical last digits for every ROM routine. Real/complex forward periodic functions use the original documented 13-digit internal pi for radian reduction. Complex exponential intermediates are bounded beyond the HP component range, with asymptotic tan/tanh evaluation, so extreme finite inputs cannot freeze the UI.

The exact integer PRNG recurrence is independently documented by J. E. Patterson and agrees with the manual's seed example; see REMAINING-ORACLES.md. Seed normalization uses the fractional part of the absolute value, truncated to ten fractional digits. The original manual does not fully specify out-of-range normalization, so that choice is not asserted to be hardware-identical.

Matrix LU uses Doolittle elimination with partial pivoting. A zero pivot is replaced by 1e-99 so singular matrices follow the original perturbed-inverse behavior category instead of raising an invented singularity error. The exact original pivot perturbation and ill-conditioned last digits have not been reproduced. Inspect residuals when numerical conditioning matters. MATRIX6 accumulates its residual before ten-digit storage rounding. LU metadata is retained for subsequent determinant/solve operations.

SOLVE uses bounded secant steps with bracket safeguards, at most 150 iterations. It does not reproduce the ROM's complete interpolation/fallback strategy. Returned X is rounded to ten digits and Z is evaluated at that returned X. Error8 retains the best candidate and its residual. Difficult roots can require different estimates; finite sampling cannot prove root existence or uniqueness for every expression.

Integration uses adaptive Gauss–Kronrod 15/7 quadrature, capped at about 30,000 evaluations. Its uncertainty includes both the numerical quadrature estimate and integrated display uncertainty: FIX n uses 0.5*10^-n; SCI/ENG use 0.5*10^(exponent(f(x))-n). Hidden precision digits remain effective. Negative precision through I is clamped to -6 for integration uncertainty; the ordinary display uses zero places for negative precision. The sampled error estimate is not a rigorous bound for arbitrary discontinuous or sharply localized functions. Difficult integrands can exhaust the evaluation budget; split the interval or change the expression/bounds. Algorithms are cancellable and do not execute browser code from the expression.

## Memory and persistence

There are 67 registers including R0, R1 and I. R2–R65 form the 64-register configurable pool. Startup storage ends at R19, leaving 46 common registers. Complex mode costs five; each matrix element costs one. SOLVE requires five free common registers and integration 23 while running. Flags, modes, registers, matrices/LU and complex components survive reload. Interrupted number entry is committed on reload. Function text and parameters are saved separately. Error acknowledgement and running/pending operations are not resumed across reload.

Hardware battery behavior and self-tests remain excluded. Additional historical entry/rounding uncertainties from the earlier SCIENTIFIC-ORACLES and RESEARCH files remain relevant; reviewed examples establish tested fidelity, not exhaustive equivalence across every representable input.
