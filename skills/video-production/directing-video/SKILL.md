---
name: directing-video
description: Orchestrate end-to-end video production from brief to final render. Use for any video request — new videos, remakes, personalized variant sets, short-form cuts, or video analysis. Triggers on video production, create video, make video, video project, produce video, video campaign, demo video, product video.
---

# Directing Video

The orchestrator skill. Takes a video project from brief to final output by coordinating all other video skills. This is the Creative Director's video production workflow — the same brief-execute-QA-learn loop used for static assets, adapted for motion.

## When to Use

- Any video production request (new video, remake, personalized variant set)
- This is the entry point — it decides which other skills to invoke and in what order

## Workflow

### Phase 1: Understand the Ask

Determine project type:

| Type | Description | Skills Chain |
|------|------------|-------------|
| **Analyze** | "What's in this video? Extract its DNA." | `/analyzing-video` only |
| **Remake** | "Recreate this video with updates." | `/analyzing-video` -> `/scripting-video` -> `/generating-video-screens` -> `/assembling-video` |
| **New** | "Create a video from scratch." | `/scripting-video` -> `/generating-video-screens` -> `/assembling-video` |
| **Personalize** | "Make variants of this video per prospect." | `/analyzing-video` -> `/personalizing-video` -> `/generating-video-screens` -> `/assembling-video` |
| **Cut** | "Make a 30-second version of this longer video." | `/analyzing-video` -> `/scripting-video` (short-form) -> `/assembling-video` (FFmpeg trim) |

### Decision Guide

When the project type isn't obvious from the request:

- **Remake vs New:** Remake if the core message and persona still fit but execution is weak (outdated visuals, wrong pacing, bad audio). New if the message, persona, or context has changed.
- **Personalize vs Remake:** Personalize if the video structure works and you need 5+ variants with different company/name/metric data. Remake if you need fewer than 5 variants or the structure needs changes.
- **Cut vs New:** Cut if the source video has strong content but is too long for the target platform. New if the target platform needs a fundamentally different narrative arc (e.g., 60-sec explainer → 15-sec social ad).
- **Analyze only:** When someone asks "what makes this video work?" or wants to extract style for future reference without producing anything new.

### Phase 2: Creative Brief

Generate a video creative brief (extends `templates/creative-brief.md`):

- **Objective:** What should the viewer do/feel/know after watching?
- **Key message:** "This video is about ___" (one sentence)
- **Target persona(s):** Reference persona files
- **Duration:** Target runtime
- **Format:** Aspect ratio, resolution, delivery platform
- **Reference:** Visual code document (if remaking) or style references
- **Personalization scope:** What varies per variant? How many variants?
- **Audio approach:** Voiceover (human/TTS), music, sound design
- **Villain:** What enemy are we attacking? (for ad-style videos)

### Phase 3: Execute

Invoke skills in sequence per the project type. Key decision points:

1. **After scripting:** Present script for human review before producing screens
2. **After screen generation:** Spot-check 3-5 screens against brand standards
3. **After first assembly:** Full QA before batch rendering variants

### Phase 4: QA

Evaluate the assembled video against:

1. **Brand compliance** — Colors, typography, logo usage match visual identity
2. **Narrative flow** — Does the story arc work? Hook in first 3 seconds?
3. **Audio-visual sync** — VO matches visuals at every beat
4. **Pacing** — No shots too long or too short. Information density is right.
5. **Personalization accuracy** — Variable slots filled correctly per variant
6. **Technical quality** — Resolution, file size, codec appropriate for platform
7. **Taste check** — Does it match the taste engine? Would we show this to a prospect?

### Phase 5: Deliver + Learn

- Move approved videos to project `assets/` directory
- Capture feedback in `feedback.md`
- Update `taste-engine/learnings.md` with video-specific insights
- Log project in `projects/`

## Project Structure

```
projects/YYYY-MM-[video-project-name]/
  brief.md              <- Video creative brief
  script.md             <- Master script with shot direction
  variant-map.json      <- Personalization variable data
  screens/              <- Generated visual assets
  audio/                <- Voiceover and music files
  drafts/               <- QA'd renders before review
  assets/               <- Final approved videos
  feedback.md           <- Human feedback
```

## Creative Principles for Video

All creative-director principles apply, plus:

1. **Show the product.** Product demos > abstract concepts. Always.
2. **Cursor is the guide.** In demo videos, the cursor IS the storytelling device.
3. **Front-load the hook.** First 3 seconds decide if someone watches. No logos, no intros. Start with tension.
4. **One idea per scene.** If you need two messages, use two shots.
5. **Motion is communication.** Every animation must answer: "What does this tell the viewer?"
6. **White space transfers to video.** The generous spacing and restraint of your brand's visual identity applies to motion too. Don't fill every frame.
7. **Sound design matters.** Even subtle ambient audio creates presence. Silence feels like a mistake.

## Dependencies

- All other video skills
- `brand/visual-identity.md`
- `brand/voice-and-tone.md`
- `quality/qa-rubric.md`
- `taste-engine/`
- `personas/`
