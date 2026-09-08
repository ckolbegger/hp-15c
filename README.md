# HP-15C

A standalone browser recreation of the classic 1982 Hewlett-Packard HP-15C. The scientific-function release adds reviewed real-number mathematics to the original RPN keyboard. It is a behavioral implementation, not a ROM emulator or an official HP product.

## Run

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev -- --port 1515
```

Open http://127.0.0.1:1515/. For production, `npm run build` generates `dist`; `npm run preview` serves that build locally. All calculator assets and computation are local; no service or API key is required to run it.

## Stage one

The four-level X/Y/Z/T stack supports ENTER, digits, decimal, CHS, EEX, backspace, clear X, and addition, subtraction, multiplication and division. R↓, x⇄y and g LSTx are included for stack use. Values are rounded to ten decimal significant digits; the default view is FIX4. Power retains the calculator state. Reload retains registers, LAST X and stack-lift state; an unfinished entry becomes a committed value rather than remaining editable.

Try **2 ENTER 3 +**. The result is **5.0000**. There is no equals key.

| Physical keyboard | Calculator |
|---|---|
| 0–9, decimal point | Number entry |
| Enter | ENTER |
| + − * / | Arithmetic |
| C | CHS |
| E | EEX |
| Backspace | Backarrow |
| Escape or Delete | CLx |
| F / G | Gold / blue prefix |
| O | ON/off |

On the calculator, **g → ←** clears X; **g → ENTER** recalls LAST X. The scientific functions listed below are also active. Statistical, matrix, storage and programming controls remain visibly present but inactive. Unsupported shifted operations preserve the calculation. Help in the app lists supported operations.

## Research and staged contract

- [Research dossier](artifacts/research/RESEARCH.md): primary manual citations, exact legends, numerical rules, reference photography, and unresolved compatibility questions.
- [Comprehensive staged specification](artifacts/research/SPEC.md): full eventual nonprogrammable scope, including complex numbers, matrices, and expression-based SOLVE/integration.
- Original-era manuals and reference photographs are archived in `artifacts/research/` for local review. They are reference material, not runtime images. Photograph attribution and licenses are recorded in the dossier.
- [Generated asset provenance](artifacts/research/ASSETS.md): prompts, method and separation of generated textures from exact live glyphs.
- Critic reports and evidence are in `artifacts/reviews/`.

## Verification

```sh
npm test
npm run build
```

Tests inspect numeric results, stack transitions and manual examples independently of UI formatting. Critic reviews also exercise real mouse/keyboard controls and compare rendered geometry, labels and materials against original photographs. Later-stage functions are not counted as stage-one failures. Historical edge cases without a verified oracle remain explicit in the research.

## Source layout

- `src/calculator.js`: entry state, stack transitions and operation dispatch.
- `src/math.js`, `src/format.js`, `src/bindings.js`: scientific mathematics, display precision and shifted operations.
- `src/keyboard.js`: all 39 physical keys and their three legend layers.
- `src/main.js`: input dispatch, live segmented LCD and persistence.
- `src/style.css`: responsive case, faceplate, key geometry and typography.
- `public/assets/`: generated key and LCD textures used by the app.
- `tests/`: deterministic engine regressions.

## Scientific-function release

Implemented in three critic-reviewed passes: (1) powers/logarithms, percentage operations and numeric manipulation; (2) FIX/SCI/ENG, DEG/RAD/GRAD and all real trig/inverse/hyperbolic functions; (3) time/angle/coordinate conversions, factorial/Gamma, permutations and combinations. The in-app quick guide lists exact key sequences. f/g are single-function latched prefixes, including three-key HYP and display-mode sequences.

Display mode and angle mode survive reload. SCI/ENG7–9 retain requested hidden precision; RND uses that precision rather than merely copying visible digits. Original forward RAD argument reduction uses the HP13-digit internal pi from the Advanced Handbook. This remains a behavioral implementation, not a ROM-identical numerical claim.

Still deferred: statistical accumulation and regressions, random sequence, registers, complex/matrix operations, solver/integrator, full-mantissa inspection, decimal-comma radix switch, and program-only controls.
