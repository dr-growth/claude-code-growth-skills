---
name: scripting-video
description: Write production-ready video scripts with shot direction, timing, voiceover text, and personalization variable slots. Use when creating new video scripts from a creative brief, rewriting scripts from a visual code document, generating short-form cuts, or producing personalized script variants.
---

# Scripting Video

Write video scripts with shot direction, timing, voiceover text, and variable slots for personalization. Produces scripts that are ready for production — not just copy, but a complete production blueprint.

## When to Use

- Creating a new video from a creative brief
- Rewriting/updating an existing video's script (use visual-code.md as input)
- Creating personalized script variants from a master template
- Writing scripts for short-form cuts (15s, 30s, 60s) from a longer piece

## Workflow

### Step 1: Inputs

Gather before writing:
- **Creative brief** or description of the video's purpose
- **Visual code** from an existing reference video (if remaking)
- **Target persona(s)** from `personas/`
- **Key message** — "This video is about ___" (one sentence)
- **Format constraints** — duration, aspect ratio, platform (YouTube, LinkedIn, website embed)
- **Personalization requirements** — what varies per variant?

### Step 2: Script Structure

Every script follows this format:

```
# [Video Title]
## Duration: [target runtime]
## Persona: [target audience]
## Key Message: [one sentence]

---

### SCENE [N]: [Scene Name]
**Time:** [start] - [end]
**Visual:** [What the viewer sees — be specific about composition, colors, motion]
**Motion:** [How elements move — transitions, animations, camera movement]
**VO:** "[Exact voiceover text]"
**Text on screen:** "[Any text overlays]"
**Variable slots:** [What changes per personalized variant]

---
```

### Step 3: Script Principles

1. **Write for the eye first, ear second.** The visual should communicate even on mute. The VO reinforces, not replaces.
2. **One idea per scene.** If a scene has two messages, split it.
3. **Front-load the hook.** First 3 seconds must arrest attention. No logos, no intros. Start with the tension.
4. **Cursor is the guide.** For product demos, the cursor is the protagonist. Script its movement like a character.
5. **Time the VO to visuals precisely.** When the VO says "root cause," that's when the RCA chart appears. Sync is everything.
6. **Variable slots are explicit.** Mark every element that changes per variant with `[VARIABLE: description]`.

### Step 4: Variant Generation

For personalized scripts, produce:
- **Master script** — with all variable slots marked
- **Variable map** — table of slots and what fills them per variant
- **Sample variant** — one fully-filled example

## Output

A `.md` script file in the project folder, ready for `/generating-video-screens` and `/assembling-video`.

## Dependencies

- `brand/voice-and-tone.md` — for VO style
- `personas/` — for audience targeting
- Visual code document (if remaking an existing video)
