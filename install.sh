#!/bin/bash
# Claude Code Growth Skills — Installer
# Copies all 81 skills to your Claude Code skills directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"
TARGET_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

echo "Claude Code Growth Skills — Installer"
echo "======================================"
echo ""
echo "Source:  $SKILLS_DIR"
echo "Target:  $TARGET_DIR"
echo ""

# Count skills
SKILL_COUNT=$(find "$SKILLS_DIR" -name "SKILL.md" | wc -l | tr -d ' ')
echo "Found $SKILL_COUNT skills to install."
echo ""

# Check if target exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Creating $TARGET_DIR..."
  mkdir -p "$TARGET_DIR"
fi

# Copy each category
for category_dir in "$SKILLS_DIR"/*/; do
  category=$(basename "$category_dir")
  for skill_dir in "$category_dir"*/; do
    skill=$(basename "$skill_dir")
    if [ -f "$skill_dir/SKILL.md" ]; then
      mkdir -p "$TARGET_DIR/$skill"
      cp "$skill_dir/SKILL.md" "$TARGET_DIR/$skill/"
    fi
  done
  cat_count=$(find "$category_dir" -name "SKILL.md" | wc -l | tr -d ' ')
  echo "  $category: $cat_count skills"
done

echo ""
echo "Done. $SKILL_COUNT skills installed to $TARGET_DIR"
echo ""
echo "Skills will auto-invoke when Claude detects matching requests."
echo "Manual-only skills (marked with disable-model-invocation) require explicit invocation."
