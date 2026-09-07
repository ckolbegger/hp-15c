# Generated asset provenance

Generated 2026-09-07 with the built-in image generation tool. The source reference was the original-production HP-15C photograph archived as `original-front.jpg`; see RESEARCH.md for attribution. Generated images are material assets, not historical source evidence. Exact labels and live LCD segments are rendered separately so malformed generated lettering cannot enter the keyboard.

## Key surface

Saved runtime asset: `public/assets/keycap.png`. Source output: `exec-e9336bac-df12-4073-9ab2-e7c26514f5e4.png`.

Prompt:

> Use case: product-mockup. Generate a photorealistic seamless usable UI asset: a SINGLE blank black HP-15C calculator keycap, from the classic 1982 model. Orthographic absolutely straight-on front view, no perspective, no surrounding calculator, no text or legends. Near rectangular shape aspect ratio 1.18 wide to 1 high; subtle slightly curved vertical sides, rounded corners, satin black subtly grainy molded plastic, flatter charcoal upper face, very narrow soft upper edge highlight and dark recessed bottom bevel. The single key fills the canvas with only a very small truly transparent margin. Authentic small vintage calculator key, not computer keyboard key, not glossy, not modern. Lighting matches the attached original reference. The reference is reference only; generate the key asset, not the whole calculator.

The reference image was supplied as a reference input. Black keys use this image; gold and blue shift keys use matching CSS colors and bevels. ENTER stretches the same texture vertically. Primary and blue labels are HTML overlaid on the key surface; gold labels are on the keyboard faceplate.

## LCD surface

Saved runtime asset: `public/assets/lcd-surface.png`. Source output: `exec-7ae0f334-d554-4998-b900-4e68c6c767ca.png`.

Prompt:

> Use case: product-mockup. Generate a UI background image asset of the BLANK LCD screen surface from a classic 1982 HP-15C pocket calculator, orthographic front view, rectangular crop of only the inner LCD glass. Pale muted warm grey olive liquid crystal material, extremely subtle cloudy reflective glass texture, gentle darker shadow along top and left edge, no digits or segments or text or symbols. Uniform authentic vintage grey olive not bright green. Entire image filled edge to edge with LCD material, aspect ratio 3:1 landscape. No bezel, no calculator body, no background, no bright lighting streaks. It will have accurate live LCD digit segments drawn over it in the app.

No reference image supplied for this generation. The LCD uses this image behind custom SVG seven-segment numerals; signs, radix dots and exponent are live display elements. The brushed metal faceplate, border, badge and case are code-rendered to maintain scale and geometry. This is an approximation subject to the independent critic's visual score, not a claim of pixel identity with the historical device.

## Final visual refinements

The third pass applies a translucent pale glass tint over the generated LCD to match the original reference’s gray-beige reflectance, and a subtle dark overlay over key textures to reduce excessive rim highlights. These are runtime CSS layers; the generated PNG assets remain unmodified. The hp/15C badge, radical and exchange marks are explicit SVG artwork, with integral bounds composed separately.
