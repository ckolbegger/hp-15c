# Independent critic — iteration 2

2026-09-07. Independent inspection of corrected implementation and current browser captures. Reused original-front.jpg, powered photograph and archived dossier from iteration1. No implementation edits made.

## Scores

**Visual: 8.755 / 10** = case/panel9.4×20% + LCD7.8×20% + keyboard9.3×20% + typography8.8×25% + materials/badge8.3×15%.

**Stage-one functionality: 9.00 / 10** = arithmetic9.7×30% + stack/entry9.3×30% + editing/errors/range7.5×20% + input/persistence/usability9.0×20%.

Visual remains below9; functionality does not exceed9. Final third correction/evaluation pass required. Scores reflect evidence and remaining issues, not the percentage of passing tests.

## Verified corrections

All36 unit tests passed independently. Additional independent engine probes showed:
- Overflow now stores9.999999999e99 and presents9.9999e99, avoiding exponent100/truncation.
- Overflow ON→ON retains value and clears blinking flag.
- 1.234567890 EEX99 preserves internal1.23456789e99 and exposes seven-digit mantissa1.234567 with exponent99; capture confirms separate positions without overlap.
- 12345 ENTER emits12,345.0000.

Independent visual inspection of current screenshots confirms the inset keyboard border, corrected row pitch, taller ENTER, CLEAR bracket clear of the prior blue row, explicit radical and integral bounds, opposed exchange marks, circular HP emblem and improved model badge. All39 keys remain visible. General silhouette and main panel proportions are close to the original.

## Final corrections

1. **Separate overflow from errors.** `press()` currently treats error||overflow identically, so ordinary next keys silently acknowledge overflow and are discarded. The manual distinguishes error acknowledgement by any key from clearing flag9 with backarrow, ON, or g CF9. Preserve overflow flag during ordinary calculation and execute ordinary actions; clear with supported documented controls. Update status from 'Press any key' for overflow. Add tests that overflow→2 actually enters2 and flag remains set, then backarrow clears flag without destroying X. See official HP handbook pp61–62, https://www.hp.com/ctg/Manual/c03030589.pdf. This is the already archived2011 cross-check; original-era dossier establishes same flag model.
2. **Clear Error0 with ON.** Independent `8 ENTER0 / ON ON` still returns Error0. Handbook p61 says any key clears error and restores prior condition. Ensure the ON acknowledgement clears error, and do not leave the calculator stuck in that error after power cycle. If a hardware oracle establishes a special ON exception, record it; currently no such exception is documented.
3. **LCD original appearance.** Current face is much darker, olive and cloudy than both original photos' pale gray/beige reflective surface. Lighten and desaturate LCD material, reducing mottling. Numerals occupy about55–60% of its height visually, compared with roughly40–45% on original photo; reduce vertical height while distributing the ten positions across the original broad width. Avoid uniformly shrinking the entire SVG because that further crowds digits into the center. The decimal/comma are present now but remain hard to distinguish in whole-face capture. Give separators sufficient visible gap and baseline contrast. Match a full ten-digit example against the source photo, rather than only0.0000. This is the largest remaining visual deduction.
4. **Soften key rim rendering.** App black key assets still show a thin bright rectangular outline and shallow inset face. Original keys are molded raised caps with a softer broad top bevel and dark lower slope. Reduce rim contrast/straight-line sharpness, keeping current layout and precise legend rendering. This is a smaller materials deduction.

## Evidence and testing provenance

Critic's CUA browser connection after reset reported no browser surfaces, although parent CUA had access. To avoid mistaking environment failure for app failure, critic independently inspected unmodified actual-browser captures made by parent at requested test conditions. This is explicitly evidence review, not a claim the critic directly drove browser in this iteration. Iteration1 critic drove mouse and physical keyboard directly; unchanged input handlers retain that evidence.

Current captures: hp15c-iteration-2-face.png, hp15c-iteration-2-exponent.png, hp15c-iteration-2-desktop.png, hp15c-iteration-2-full.png, hp15c-iteration-2-mobile.png. Browser capture DPR issue still places content at half size in upper-left; do not interpret that as an app layout defect.

Parent's reported actual CUA tests, with captures independently inspected: physical12345 ENTER→AX12,345.0000; Escape1.234567890 EEX99→AX1.234567e99; Escape9EEX99ENTER9 then mouse Multiply→AX9.9999e99 and LCD classblink; physicalo,o→same value and class withoutblink. Independent engine probes corroborate outputs and states. Narrow capture preserves whole face; actual touch and pinch-zoom ergonomics remain unverified.

Ordinary RPN arithmetic, four-level stack, ten-digit rounding, backspace/clear, unsupported shifts and persistent completed calculations continue to pass. Unresolved exponent-entry edge semantics and incomplete-entry persistence remain documented limits, not invented hardware claims. Future scientific functions remain inactive as requested for stage1.
