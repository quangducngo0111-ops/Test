# Life Abroad 3D — Phase 0 / Art Bible (round 2)

## Palette
- Brand violet: `#3B0E90`; interaction orange: `#FF9C00`
- Day sky: `#B3DCF6`; warm sun: `#FFF1D6`; cooler fill: `#CDE9FF`
- Road: `#6F7890`; sidewalk: `#F4DCBE`; planted grass: `#8DCA9B`
- Buildings: coral `#F2C5A8`, lilac `#E4D5E7`, blue `#C8D7EE`; rooftop purple `#75609E`, blue `#6B91BB`, rose `#D58CA0`
- Dark contrast / trim: `#334E72`; plants `#4BA88D` and `#82C6A3`
- Style: softly saturated pastel, warmer key light, cooler shadows; avoid gray/beige washout.

## Character proportions (game units)
- Adult visual height approximately 2.9–3.0 units (head top to shoe sole); head approximately 0.96 high and 0.87 wide, about 3 visible head heights in current procedural rig (**not yet the requested 4.5 heads**)
- Child: rig scale 0.76, head multiplier 1.12; teen: 0.93 / 1.06; senior: 0.94 with forward torso tilt
- Neck center at torso local Y = 0.58; torso center at world Y = 1.48; shoulders at torso local X ±0.42
- Hands approx 0.25 wide with an offset thumb; shoes approx 0.35 wide and 0.59 long including cream sole
- Canvas face: white sclera, iris, black pupil, highlights, translucently painted blush, mouth + nose marks. No geometric cheek/nose spheres.

## Lighting and camera
- Camera vertical FOV: 43°, default pitch 0.46 rad (~26.4°), default distance 8.8 units; outdoors day scene with 43–105 unit fog
- Hemisphere: upper `#CDE9FF`, lower `#889B8B`, intensity 1.5 at day
- Directional sun: `#FFF1D6`, intensity 3.0 at day, 1024² shadows (medium), 2048² (high); low quality disables real shadows
- ACES tonemapping and sRGB color output
- Photo presets: character, street, 3/4, wide; key P, fixed yaw/pitch/distance, HUD hidden
- Debug: shadows, tonemapping/color grade, wireframe, FPS / quality tier. Genuine inverted hull outline toggle, bloom, SSAO and GTAO are **not implemented**.

## Eight highest-priority changes
1. Remove dimensional cheek and nose blobs from the face.
2. Replace front hair clumps with more coherent tapered locks; reduce excessive round forms.
3. Slim balloon sleeves and add mitten thumbs and shoe soles.
4. Pull camera back, use FOV 43°, show more of the street and sky.
5. Reduce flat fill lighting and increase warm directional illumination.
6. Add sidewalk joints, curbs, grates, planters, manhole covers and distant building mass.
7. Add five more pedestrians, for eight total, and simple patrol movement.
8. Add fixed camera Photo Mode and performance/debug toggles.

## Limitations and visual QA still required
- This is code-generated art; its current proportions are **not** a verified 4.5-head adult and the hair is still partially primitive geometry. The figure may remain stylized or lumpy.
- Street building windows are decorative geometry, not fully recessed architectural cavities.
- Pedestrian paths are simple lateral patrols without avoidance; bus is stationary.
- No real SSAO/GTAO, bloom/vignette or inverted-hull outlines; no dedicated fake-AO pass.
- No browser screenshot, side-by-side baseline comparison or measured low-tier FPS has yet been captured in this edit; **do not mark Phase 0 approved** until visual QA.
- Preserve the working navigation and café dialogue while iterating.
