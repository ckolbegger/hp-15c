# HP-15C

A standalone browser recreation of the classic 1982 Hewlett-Packard HP-15C. The computation release implements real and complex scientific mathematics, statistics, registers, matrices, and expression-based SOLVE/integration on the original RPN keyboard. It is a behavioral implementation, not a ROM emulator or an official HP product.

## Run

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev -- --port 1515
```

Open http://127.0.0.1:1515/. For production, `npm run build` generates `dist`; `npm run preview` serves that build locally. All calculator assets and computation are local; no service or API key is required to run it.

## Calculator-only view and PWA

Right-click (or click/tap) the HP-15C logo and choose **Calculator only** or **Full site**. The current window switches without resetting the calculation. Keyboard users can focus the logo and press Shift+F10, then use arrow keys and Enter; Escape closes the menu.

Normal browser visits default to the full site. Installed app launches default to calculator-only; an explicit `?view=full` or `?view=calculator` selects that view. When SOLVE/integration needs an expression, the full site opens its function editor.

To try the installable production build locally:

```sh
npm run build
npm run preview -- --port 1516
```

Open `http://127.0.0.1:1516/?view=calculator` in a browser supporting PWA installation and use its install command. The production service worker caches the app and numerical worker for offline use after the initial successful load. Close all app windows/tabs before reopening to activate a newly downloaded version. Development mode on port 1515 does not register an offline worker.

## Basic use

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

On the calculator, **g → ←** clears X; **g → ENTER** recalls LAST X. The scientific functions listed below are also active. Storage, statistical and matrix controls are active. Program-only controls remain visibly present but are excluded. Unsupported shifted operations preserve the calculation. Help in the app lists supported operations.

## Research and staged contract

- [Research dossier](artifacts/research/RESEARCH.md): primary manual citations, exact legends, numerical rules, reference photography, and unresolved compatibility questions.
- [Comprehensive staged specification](artifacts/research/SPEC.md): nonprogrammable scope, including complex numbers, matrices, and expression-based SOLVE/integration.
- Original-era manuals and reference photographs are archived in `artifacts/research/` for local review. They are reference material, not runtime images. Photograph attribution and licenses are recorded in the dossier.
- [Generated asset provenance](artifacts/research/ASSETS.md): prompts, method and separation of generated textures from exact live glyphs.
- Critic reports and evidence are in `artifacts/reviews/`.

## Verification

```sh
npm test
npm run build
```

Tests inspect numeric results, stack transitions and manual examples independently of UI formatting. Critic reviews also exercise real mouse/keyboard controls and compare rendered geometry, labels and materials against original photographs. Critic reports identify the exact scope and provenance of each review. Historical edge cases without a verified oracle remain explicit in the research.

## Source layout

- `src/calculator.js`: entry state, stack transitions and operation dispatch.
- `src/math.js`, `src/format.js`, `src/bindings.js`: scientific mathematics, display precision and shifted operations.
- `src/advanced.js`, `src/complex.js`, `src/matrix.js`: memory/statistics, complex state and matrix operations.
- `src/expression.js`, `src/numerical-worker.js`: constrained expressions and cancellable numerical algorithms.
- `src/keyboard.js`: all 39 physical keys and their three legend layers.
- `src/main.js`: input dispatch, live segmented LCD and persistence.
- `src/style.css`: responsive case, faceplate, key geometry and typography.
- `public/assets/`: generated key and LCD textures used by the app.
- `tests/`: deterministic engine regressions.

## Scientific-function release

Implemented in three critic-reviewed passes: (1) powers/logarithms, percentage operations and numeric manipulation; (2) FIX/SCI/ENG, DEG/RAD/GRAD and all real trig/inverse/hyperbolic functions; (3) time/angle/coordinate conversions, factorial/Gamma, permutations and combinations. The in-app quick guide lists exact key sequences. f/g are single-function latched prefixes, including three-key HYP and display-mode sequences.

Display mode and angle mode survive reload. SCI/ENG7–9 retain requested hidden precision; RND uses that precision rather than merely copying visible digits. Original forward RAD argument reduction uses the HP13-digit internal pi from the Advanced Handbook. This remains a behavioral implementation, not a ROM-identical numerical claim.

## Complete computation release

The remaining calculation families are now active. Open **Keyboard & quick guide** for register, statistics, complex and matrix key sequences. Open **Function editor & memory inspector** to define f(x), inspect state, or toggle the radix convention.

- Storage: `42 STO 0`, clear X, then `RCL 0` returns 42.
- Statistics: `f GSB` clears the dataset; enter each pair as `y ENTER x Σ+`. `g 0` returns the means; `f Σ+` returns intercept/slope.
- Complex: `2 ENTER 3 f TAN` enters 2+3i. `f −` exchanges real/imaginary X. `g 5 8` exits complex mode.
- Matrices: rows ENTER columns `f SIN A` dimensions A. Use the top-row √x/eˣ/10ˣ/yˣ/1/x keys for A/B/C/D/E after a matrix command. `RCL CHS A` recalls its descriptor; `f EEX C` selects C as the result matrix.
- SOLVE: enter `x^2 - 2` in the editor, then `1 ENTER 2 f ÷`. X contains 1.414213562; Y is the previous estimate and Z the residual.
- Integration: enter `x^2`, then `0 ENTER 1 f ×`. X contains 0.3333333333; Y is estimated uncertainty, Z/T the original upper/lower bounds. Cancel stops a running calculation without changing inputs.

[Coverage and compatibility notes](artifacts/research/COMPATIBILITY.md) explain intentional interface differences, singular-matrix perturbations, numerical algorithms, uncertainty and memory limits. Programming and hardware diagnostics remain excluded. This is not a claim of ROM-identical results for every input.
