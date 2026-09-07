# Independent critic — iteration 1

2026-09-07. Reviewed current stage-one implementation, not future scientific stages. Independent evaluator read RESEARCH.md and SPEC.md, inspected both archived whole-calculator photographs and searched original photos independently. Search also found Keith Midson's explicitly 1982 USA unit: https://www.flickr.com/photos/keithmidson/6820464678/. Geometry/material judgment is based on the actual inspected local composite and powered source; no claim of inspecting the Flickr original image.

## Scores

Visual: **7.55 / 10** = case/panel proportions 9.0×20% + LCD/segments 6.0×20% + keyboard geometry 8.0×20% + typography/legends 7.0×25% + materials/colors/badge 8.0×15%.

Stage-one functionality: **8.30 / 10** = arithmetic/numeric fidelity 9.5×30% + stack/entry 9.0×30% + editing/errors/range 6.0×20% + input/persistence/usability 7.75×20%.

Both scores below threshold. Another correction pass is required. These are weighted critical judgments, not statistical accuracy measurements.

## Required corrections, prioritized

1. **P1 — overflow display is numerically wrong.** `9 EEX 99 ENTER 9 ×` stores MAX correctly but `display()` emits mantissa `1.0000`, exponent `100`; renderer consumes only first two exponent characters and therefore shows the exponent as 10. Constrain presentation rounding at the upper endpoint; display the valid largest value rather than an out-of-range rounded exponent. Add a regression that checks actual displayed digits, not just stored value.
2. **P1 — exponent overlaps mantissa.** Browser entered `1.234567890 EEX 99`; visible LCD drew all ten mantissa digits plus exponent into shared slots. Research says only seven mantissa digits fit alongside exponent, retaining the full mantissa internally. Reserve correct positions and test ten-position occupancy. Screenshot `iteration-1-exponent.png` records this.
3. **P2 — ON does not clear overflow blinking.** Engine sequence overflow→ON→ON leaves overflow true. Research explicitly says ON clears blinking. Ensure ON acknowledgement semantics and preservation are covered.
4. **P2 — LCD needs reconstruction.** Default decimal is barely distinguishable at ordinary size, digits are tall/thin, tightly packed and more slanted than the broad original segments. Original width-to-height digit ratio is about 0.6 versus current polygon ~0.5. Give separators visible dedicated spaces; match original digit spread and bevel geometry. Default comma grouping is absent entirely despite the spec. Verify `12345 ENTER` visibly reads `12,345.0000` (or number of trailing decimals allowed by ten slots).
5. **P2 — CLEAR bracket crosses preceding blue legends.** Move bracket into the actual empty gap between row2 blue labels and row3 gold labels. Original bracket spans Σ through PREFIX, with CLEAR centered. Current screenshot visibly crosses HYP⁻¹/SIN⁻¹/COS⁻¹/TAN⁻¹ area.
6. **P2 — keyboard geometry.** Original keyboard border is slightly inset relative to the upper metal panel; app aligns the two widths. At normalized 940px width, approximate original key tops within keyboard plate are 25,117,209,301, with key height54 and pitch92. App uses compressed ~87px pitch and ~59px key heights. Correct spacing and double-height ENTER consistently. Case overall ratio is already close and should be retained.
7. **P2 — original typography/details.** Integral currently renders its bounds inline, not x above y at the right of the integral. Exchange glyphs are generic thin horizontal Unicode arrows; original is the distinctive opposed arrowhead mark. Radical has visibly broken overbar. Badge uses italic serif hp without original circular symbol and generic model type. Improve with explicit vector typography where fonts cannot reproduce it. Blue legends should occupy the sloped foot, with regular white labels above. Key surfaces currently read as thin rectangular inset frames rather than thicker molded caps; inspect source powered photograph for bevel proportions. All 39 physical positions and semantic legends are present, which is a strong foundation.

## Verification performed

- Ran `npm test`: all 32 existing tests passed. Covers published basic arithmetic, chain, repeated ENTER, T replication, sign, normal EEX, edit, clear-X, lastX, roll, swap, decimal rounding, error, overflow storage, underflow, persistence and restrictions.
- Independent engine probes confirmed MAX presentation bug and overflow ON bug. Inputs and actual output: `9 EEX 99 ENTER 9 *` => stack X `9.999999999e+99`, display `{mantissa:'1.0000',exponent:'100'}`. Same with `ON ON` => overflow true. Ten-digit normal integer `9999999999 ENTER` displays correctly without unwanted scientific transition.
- Actual browser mouse clicked 2; physical keyboard ENTER 3 + => accessible output5.0000.
- Actual browser physical keyboard `8 ENTER 0 /` => Error0; next7 acknowledged without entry; next2+ =>10.0000, demonstrating preserved8 in Y. Reload retained10.0000.
- Browser physical keyboard long-mantissa exponent entry reproduced visible overlap, with accessible text1.234567890e99.
- Browser `Delete 4 f 7` =>4 remains and clear inactive-function notice; no accidental7 entry.
- Browser expanded keyboard guide; mappings available and scope text explicit. 39 calculator buttons verified via full accessibility tree. Guide itself supports native activation separately from calculator ENTER.
- Desktop1200×1000 and narrow390×844 inspected via browser screenshot. Calculator stays whole and proportional. Narrow legends are physically tiny; this is partly inherent to full landscape device at phone width. Manual pinch-zoom and touch ergonomics remain unverified, so they are not counted as passes.
- CUA screenshot backend produces content in upper-left half at DPR2; screenshots therefore include extra blank area. This is a capture artifact, not asserted as an app defect.

## Residual uncertainty / nonblocking observations

Research rightly marks repeated third exponent digit, EEX-from-zero and backspacing exponent00 as unresolved. Did not judge those against invented hardware semantics. Reload during an unfinished entry preserves its number but not editable-entry state: entered123→reload→4 yields4; document that choice or improve persistence later. Existing scientific functions remain inactive as stage1 requires. Status resets to the introductory5 example on reload even when retaining another number; mildly confusing but not wrong arithmetic.

Primary visual references inspected: `../research/original-front.jpg`, `../research/reference-front-powered.jpg`. Sources: https://commons.wikimedia.org/wiki/File:HP-15C_Programmable_Scientific_Calculator_introduced_1982_(edited,_built_from_2_images).jpg and https://commons.wikimedia.org/wiki/File:HP-15C_calculator,_power_on,_showing_square_root_of_88_(24623476512).jpg. Functional authority: archived original-era Owner's Handbook and dossier page references. No implementation edits made by critic.
