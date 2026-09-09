# Advanced computation critic — first implementation review

2026-09-08. Scope: storage/index, random sequence, statistics, flags, complex mathematics and state, expression parser, root finder and quadrature. UI integration is still in progress; no new visual score is assigned. Matrix review is separate.

Independent regressions are in tests/critic-advanced.test.js. Initial result: four groups passed and five failed. Reused original Owner’s Handbook and Advanced Handbook via REMAINING-ORACLES.md.

## Required corrections

1. Complex EEX entry after ENTER retains the previous imaginary X component. `2 ENTER 3 f I ENTER EEX 2` produces100+3i; expected100+0i, with2+3i retained inY. EEX bypasses the imaginary clearing applied by ordinary digit entry.
2. Complex ASINH(-1e30) and ASIN(-1e30) throw Error0 through catastrophic cancellation. Both are valid. Expected rounded results are-69.77069997+0i and-1.570796327+69.77069997i. Use stable symmetry/branch formulas, including large complex arguments; increasing a finite fixed precision alone does not solve the full range.
3. Complex0^(1+i) is rejected, although the original Error0 domain rejects zero base only when Re(exponent)≤0. Positive real exponent part should givezero even with a nonzero imaginary part.
4. The expression evaluator returns1 for0^0 while the calculator rejects it. Share the original power domain convention so SOLVE/integration cannot silently evaluate an invalid expression differently from the keys.
5. CLEAR Σ resets lift todisabled. AppendixB lists it as neutral. It must preserve prior lift while clearing statistics and stack. Reproducer `2 ENTER + f CLEAR Σ 1 f FIX 4 2 +` should return3, currently2.
6. The implemented x=0 predicate ignores imaginary X. For0+i it reports true, contrary to the original complex predicate semantics. Also inspect TEST0,5,6 for complex equality and inequality; other relational tests intentionally inspect real components.

## Passed checks

Exact four-term seeded PRNG with intervening recall; negative-index indirection; STO and RCL arithmetic operand order and LASTX preservation; golden statistics registers; two-result mean lift in enabled and disabled states; regression prediction stack and LASTX; CLx preservation of imaginary X; documented ASIN2.404 branch; ATAN2i branch; parser power associativity/unary precedence/property rejection; analytic quadrature and reversed bounds. Additional direct root probes found sqrt2 and rejected x²+1 and1/(x−1), avoiding an obvious false-root result.

## Deferred verification

Final UI must return solver failure diagnostics inX/Y/Z, integrate intoX/Y/Z/T with uncertainty/upper/lower in correct positions, and document how display precision changes integral uncertainty. The current quadrature function estimates numerical quadrature error; that is not by itself the original HP display-derived uncertainty model. Safe worker cancellation and renderability also await UI review.

Current scoped functionality/math score:8.2/10. Core ordinary operations work, but valid complex inputs can fail and state transitions differ from documented behavior. Correct the six findings and rerun the independent tests before rescoring. This score does not evaluate not-yet-integrated UI or matrices.
