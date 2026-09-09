# Independent final matrix and visual review

2026-09-08. Scope: all nonprogramming matrix calculations, their keyboard/state integration, and the current assembled calculator appearance. Other scientific/complex/statistical/solver accuracy is evaluated separately by the mathematics critic. Programming is excluded by the user's request and is not deducted here.

## Weighted scores

**Visual accuracy: 9.07/10.** Case/panel proportions9.4×20% + LCD9.0×20% + keyboard geometry9.3×20% + typography/legends8.8×25% + materials/badge8.8×15%.

**Matrix functionality accuracy: 9.355/10 (9.36 rounded).** Arithmetic/transforms9.2×35% + descriptor/stack/LU state9.5×25% + restrictions/memory9.6×25% + usability/persistence9.0×15%.

These are weighted judgments supported by the checks below, not percentages of passing tests or a claim of ROM equivalence. Both scoped scores exceed9.0. The matrix score must not be relabeled as the score for every scientific function.

## Verification

All17 independently authored tests in `tests/critic-matrix.test.js` passed on the final implementation. Tests drive Calculator.press using original key sequences, rather than calling matrix operations directly:

- DIM A, USER sequential STO/RCL and row/column wrap.
- Stack-indexed STO/RCL, preserved documented stack and R0/R1.
- Redimensioning preserves linear element order.
- Descriptor register storage and serialized persistence.
- Scalar divided by matrix computes a scaled inverse.
- Illegal result alias rejects with Error11 and leaves matrices unchanged.
- Handbook A-transpose times B exact example.
- Residual R−YX and result placement.
- MATRIX2/3 complex block expansion/reduction and permutation/combination interleaved packing.
- In-place transpose, row/Frobenius norms, LASTX.
- Determinant LU placement, subsequent determinant reuse, pivoted linear solve and inverse reuse.
- Shared memory accounting, complex-stack allocation, 64-element boundary and allocation rollback.
- Descriptor misuse Error1 and invalid element Error3.

Additional direct final probes passed: scalar5 MATRIX7 and MATRIX8 remain5 and saveLASTX5 without error; USER f√x on4 gives2; USER f1/x on4 gives0.25. Earlier standalone independent module probes verified a pivoted inverse and singular inverse returning perturbed finite values rather than throwing a singularity error.

Oracles came from the archived Owner's Handbook, particularly pp142–164 and207–208, and Advanced Functions Handbook pp82–83 and98–100. Complex packing/block layouts were resolved visually from the PDF page images because extraction scrambles equation order. The manual ATB oracle is [[29,39,73],[37,51,95],[66,90,168]].

## Visual comparison and UI evidence

Independently re-inspected `artifacts/research/original-front.jpg` and compared it with the current actual-browser captures archived as `hp15c-advanced-face.png` and `hp15c-advanced-editor.png`. The original powered photograph and its attribution remain in the research dossier and informed earlier geometry/material reviews.

The whole assembled calculator retains the correct landscape silhouette, silver upper panel, inset reflective LCD, blue/silver badge,39-key arrangement and two-row ENTER. Gold legends sit above keys and blue legends below the primary white text. Corrected radical, integral bounds and opposed exchange symbols remain visible. The previously excessive horizontal metal banding has been replaced with fine grain; the materials score rises from the initial stage's8.2 to8.8 for that observed improvement. LCD background and digit/separator spacing remain close to the original.

Residual differences include exact molded-key contours, letterform weights and logo strokes. It remains a recreation, not a photographically identical device. The new collapsed function-editor/memory-inspector section sits below the calculator face. The expanded capture shows labeled expression and parameter inputs, explicit SOLVE/integration buttons, a radix toggle and readable stack/register/matrix information. These additions preserve the historical face while supporting the requested nonprogramming workflows.

Critic's CUA session still reports no browser surfaces; the parent supplied unmodified current CUA screenshots. Critic independently inspected those files. This is not described as critic-driven live-browser testing. The parent reports live storage42 STO0/RCL0, solver/integral output and cancellation checks passing; these are supplementary reported evidence. The expanded full-page capture has known browser-backend DPR/blank-area duplication artifacts; those are not asserted as app defects. Independent actual matrix descriptor/LU screenshot and touch ergonomics were not available, so they are not counted as visual passes.

## Remaining compatibility limits

- Exact original LU pivot perturbation and ill-conditioned last digits are not hardware-verified. The implementation uses a documented approximation. Ordinary matrix algebra and the tested side effects match the handbook.
- A small finite set of oracles does not prove every matrix shape, near-singular case, overflow path or long sequence. The tests provide reproducible, substantive coverage rather than exhaustive equivalence.
- Original hold-to-preview and long-hold null/cancel behavior for matrix element keys has not been independently verified here.
- Very narrow screens retain the entire landscape device and therefore have small key targets; manual touch testing remains useful.

No outstanding confirmed defect in the tested matrix calculations requires another implementation pass. Ready for manual testing, with the above limits retained in the compatibility documentation.
