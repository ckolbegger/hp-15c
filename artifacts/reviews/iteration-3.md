# Independent critic — iteration 3 (final)

2026-09-07. Stage-one evaluation after final corrections. This is the third and final build/evaluation iteration. Stop development for the user's manual test.

## Final scores

**Visual: 8.98 / 10** = case/panel9.4×20% + LCD9.0×20% + keyboard9.3×20% + typography8.8×25% + materials/badge8.2×15%.

**Stage-one functionality: 9.40 / 10** = arithmetic9.7×30% + stack/entry9.3×30% + editing/errors/range9.6×20% + input/persistence/usability8.9×20%.

Functionality exceeds9.0; visual accuracy remains just below9.0. Do not round8.98 up to treat the criterion as passed. Scores are weighted independent judgments of the implemented stage, not proof of exact hardware equivalence or scores for future unimplemented functions.

## Evidence for final improvement

Critic independently ran all38 tests:38 passed. Independently executed these additional sequences and inspected full state:

| Sequence | Observed result |
|---|---|
|8 ENTER0 / ON|0.0000, errorfalse, power remains on, stack[0,8,0,0]|
|9 EEX99 ENTER9 ×2|entry2, overflowtrue, Y retainsMAX|
|previous sequence BACK|entry2 retained, overflowfalse|
|overflow ON ON|MAX retained,9.9999e99 display, overflowfalse|
|1.234567890 EEX99|visible1.234567e99, internal1.23456789e99|
|12345 ENTER|12,345.0000|

Thus ordinary keys no longer disappear after overflow; flag acknowledgement and Error0 acknowledgement are distinct. These corrections address the manual's pp61–62 distinction documented in iteration2.

Critic independently inspected the actual current whole-face browser screenshot supplied at `/tmp/hp15c-iteration-3-face.png` and compares it against the same archived original front and powered photographs used in iterations1/2. LCD now has the pale gray/beige reflective background seen in the originals. Digit height is substantially closer, positions are better spread, and decimal/group punctuation is plainly visible. Generated key surfaces have a softer rim. The corrected39-key layout, ENTER span, CLEAR bracket, integral bounds, radical, exchange symbols and badge remain intact.

Browser automation remains available to the parent but not the critic's isolated CUA session, as documented in iteration2. Current screenshots are unmodified parent CUA captures; visual scoring is independent inspection of that evidence. Critic directly drove live mouse/keyboard tests during iteration1 and independently reran engine regressions each iteration. Parent's final browser evidence is archived alongside this report. This limitation must not be described as independent critic-driven browser execution in every iteration.

## Remaining limitations for manual review

- White/gold/blue lettering, logo stroke contours, key bevels and molded case texture still approximate the original. This is a convincingly close recreation, not photographic or pixel-perfect identity. Residual differences explain typography/material scores below9.
- Screenshots cannot establish tactile realism, touch comfort or pinch-zoom behavior. Narrow whole-calculator rendering necessarily creates small targets. Manual desktop and phone testing remains useful.
- Normal completed calculations survive reload; unfinished entry does not preserve its editable state. Reload123 then4 replaces with4. That compatibility choice remains documented.
- Repeated extra exponent digits, EEX-from-zero and backspacing exponent00 remain research uncertainties without a hardware/ROM oracle. Their unproven semantics are not claimed as fully matched.
- Stage1 supports the agreed arithmetic/RPN entry and selected stack controls. Visible scientific/statistical/matrix/storage functions are intentionally inactive. The score does not imply their implementation.
- This is a behavioral reimplementation with decimal arithmetic, not execution of original HP firmware. Later-stage numerical last digits and specialized algorithms require the archived handbook examples and additional oracles.

No further build requested: the third-iteration cap is reached, although visual accuracy remains below threshold. The application is ready for the user to test manually.

## Final evidence refinement

After the initial half-scale face inspection, critic inspected the full readable `hp15c-iteration-3-exponent.png`. This better evidence exposes broad horizontal silver-panel banding rather than the original's fine brushed grain. Materials score was revised from8.8 to8.2 and final visual total from provisional9.07 to8.98. The user requested an honest bounded review loop; a near-threshold result is not rounded into a pass. This texture and small key/letterform contours remain manual-review items. The earlier functional score is unchanged.

Final evidence files: `hp15c-iteration-3-desktop.png`, `hp15c-iteration-3-face.png`, `hp15c-iteration-3-exponent.png`, `hp15c-iteration-3-mobile.png`, and `iteration-3-live-tests.md`. Critic read the latter: parent live CHS during overflow changed sign while retaining blink; Backspace retained value and cleared blink; Error0→O cleared without power-off, then2+ returned10; exponent entry matched1.234567e99. Mobile capture was taken but follow-up DOM geometry request timed out, explicitly not counted as a pass.
