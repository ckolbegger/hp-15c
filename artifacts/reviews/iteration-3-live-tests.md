# Final live browser checks

Developer collected these actual CUA input/output observations for independent critic inspection because the critic's browser connection was unavailable after usage reset. Screenshots are unmodified browser output. No implementation was changed during the third evaluation.

- At desktop1200×1000, Escape,1,2,3,4,5,Enter produced accessible display `12,345.0000`. Recorded `hp15c-iteration-3-desktop.png` and `hp15c-iteration-3-face.png`.
- Escape,9,E,9,9,Enter,9, mouse Multiply, C produced `-9.9999e99`; DOM LCD class `lcd blink`. The CHS command executed during overflow. Backspace retained that number and LCD class became `lcd`, clearing only the flag.
- Escape,8,Enter,0,/ produced `Error 0`. O produced `0.0000` without powering off. 2,+ then produced `10.0000`, confirming preserved Y=8.
- Escape,1,.,2,3,4,5,6,7,8,9,0,E,9,9 produced accessible display `1.234567e99`. Captured `hp15c-iteration-3-exponent.png`.
- Captured `hp15c-iteration-3-mobile.png` at390×844. The follow-up DOM geometry request timed out; no claim is made that it passed. Viewport override was reset afterward.
- Browser screenshot backend sometimes embeds a half-scale rendering with extra blank area when viewport overrides/fullPage are used. The native desktop screenshot gives the clearest view. Capture defects are distinguished from app defects.
