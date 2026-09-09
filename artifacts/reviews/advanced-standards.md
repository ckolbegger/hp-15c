# Advanced release: integration and standards review

Reviewed working-tree source against `6f6f8d0`, including new `advanced.js`, `complex.js`, `matrix.js`, `expression.js`, and `numerical-worker.js`. Focus: persistence, pending-key dispatch, worker isolation/cancellation, and integration. Formula fidelity is reviewed separately by the math critics. No repeated full test run; used focused engine probes.

## Required corrections

1. **Complex state survives replacement by real numerical results.** `Calculator.completeNumerical()` replaces the real stack but leaves the imaginary stack untouched. The numerical request handler accepts complex mode. Reproduced with X = 4 + 5i and Y = 2 + 3i: completing a real root result of 1 leaves X = 1 + 5i, which corrupts subsequent complex arithmetic. Either explicitly reject unsupported complex numerical requests, or define and implement real-result imaginary-stack semantics consistently for SOLVE and integration.

2. **Numerical overflow is not persisted.** `completeNumerical()` calls `normalize()`, which sets `overflow`, but bypasses `press()`'s synchronization into flag 9. Probe: integrating a result of `1e101` produces `overflow === true`, `flags[9] === false`; reloading `save()` clears overflow. Synchronize flag 9 when the worker result is applied.

## Other observations

The expression evaluator uses a restricted grammar rather than JavaScript evaluation, caps expression length/token count/depth, and numerical routines have iteration/evaluation budgets. Workers keep numerical evaluation off the UI thread and expose explicit termination. The calculator blocks other key actions during a run. Advanced mutations have rollback on errors, and persisted numeric/register/matrix states are validated before restoration. No additional concrete blocking defect was established in those areas.

Result: **2 required integration corrections**. Recheck the focused cases after fixes.

## Resolution verification

Both required corrections are resolved. Independently reran focused assertions on the updated code:

- SOLVE and integration completion now clear the imaginary output stack; subsequent addition in complex mode remains real.
- An integration result of `1e101` saturates with both `overflow` and flag 9 set; save/reload preserves the overflow indication.

Final result: **0 outstanding integration findings**. This recheck covered the two reported defects, without repeating the full suite or expanding review scope.
