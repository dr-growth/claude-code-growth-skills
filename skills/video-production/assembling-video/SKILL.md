---
name: assembling-video
description: Assemble screens, transitions, text overlays, and audio into a final rendered video. Uses FFmpeg for simple slideshow assemblies and Remotion for complex animated compositions with cursor movement, data reveals, and programmatic batch rendering of personalized variants.
---

# Assembling Video

Compose screens, transitions, text overlays, and audio into a final video. Uses Remotion (React-based programmatic video) for complex compositions with animations, or FFmpeg for simpler slideshow-style assemblies.

## When to Use

- Combining generated screens into a video with transitions
- Adding text overlays, cursor animations, and motion to static screens
- Rendering personalized video variants from templates
- Creating short-form cuts from longer videos
- Adding voiceover audio to visual sequences

## Workflow

### Step 1: Choose Assembly Method

| Complexity | Tool | When |
|-----------|------|------|
| Simple slideshow with crossfades | FFmpeg | Static screens, no animation within shots |
| Animated compositions (cursor movement, data reveals, text typing) | Remotion | Product demos, interactive-looking sequences |
| Re-cutting existing video | FFmpeg | Trimming, reordering, overlaying |

### Step 2: FFmpeg Assembly (Simple)

For slideshow-style videos from static screens:

```bash
# Create video from image sequence with crossfade transitions
ffmpeg -framerate 0.2 -i screens/scene-%02d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# Add audio track
ffmpeg -i video.mp4 -i voiceover.mp3 -c:v copy -c:a aac -shortest final.mp4

# Trim a clip
ffmpeg -i source.mp4 -ss 00:00:05 -to 00:00:35 -c copy clip.mp4

# Overlay text
ffmpeg -i source.mp4 -vf "drawtext=text='Company Name':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=50" output.mp4
```

### Step 3: Remotion Assembly (Complex)

For animated, programmatic video:

```bash
# Initialize Remotion project (one-time setup)
npx create-video@latest video-project --template blank

# Structure
video-project/
  src/
    Root.tsx           <- Video composition registry
    scenes/
      LogoReveal.tsx   <- Each scene is a React component
      ProductDemo.tsx
      TextOverlay.tsx
    data/
      script.json      <- Scene timing + variable data
    assets/
      screens/         <- Generated screen PNGs
      fonts/           <- Brand fonts
```

Each scene is a React component that receives:
- `frame` — current frame number
- `fps` — frames per second
- Props from the script data (text content, image paths, timing)

Remotion handles: interpolation, spring animations, sequences, audio sync.

```bash
# Preview
npx remotion preview

# Render
npx remotion render src/index.ts MainVideo output.mp4 --codec h264
```

### Step 4: Personalized Rendering

For batch rendering personalized variants:

```javascript
// render-variants.js
const variants = [
  { company: 'Acme Corp', industry: 'Financial Services', table: 'transactions' },
  { company: 'MedTech Inc', industry: 'Healthcare', table: 'patient_records' },
];

for (const variant of variants) {
  // Render with Remotion's programmatic API
  await renderMedia({
    composition: 'PersonalizedDemo',
    inputProps: variant,
    outputLocation: `output/${variant.company.toLowerCase()}.mp4`,
  });
}
```

### Step 5: Quality Check

Before delivering:
- [ ] Audio syncs with visuals (VO timing matches scene transitions)
- [ ] Brand colors accurate (check against visual code)
- [ ] Text readable at target resolution
- [ ] Transitions smooth (no jarring cuts)
- [ ] Duration matches target
- [ ] File size reasonable for delivery channel

## Output

Final `.mp4` video file(s) in the project directory. For personalized batches, one video per variant.

## Dependencies

- `ffmpeg` (brew install ffmpeg)
- `remotion` (npm — installed in video project)
- Screens from `/generating-video-screens`
- Script from `/scripting-video`
- Audio/voiceover files (from ElevenLabs or recorded)
