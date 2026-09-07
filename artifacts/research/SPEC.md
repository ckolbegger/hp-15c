# HP-15C nonprogrammable browser application specification

Status: staged application contract, 2026-09-07. User approved original 1982 appearance and first-stage arithmetic. Evidence and exact legends: [research dossier](RESEARCH.md). Future stages below are implementation planning, not a claim of current functionality.

## Product outcome

A standalone local browser calculator that feels like using an original HP-15C. Default view contains a faithful landscape calculator with complete keyboard and readable reflective segmented LCD. Mouse, touch and keyboard produce the same engine actions. Numeric behavior follows the archived original HP handbook. The eventual application supports every nonprogramming mathematical capability, including an alternative function-input mechanism for SOLVE and integration. No instruction recorder or user-program execution is required.

Keep calculation logic independent of rendering. Expose deterministic action/state transitions so tests can inspect X/Y/Z/T, LAST X, entry/lift state and annunciators without scraping pixels. UI must render engine state, never independently recompute arithmetic. Store key metadata centrally so legend position, hit targets, accessibility names and shift dispatch cannot diverge.

## Stage 1: faithful face and RPN arithmetic

### Required active behavior

- All digits, decimal point, ENTER, CHS, EEX, backarrow, g CLx, + − × ÷, ON. Include R↓, x⇄y and g LSTx to inspect/use the four-level stack. f/g may show prefix state, but pending unsupported shifted actions must not accidentally execute the unshifted operation.
- Ten-significant-digit values with authentic four-level stack, LAST X, lift enable/disable and explicit editable mantissa/exponent state. Follow research semantics. Separate FIX4 formatted view from stored values.
- Error 0 for zero divisor, acknowledge on next key without executing it; preserve prior operands. Handle overflow saturation/blink and underflow; guard against NaN/Infinity exposure.
- ON blanks/reveals the display and retains state. Preserve useful calculator state over reload using local storage; malformed/stale persistence should initialize a clean compatible state.
- Full remaining keyboard is visibly complete but unsupported calculations are inert. Clearly describe stage-one support outside the physical face, preferably via concise help. No invented answer or silent arithmetic fallback for unsupported shifted keys.
- Suggested desktop mapping: digits/decimal and + − * / directly, Enter for ENTER, Backspace for backarrow, Delete for CLx, E for EEX, a documented sign shortcut such as C for CHS, f/g for prefixes. Prevent browser navigation or duplicate key activation. Ignore command/control/option shortcuts and typing in other fields. Any final mapping must be discoverable in help.

### Appearance and generated assets

Use original-front.jpg as straight-on layout reference and reference-front-powered.jpg to check material and segment appearance. Match overall case proportion, upper silver panel, badge, display window, black perimeter, keyboard border, four-row/ten-column spacing, narrow gaps, double-height ENTER and all 39 keys. Transcribe every label exactly from RESEARCH.md. Preserve gold above-key labels and blue key-slope labels; never put all three legends on a flat modern button.

Generate raster art for key surfaces and LCD material as requested; archive generation prompts and provenance. Use separate live digit/legend rendering where needed for exactness, legibility and interaction. Generated art containing malformed characters must not be accepted as a reference source. A generator can approximate materials but does not establish exact historical fidelity; critic judgment decides visual accuracy. Keep reference photographs separate from generated assets.

The face should remain fully visible at normal desktop size; scale uniformly for narrow viewports. At phone widths, preserve proportions, readable labels at useful zoom, and hit-target alignment. Focus indication may appear during keyboard navigation without permanently changing the historical face. Each physical key is one accessible button with a meaningful name; expose the current display as readable text to assistive technology. Annunciators are state dependent rather than permanently printed active text.

### Acceptance examples

Each sequence starts from clean zero state unless specified. Commas are display grouping; entry is separate from formatted result.

| Case | Sequence | Expected |
|---|---|---|
| Addition | 2 ENTER 3 + | 5.0000 |
| Subtraction order | 9 ENTER 6 − | 3.0000 |
| Division order | 9 ENTER 6 ÷ | 1.5000 |
| Chain | 9 ENTER 17 + 4 − 4 ÷ | 5.5000 |
| Multiply | 9 ENTER 6 × | 54.0000 |
| ENTER duplicate | 5 ENTER + | 10.0000 |
| Repeated ENTER | 2 ENTER ENTER ENTER + + + | 8.0000 |
| T replication | 1 ENTER 2 ENTER 3 ENTER 4 + + + + | 11.0000 |
| New result entry lifts | 2 ENTER 3 + 4 × | 20.0000 |
| Decimal | .1 ENTER .2 + | 0.3000 |
| Negative operand | 5 CHS ENTER 2 × | −10.0000 |
| Negative exponent | 6.6262 EEX 34 CHS ENTER 50 × | 3.3131 −32 |
| Edit | 12345 backarrow 9 ENTER | 12,349.0000 |
| Clear X only | 12 ENTER 3 g CLx 4 + | 16.0000 |
| Backarrow after result | 2 ENTER 3 + backarrow | 0.0000; deeper stack preserved |
| Divide zero | 8 ENTER 0 ÷ | Error 0; next 7 acknowledges only; next 2 begins replacement entry |
| Stored precision | 1 ENTER 3 ÷ 3 × | 0.9999999999 internally, displays 1.0000 |
| Roll | 1 ENTER 2 ENTER 3 ENTER 4 R↓ | 3.0000; all values retained |
| Exchange | 2 ENTER 3 x⇄y | 2.0000; Y=3 |
| LAST X | 8 ENTER 2 ÷ g LSTx | 2.0000; Y=4 |
| Power | calculate 12; OFF; ON | 12 retained |
| Overflow | 9 EEX 99 ENTER 9 × | signed largest value, blinking |
| Underflow | 1 EEX 99 CHS ENTER 10 ÷ | 0.0000 |

Check EEX eligibility boundaries, ten-digit entry limit, duplicate decimal points, rapid clicks, physical keys, disabled functions, focus, narrow viewport and reload. Entry-edge cases explicitly marked uncertain in research require a documented test oracle; do not silently promote assumptions to historical facts.

## Stage 2: real scientific functions and operating modes

Activate reciprocal, square/root, yˣ, exponentials/logarithms, π, ABS/INT/FRAC/RND, factorial/Gamma, trig/inverse trig, hyperbolic/inverse hyperbolic, percentage/difference and all coordinate/time/angle conversions. Add FIX/SCI/ENG 0–9 and radix convention with exact ten-position formatting. Implement every domain error and branch of each function from Appendix A. Every function needs at least a handbook example, boundary case and stack/LAST X test. Degrees/Radians/Grads persistence and respective annunciators are part of completion.

## Stage 3: storage, probability and statistics

Activate direct/indirect STO/RCL and storage arithmetic, index I and exchanges, register clearing, numeric memory allocation, random seed store/recall and original reproducible generator, permutations/combinations, Σ+/Σ− and clearing, means, sample deviations, regression, estimates/correlation. Preserve documented register use, return positions, stack effects and insufficient-data errors. Match published examples and independent formulas, including negative/mixed data and degenerate regressions. Provide storage inspection in optional help/tools if useful, not as an alteration to the calculator face.

## Stage 4: complex and matrix calculations

Represent real numbers, complex stack components and matrix descriptors distinctly. Implement complex mode creation/removal and real/imaginary manipulation before enabling complex functions. Validate branch behavior and radians exception against the Advanced Handbook.

Implement A–E matrices, dimensions and original memory limits, element access including index mode, result designation, USER stepping, copy/fill, transpose and all scalar/matrix arithmetic. Complete MATRIX 0–9, inverse/LU/determinant, norms, residual and complex-matrix transformations. Test in-place restrictions, incompatible/singular/ill-conditioned cases, scalar/descriptor misuse and original error codes. Reuse handbook examples for real and complex AX=B.

## Stage 5: nonprogrammed solver and integration

Provide an explicit mathematical expression input outside the historical face for f(x), with a constrained parser supporting implemented scalar functions, constants and parameters. Do not evaluate arbitrary JavaScript. This is an intentional UI extension replacing the original requirement to record a labeled subroutine. The calculator SOLVE/integral keys consume that selected function plus original stack estimates/bounds. An empty function must explain what is missing, not perform an unrelated operation.

Match return-stack arrangement, root failure diagnostics, tolerance/display relationships and cancellation. Explain convergence/uncertainty as the original manual does; numerical integration is not symbolic antiderivation. Verify smooth roots, multiple roots, no-root cases, discontinuities, ordinary integrals, reversed bounds, near-zero results and difficult integrands against the Advanced Handbook. Original numerical behavior is the target, but exact algorithm reproduction requires research and tests; faster host hardware must not be mistaken for higher numerical fidelity.

## Exclusions and compatibility decisions

No program editor, instruction memory execution, labels, branches, subroutines, loops or single-stepping. These legends remain because they are part of the original keyboard. Retain shared numeric uses of USER/I/flags rather than discarding entire keys. Hardware battery depletion and physical self-tests are out of scope. Offline browser operation and persistence replace physical Continuous Memory. Record intentional differences and unresolved last-digit issues in a visible compatibility note.

## Required critic/build loop

After the initial build is running, invoke an independent critic agent. Give it this spec, the research folder and application URL/start instructions. It must inspect original photographs itself, compare a matching app capture in detail, exercise visible controls plus keyboard and reuse documented numerical tests. Evaluate the current stage, not unimplemented later-stage functions.

Compute visual score /10 from case/panel proportions (20%), LCD/segments (20%), keyboard geometry (20%), typography/complete legends (25%), materials/colors/badge (15%). Compute functionality score /10 from arithmetic/numeric fidelity (30%), stack/entry semantics (30%), editing/errors/range (20%), input/persistence/usability (20%). A weighted score must be accompanied by observations and tests, not just a number. Unverified checks are not passes. Store report, captures, test cases, scores and actionable corrections in artifacts for each iteration.

If either score is below 9.0, developer corrects the concrete issues and the critic retests. At most three total evaluations/build iterations. Stop for user manual testing once both scores meet 9.0, or after iteration three; final handoff states scores, remaining limitations and how to run/use the app. The user's wording also says 'exceed'; aim for greater than 9.0 rather than a borderline pass.
