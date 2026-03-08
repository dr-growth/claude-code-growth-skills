---
name: analyzing-video
description: Extract the visual code and DNA from any video — motion design, pacing, color palette, typography, and narrative structure. Use when reverse-engineering a video's style, analyzing competitor videos, or preparing references for new video production. Also use when user provides a video URL or file to analyze.
---

# Analyzing Video

Extract the "visual code" from any video — the DNA of its visual language, motion design, pacing, and narrative structure — so it can be replicated, remixed, or used as a reference for new video production.

## When to Use

- User provides a video URL or local file to analyze
- Before creating a new video that should match an existing style
- When reverse-engineering a competitor's video or a reference piece
- As input to `/scripting-video` or `/directing-video`

## Visual Code Definition

Visual code = the DNA of a video's style. Extract these 5 dimensions:

1. **Scene Breakdown** — Shot list with timestamps, camera movement, transitions
2. **Visual Language** — Color palette (hex codes), typography (fonts, sizes), spacing, brand elements
3. **Motion Design** — Animation style (easing, speed), entrance/exit patterns, pacing rhythm
4. **Audio Profile** — Voiceover style (tone, pace, gender), music genre/tempo, sound effects
5. **Personalization Slots** — Variable elements that change per variant (name, company, logo, metric)

## Workflow

### Step 1: Extract

Run the analysis script from the creative-director project root:

```bash
node tools/scripts/analyze-video.js "<url-or-path>" "<project-name>" [fps]
```

This produces:
- `video-analysis/<project>/source.mp4` — the video file
- `video-analysis/<project>/frames/` — PNG frames at specified interval
- `video-analysis/<project>/transcript.txt` — cleaned transcript
- `video-analysis/<project>/metadata.json` — duration, resolution, codec info

### Step 2: Read Key Frames

Read frames at narrative boundaries to map the visual structure:
- First frame and last frame (open/close)
- Every 10th frame for rhythm
- Frames where the visual dramatically changes (scene transitions)

Use the Read tool to view each frame as an image.

### Step 3: Produce Visual Code Document

Create `video-analysis/<project>/visual-code.md` with:

1. **Scene Breakdown** — Table with: Time, Shot name, Visual description, Motion/animation, Audio/narration. Group into Acts.
2. **Visual Language DNA** — Color palette (hex), typography, motion language (pace, transitions, easing), composition rules.
3. **Audio Profile** — Voiceover style, music, sound effects.
4. **Personalization Slots** — Elements that could be swapped per variant (text, screens, logos, names, industry terms).
5. **What Makes It Work** — The 3-5 principles that make this video effective.
6. **Remake Opportunities** — How this could be updated, personalized, or remixed.

### Step 4: Align with Brand

Cross-reference the visual code against `brand/visual-identity.md` and `taste-engine/`. Note where the source video aligns with and deviates from brand standards. This informs whether to replicate the style exactly or adapt it.

## Example Output

```markdown
# Visual Code: Product Demo (60s)

## Scene Breakdown
| Time | Shot | Motion | Audio |
|------|------|--------|-------|
| 0:00-0:05 | Logo reveal on dark BG | Fade in, slight scale 1.0→1.02 | Synth pad, no VO |
| 0:05-0:15 | Dashboard wide shot | Slow pan right across monitors | VO: "Your data pipeline looks clean..." |
| 0:15-0:25 | Alert zoom-in | Quick zoom 100%→140%, red pulse | VO: "...until it isn't." Tension hit. |
| 0:25-0:45 | Product walkthrough | Screen recording, cursor-guided | VO explains detection + resolution |
| 0:45-0:55 | Metric cards animate in | Stagger entrance, left to right, 200ms delay | VO: "Catch issues before your customers do." |
| 0:55-1:00 | CTA + logo lock | Scale down to center, URL fades in | Music resolves, no VO |

## Visual Language
- Palette: #1A1A2E (deep navy), #E94560 (alert red), #0F3460 (mid blue), #FFFFFF (text)
- Typography: Favorit Std Medium (headlines), Favorit Mono (data labels)
- Spacing: 8px grid, generous padding around data elements

## Motion Design
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1.0) — smooth, not bouncy
- Pacing: Slow first 15s (trust), fast middle (urgency), calm close (confidence)

## Personalization Slots
- Company name in dashboard header (0:15)
- Alert type can swap (schema change, null spike, volume drop)
- Metric values in cards (0:45) — swap per vertical
```

## Output

A `visual-code.md` file that any video skill can use as a production reference. This is the video equivalent of a design system — it codifies the visual decisions so they can be reproduced consistently.

## Dependencies

- `yt-dlp` (brew install yt-dlp)
- `ffmpeg` (brew install ffmpeg)
- `tools/scripts/analyze-video.js`
