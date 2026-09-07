# Classic HP-15C research dossier

Research date: 2026-09-07. Target: the original 1982–1989 Voyager HP-15C, not the Limited or Collector's Edition. This dossier distinguishes observed original behavior from application decisions. The associated application requirements are in `SPEC.md`.

## Evidence and archived references

1. **Original-era primary authority:** Hewlett-Packard, *HP-15C Owner's Handbook*, part 00015-90001, revision G, November 1985. [Catalog and provenance](https://literature.hpcalc.org/items/582), [scan](https://literature.hpcalc.org/community/hp15c-oh-en.pdf). Archived as `hp15c-owners-handbook-1985.pdf`. This is an original-era manufacturer manual, although not the first 1982 printing. Printed page n is PDF page n+2 (one-based) through the main manual. OCR occasionally mistakes mathematical symbols, so use page images to resolve ambiguities.
2. **Original advanced mathematics authority:** Hewlett-Packard, *HP-15C Advanced Functions Handbook*, August 1982, 00015-90011. [HP-hosted PDF](https://www.hp.com/ctg/Manual/c03308725.pdf), archived as `hp15c-advanced-functions-1982.pdf`. Covers complex arithmetic, numerical roots/integrals, and matrices, including limitations and numerical conditioning.
3. **Searchable cross-check:** HP *Owner's Handbook*, edition 2.4, September 2011. [Official PDF](https://www.hp.com/ctg/Manual/c03030589.pdf), archived as `hp15c-owners-handbook-2011.pdf`. Core operation chapters match the original-era handbook; do not transfer later hardware, speed, battery, or cosmetic claims to the 1982 target. Printed page equals PDF page for this copy.
4. **Front geometry reference:** [Original-device front composite](https://commons.wikimedia.org/wiki/File:HP-15C_Programmable_Scientific_Calculator_introduced_1982_(edited,_built_from_2_images).jpg), archived as `original-front.jpg`. It combines Pittigrilli's case photograph and striegel's keyboard/LCD photograph; retouching by Hic et nunc and Pittigrilli. The composite corrects perspective and removes wear. It is a visual measurement reference, not evidence of a pristine single unit or manufacturing tolerances. The composite itself is CC BY 2.0; source page contains its attribution chain. Powered-source material is [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), case source CC0.
5. **Independent powered photograph:** [striegel's HP-15C showing square root of 88](https://commons.wikimedia.org/wiki/File:HP-15C_calculator,_power_on,_showing_square_root_of_88_(24623476512).jpg), archived as `reference-front-powered.jpg`. Photographer identifies this as a well-used 1988 calculator; photograph dated January 12, 2016. [Original Flickr](https://www.flickr.com/photos/50019407@N03/24623476512/), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Useful for actual plastic, segment shape, key slopes, and realistic wear.
6. **Separate case/photo reference:** [HP-15C Calculator-horizontal-2](https://commons.wikimedia.org/wiki/File:HP-15C_Calculator-horizontal-2.jpg). Pittigrilli, derivative Hic et nunc, [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Source URL retained; download returned HTTP 429. Shows unpowered LCD and authentic case. Three reference views are therefore recorded, two locally archived.

The PDF files are research material, not application runtime assets. Generated art must be identified as generated, kept separately from photographs, and checked against the photographs.

## Visual observations from original-device photographs

Landscape case with rounded black sides. A brushed silver upper face surrounds an inset olive/gray LCD left of center; the blue/silver hp–15C badge sits toward the right. The keyboard plate is dark with a fine silver border and spaced HEWLETT·PACKARD wordmark along its lower edge. This is not a gold HP-12C faceplate. There are four rows and ten columns but only 39 physical keys: ENTER occupies column 6 in rows 3 and 4. White primary labels occupy upper key faces; small blue secondary legends occupy lower slopes; gold legends sit on the plate above the keys. ON is recessed; f is gold and g is blue. ENTER is vertical, with LSTx at its foot. Digits are larger than function names. The right column contains ÷, ×, −, + in that order.

LCD has ten digit positions with radix/group separators and a separate leading sign. Scientific display consumes the last three positions for exponent sign and two digits. Digits are seven-segment, slightly slanted, with beveled segment ends and gaps. Black digits on a dim reflective gray-green background are appropriate; luminous green, dot-matrix digits, or modern proportional text are not. The eight annunciators are low battery *, USER, f, g, RAD, GRAD, C, PRGM; RAD and GRAD share lettering. Degrees mode has no DEG indicator. See original handbook pp58–62.

## Exact keyboard transcription

Each cell is **gold above | white primary | blue below**. A dash means no legend. Subscripts/superscripts and the opposed exchange arrows are significant; this text is semantic transcription, not font artwork.

| Row | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 1 | A / √x / x² | B / eˣ / LN | C / 10ˣ / LOG | D / yˣ / % | E / 1/x / Δ% |
| 2 | LBL / SST / BST | HYP / GTO / HYP⁻¹ | DIM / SIN / SIN⁻¹ | (i) / COS / COS⁻¹ | I / TAN / TAN⁻¹ |
| 3 | PSE / R/S / P/R | Σ / GSB / RTN | PRGM / R↓ / R↑ | REG / x⇄y / RND | PREFIX / ← / CLx |
| 4 | — / ON / — | — / f / — | — / g / — | FRAC / STO / INT | USER / RCL / MEM |

| Row | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|
| 1 | MATRIX / CHS / ABS | FIX / 7 / DEG | SCI / 8 / RAD | ENG / 9 / GRD | SOLVE / ÷ / x≤y |
| 2 | RESULT / EEX / π | x⇄ / 4 / SF | DSE / 5 / CF | ISG / 6 / F? | ∫ʸˣ / × / x=0 |
| 3 | RAN # / ENTER / LSTx (two rows) | →R / 1 / →P | →H.MS / 2 / →H | →RAD / 3 / →DEG | Re⇄Im / − / TEST |
| 4 | ENTER continuation | x! / 0 / x̄ | ŷ,r / . / s | L.R. / Σ+ / Σ− | Pᵧ,ₓ / + / Cᵧ,ₓ |

Gold CLEAR bracket spans row-3 columns 2–5 (Σ, PRGM, REG, PREFIX). Integral symbol has upper x and lower y. White reciprocal is 1/x. The matrix exchange above 4 is x followed by opposed arrows; it is not x⇄y.

## Stage-one operational findings

Sources: original handbook §§1,3,5 and Appendix B (pp18–23,32–45,58–63,209–212), cross-checked in 2011 searchable version.

- State consists of X (display), Y, Z, T, LAST X, number-entry status, stack-lift status, display mode, error and overflow status. Fresh state is zero registers, FIX 4, decimal point, comma groups, Degrees, real mode. ON preserves Continuous Memory rather than clearing calculations.
- To calculate a binary operation, place first operand in Y, second in X. Subtraction is Y−X, division Y/X. Result replaces X; Y receives Z; Z receives T; T is retained. Save the pre-operation X to LAST X.
- ENTER pushes a duplicate of X into Y, moves Y→Z and Z→T, loses old T, terminates digit entry, and disables lift for the next entry. Repeated ENTER continues duplicating. The first subsequent digit replaces X, preserving Y. Operators enable the next entry to lift the previous result into Y.
- CLx is g followed by backarrow. It clears X only and disables lift. Backarrow during number entry removes the last digit; after entry termination it acts as CLx. It must never clear the entire stack as an ordinary operation. Clearing statistics with f CLEAR Σ is a distinct eventual function that also clears the stack.
- CHS changes the mantissa sign during mantissa entry and exponent sign during exponent entry. It does not terminate entry. The manual explicitly tells users to enter mantissa digits before CHS. After entry has ended, CHS changes displayed X and enables future lift; during entry it is neutral. It does not overwrite LAST X.
- EEX enters an exponent with initial 00. The mantissa can retain ten digits internally while only seven fit beside the exponent. EEX is ineffective when the mantissa has more than seven integer digits, or nonzero magnitude below 0.000001. It is not a multiplication key. Exponent CHS works before or after exponent digits. EEX after terminated entry is lift-enabling; during entry it is neutral.
- The narrative does not precisely specify repeated third exponent digits, backspacing through exponent 00, or EEX from zero. Treat those as explicit compatibility investigations; do not claim the handbook proves an implementation choice. A hardware or ROM-trace oracle would settle them. This does not block documented ordinary EEX use.
- Values have a ten-significant-digit decimal mantissa and two-digit exponent; numeric operations round their result to ten significant digits. FIX is presentation rounding, not internal rounding. At entry, show typed digits up to ten; after ENTER show four decimal places, limited by available digit positions. Larger/smaller magnitudes use scientific notation. Do not equate display zero with stored zero.
- Finite range is ±9.999999999×10⁹⁹; nonzero magnitudes below 10⁻⁹⁹ underflow to zero. Overflow saturates to the signed endpoint and sets flag 9, blinking the display. Backarrow or ON clears blinking. Ordinary overflow is not Error 0.
- Division by zero shows Error 0 without losing prior calculator contents. The next key acknowledges the error and restores the prior display; that key should not also carry out its normal operation. No Infinity or NaN display.
- Roll down cycles X→T, Y→X, Z→Y, T→Z; roll up is inverse. x⇄y exchanges those registers only. Neither destroys a value. LAST X recall copies the saved operand into X and respects the stack-lift state.

## Complete nonprogramming calculation inventory and traps

**Real scientific arithmetic:** + − × ÷, reciprocal, square/square root, yˣ, eˣ/10ˣ and LN/LOG; π; CHS/ABS; INT (truncate toward zero), FRAC (signed remainder), RND (change stored value to active display precision). Factorial extends to Γ(x+1); support noninteger domain and poles, not just integer factorial. See §2 pp24–31 and Appendix A.

**Trigonometry/conversions:** SIN/COS/TAN and inverses, Degrees/Radians/Grads modes; six hyperbolic/inverse-hyperbolic functions; decimal↔H.MMSSs, degrees↔radians, rectangular↔polar. Mode changes do not convert values already stored. Polar conversion returns magnitude in X and angle in Y; reverse accepts those positions. Complex transcendental arguments use radians regardless of real trigonometric mode (coordinate conversion is the exception).

**Percent/statistics/probability:** % produces Y·X/100; Δ% produces 100·(X−Y)/Y; preserve original base Y rather than normal arithmetic stack drop. Pᵧ,ₓ and Cᵧ,ₓ use Y as population, X as chosen count with nonnegative integer bounds. RAN# is a repeatable seeded sequence with seed store/recall; host Math.random alone cannot reproduce it. Σ+/Σ− update n, Σx, Σx², Σy, Σy², Σxy in R2–R7; mean and sample standard deviation produce X and Y results; L.R. returns intercept X, slope Y; ŷ,r returns estimate X, correlation Y. Error 2 covers insufficient/degenerate data. See §4 pp47–57 and Appendix A pp205–206.

**Memory/display:** STO/RCL with arithmetic, direct/indirect registers including index I, register exchange, clear registers, memory allocation, FIX/SCI/ENG 0–9, full mantissa inspection, radix convention, persistent modes. Original combined memory imposes capacity limits; removing programming must not accidentally remove numeric storage and index operations. See §3 pp42–45, §5, §10 pp106–116, Appendix C pp213–219.

**Complex numbers:** paired four-level real/imaginary stacks and LAST X; creation via I, temporary imaginary view, Re⇄Im, complex CHS/CLx, storage, arithmetic and supported one-number functions, complex powers/logarithms/trig/hyperbolics and coordinate conversions. Preserve original principal-value/branch conventions; verify from §11 pp120–137 and advanced handbook rather than assuming host library conventions. C annunciator tracks mode. Matrix descriptors are distinct from complex/scalar numbers.

**Matrices A–E:** dimension, element store/recall, row/column indices R0/R1, USER element stepping, fill/copy, result selection, descriptors, transpose, arithmetic with matrix/scalar combinations, products, inverse/division, AX=B solution, determinant/LU, residual, row norm, Frobenius norm, real representations of complex matrices and transformation functions. MATRIX 0 clears dimensions; 1 resets indices; 2/3 transform representations; 4 transpose; 5 transpose-product; 6 residual; 7 row norm; 8 Frobenius norm; 9 determinant. Enforce shape, result-aliasing and memory constraints and Error 1/3/10/11 as applicable. See §12 pp138–179 and advanced handbook matrix chapter.

**SOLVE and integration:** original functions require a labeled user subroutine. They remain required mathematical features; nonprogrammability changes how f(x) is supplied. SOLVE consumes two estimates and returns root X, second estimate Y, residual Z. An apparent sign change at a discontinuity is not proof of a mathematical root. Error 8 means no root found; preserve diagnostic stack. Integration consumes lower Y/upper X and returns estimate X, uncertainty Y, upper limit Z and lower limit T; display settings influence tolerance. See §§13–14 pp180–204, Appendices D/E pp220–258, advanced handbook.

**Intentionally omitted execution machinery:** instruction recording/editing, program counters/lines, labels and GTO/GSB/RTN execution, conditional branching/tests, pause/run/single-step, program loops. The legends remain. Some physical keys mix programming and numerical roles: I, USER, flag 8/9 and matrix operations must not be discarded merely because they appear in programming chapters. Program-only keys should identify themselves as unavailable in the nonprogrammable app.

## Numerical assurance and remaining uncertainty

This is a behavioral reimplementation, not a claimed ROM emulation. Decimal ten-digit rounding, elementary-function last digits, pseudo-random sequence, complex branch cuts, matrix conditioning and solver termination all need golden examples before later stages can be called faithful. The archived Advanced Handbook is the authority for difficult numerical behavior. Ordinary Javascript binary floating point plus visual FIX4 formatting alone does not meet full HP-15C fidelity. The exact manufacture year of each photographed unit is not 1982; they represent original-production styling, not anniversary editions.

## Verification refinement from critic pass 2

The Owner’s Handbook p61 distinguishes error acknowledgement from overflow flag9. Any key clears an error, including ON; the acknowledgement does not execute the key’s ordinary function. Overflow blinking is cleared by backarrow, ON, or eventual g CF9. Other calculation keys continue to operate while flag9 remains set. The stage-one engine supports backarrow/ON clearing; flag operations remain later-stage functions.
