# Scientific pass 2 — independent critic

2026-09-07. Scope: FIX/SCI/ENG and RND precision; DEG/RAD/GRAD; trigonometric/inverse/hyperbolic functions; multi-key prefixes; persisted modes; digit-entry lift neutrality.

Reused original Owner’s Handbook pp26–28,58–60,205,209–212 and original Advanced Functions Handbook pp150–157, archived locally. See SCIENTIFIC-ORACLES.md for exact expected behavior.

## Evidence

Full test suite49/49 passed. Fourteen additional independent engine sequences passed, including both enabled and disabled lift across display-mode and angle changes, SCI8 hidden-digit RND, ENG3 RND, original RAD104348 SIN=-.00001100815, GRAD50 TAN=1, ATANH(.5)=.5493061443, ACOSH1=0, signed TAN90-degree overflow, ASINH(1e99)=228.6490714, TANH(1e99)=1.

An independent55-case sweep across signed/zero degree trig and real hyperbolic inputs agreed with mathematical host-library references within ten-digit rounding tolerance. This sweep validates ordinary math; the separate original-manual oracles validate HP-specific radian reduction. The engine’s original-manual π-key and huge-radian tests passed.

Verified code: begin now preserves previous lift during entry while entry state prevents repeated pushes; mode changes terminate entry without enabling/disabling lift. RND rounds requested precision before hidden LCD digits are removed, saves LASTX, and enables lift. Inverse RAD functions now use true radians; forward RAD uses original internal p. Supported mode state survives serialization.

Browser verification was attempted, but the prior browser disappeared and fresh CUA inventory returned no browsers. This report therefore does not claim fresh pass2 browser or annunciator verification. Pass1 browser checks and visual9.05 score remain prior evidence, not a new pass2 visual assessment.

## Result

Implemented mathematical functionality:9.5/10. Weighted ordinary results40%(9.7), original-specific precision25%(9.7), stack/mode semantics20%(9.6), edge cases15%(8.4). Uncertainty remains around original tangent pole signs and exact ROM last digits; the implementation labels mathematical saturation choices rather than pretending these are hardware-trace findings.

No blocking numerical corrections. Proceed to pass3. Developer should finish the real-browser HYP sequence and RAD/GRAD annunciator check when the browser is available. Add a permanent enabled-lift regression covering `2 ENTER + 3 f FIX 2 4 +`=7 (Y=4), complementing the existing disabled-lift case; the independent critic probe passed today.

## Browser evidence supplied after review

Developer independently completed live `1 f GTO SIN`→1.1752, `f SCI6`→1.175201e00, `g8` RAD selection, and reload persistence of RAD/SCI6. Critic inspected /tmp/hp15c-scientific-pass-2.png: full keyboard, smooth metal and SCI mantissa/exponent are visible; no obvious visual regression, prior9.05 visual score retained. Annunciator lettering was too small in that screenshot for independent visual confirmation; mode confirmation relies on developer’s live inspection. The numerical review is independent of that browser report.
