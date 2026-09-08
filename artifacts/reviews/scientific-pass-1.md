# Scientific pass 1 — independent critic

2026-09-07. Scope: real unary/power/percent functions, π, RND, roll-up, physical f/g dispatch, and prior metal-banding correction. Reused archived original photographs and manuals; supplemental numerical oracles in ../research/SCIENTIFIC-ORACLES.md.

## Evidence

- Ran complete suite:44/44 pass.
- Independent engine probes: physical g y^x gives15.76×3%=.4728 and preserves Y15.76/Z8/T9, LASTX3; g reciprocal gives delta-percent -10.40609137, preserving same deeper stack and LASTX14.12.
- RND -1.23456789 produces-1.2346, keeps Y/Z/T and LASTX original, enables lift. Small1.23456789e-8 rounds to1.2346e-8 using FIX scientific fallback.
-0^0 and negative-base fractional power correctly produce Error0 without dropping stack; ordinary documented unary examples and domain checks pass.
- Real browser physical-key sequence2 ENTER3 y^x displayed8.0000; g sqrt displayed64.0000. Shift did not fall through to base action.
- Viewed live browser calculator and local original-front.jpg. Heavy faceplate banding is gone. Full keyboard legend placement, silver upper plate, olive LCD, blue/gold slopes, vertical ENTER, badge, and dark case align with original-production reference.

## Scores

Visual:9.05/10, weighted layout30%(9.4), complete legends25%(9.3), materials25%(8.7), LCD/badge20%(8.6). Remaining differences: original silver grain is more photographic, keys have rounder shoulders and heavier sloped lettering, badge and LCD optics remain approximations. The banding blocker is resolved.

Implemented-function accuracy:9.5/10, weighted arithmetic results40%(9.7), stack/LASTX25%(9.7), physical bindings20%(9.4), edge/error behavior15%(8.8). These scores cover this implementation pass, not the entire future nonprogrammable HP-15C inventory. Extreme transcendental last digits have not been compared to a hardware/ROM trace.

No blocking pass1 corrections. Proceed to pass2. Required follow-on care: RND must cease reconstructing only visible digits when SCI/ENG7–9 arrive; hidden selected precision matters. See original handbook pp58–60. Preserve display/angle-mode stack neutrality. Implement unusual original radian reduction documented in Advanced Handbook pp154–157.
