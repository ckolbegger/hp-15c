# Scientific release: standards review

Reviewed the working-tree changes against `d64efa2`, including the new bindings, formatting, mathematics and scientific tests. No repository-specific coding standards file was found. Applied the supplied simplicity/surgical-change guidance and the code-review skill's Fowler smell baseline. Mathematical fidelity is assessed separately by the math critic.

## Hard defects and standards violations

None found. The numerical helpers are separated from input/stack state; shifted-key routing has one mapping; numerical precision is centralized; the new work uses the existing Decimal representation and testing style. Scope remains within the selected function groups and visual correction. Independently ran `npm test`: all 55 tests passed.

## Optional heuristic finding

Possible **Mysterious Name / readability** concern in `src/calculator.js`, the new binary-function branch: `const result = ['PERMUTE','COMBINE'].includes(key) ? ... : key === 'POWER' ? ... : key === 'PERCENT' ? ... : y.isZero() ? ...`. The nested expression combines operation dispatch and the percent-change domain check on one long line. A small explicit conditional block would make each operation easier to inspect when another family is added. This is an optional readability improvement, not a correctness defect or a request for architectural refactoring.

Result: **0 blocking findings; 1 optional readability finding**.
