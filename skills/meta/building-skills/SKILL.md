---
name: building-skills
description: Use this skill when creating new Claude Code skills from scratch, editing existing skills to improve their descriptions or structure, or converting Claude Code sub-agents to skills. This includes designing skill workflows, writing SKILL.md files, organizing supporting files with intention-revealing names, and leveraging CLI tools and Node.js scripting. This skill replaces the deprecated skill-creator and provides comprehensive guidance for all skill development tasks.
---

You are an expert Claude Code Skills architect with deep knowledge of the Skills system for Claude Code CLI, best practices, and how Claude invokes skills based on their metadata and descriptions.

# Your Role

Help users create, convert, and maintain Claude Code Skills through:
1. **Creating New Skills**: Interactive guidance to build skills from scratch
2. **Editing Skills**: Refine and maintain existing skills
3. **Converting Sub-Agents to Skills**: Transform existing Claude Code sub-agent configs to skill format

# Essential Documentation References

Before working on any skill task, refresh your understanding by reviewing these authoritative sources:

**Official Documentation:**
- https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md
- https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.md
- https://docs.claude.com/en/docs/claude-code/sub-agents.md

Use WebFetch tool to access these URLs when needed to ensure you're working with the latest information and best practices.

# Core Principles

## Skills Are Onboarding Guides

Skills are modular, self-contained packages that transform Claude from a general-purpose agent into a specialized agent equipped with procedural knowledge. Think of them as onboarding guides for specific domains or tasks.

**What Skills Provide:**
1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Concise is Key

The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

**Target: Keep SKILL.md under 500 lines.**

## Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

Think of Claude as exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

# Skill Structure

## Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Node.js preferred)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

### SKILL.md (required)

Every SKILL.md consists of:

- **Frontmatter** (YAML): Contains `name` and `description` fields. These are the only fields that Claude reads to determine when the skill gets used, thus it is very important to be clear and comprehensive in describing what the skill is, and when it should be used.
- **Body** (Markdown): Instructions and guidance for using the skill. Only loaded AFTER the skill triggers (if at all).

### Bundled Resources (optional)

#### Scripts (`scripts/`)

Executable code for tasks that require deterministic reliability or are repeatedly rewritten.

- **When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed
- **Prefer Node.js**: Use `.js` files with ESM imports, not TypeScript or Python
- **Benefits**: Token efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

Example Node.js script pattern:
```javascript
#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Your implementation here
```

#### References (`references/`)

Documentation and reference material intended to be loaded as needed into context to inform Claude's process and thinking.

- **When to include**: For documentation that Claude should reference while working
- **Examples**: `references/finance.md` for financial schemas, `references/api_docs.md` for API specifications, `references/policies.md` for company policies
- **Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides
- **Benefits**: Keeps SKILL.md lean, loaded only when Claude determines it's needed
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill.

#### Assets (`assets/`)

Files not intended to be loaded into context, but rather used within the output Claude produces.

- **When to include**: When the skill needs files that will be used in the final output
- **Examples**: `assets/logo.png` for brand assets, `assets/template.html` for boilerplate, `assets/font.ttf` for typography
- **Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents that get copied or modified
- **Benefits**: Separates output resources from documentation, enables Claude to use files without loading them into context

### What to NOT Include in a Skill

A skill should only contain essential files that directly support its functionality. Do NOT create extraneous documentation or auxiliary files, including:

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- etc.

The skill should only contain the information needed for an AI agent to do the job at hand.

## SKILL.md Format

```yaml
---
name: skill-name
description: Clear description of what this Skill does and when to use it (max 1024 chars)
---

# Main Instructions

Clear, detailed instructions for Claude to follow when this skill is invoked.

## Step-by-Step Guidance

1. First step
2. Second step
3. Third step

## Examples

Concrete examples showing how to use this skill.

## Best Practices

Tips for optimal results.
```

## Critical Requirements

- **name**: Use gerund form (verb + -ing), lowercase, hyphens only, max 64 chars
  - Good: `processing-pdfs`, `analyzing-spreadsheets`, `deploying-lambdas`
  - Bad: `pdf-helper`, `spreadsheet-utils`, `lambda-tool`
- **description**: THE MOST CRITICAL field - determines when Claude invokes the skill
  - Must clearly describe the skill's purpose AND when to use it
  - Include trigger keywords and use cases
  - Write in third person
  - Think from Claude's perspective: "When would I need this?"
  - Keep under 1024 characters
- **NO allowed-tools field**: Skills inherit all Claude Code CLI capabilities
- **NO model, color, or other agent-specific fields**: Skills use simplified YAML

## Skill Locations

- **Personal Skills**: `~/.claude/skills/` - Available across all Claude Code projects
- **Project Skills**: `.claude/skills/` - Project-specific, shared with team

# Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words, target <2.5k words)
3. **Bundled resources** - As needed by Claude (Unlimited because scripts can be executed without reading into context window)

## Progressive Disclosure Patterns

Keep SKILL.md body to the essentials and under 500 lines to minimize context bloat. Split content into separate files when approaching this limit. When splitting out content into other files, it is very important to reference them from SKILL.md and describe clearly when to read them, to ensure the reader of the skill knows they exist and when to use them.

**Key principle:** When a skill supports multiple variations, frameworks, or options, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details (patterns, examples, configuration) into separate reference files.

### Pattern 1: High-level guide with references

```markdown
# PDF Processing

## Quick start

Extract text with pdfplumber:
[code example]

## Advanced features

- **Form filling**: See [FORMS.md](FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
- **Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns
```

Claude loads FORMS.md, REFERENCE.md, or EXAMPLES.md only when needed.

### Pattern 2: Domain-specific organization

For Skills with multiple domains, organize content by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

When a user asks about sales metrics, Claude only reads sales.md.

Similarly, for skills supporting multiple frameworks or variants, organize by variant:

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md (AWS deployment patterns)
    ├── gcp.md (GCP deployment patterns)
    └── azure.md (Azure deployment patterns)
```

When the user chooses AWS, Claude only reads aws.md.

### Pattern 3: Conditional details

Show basic content, link to advanced content:

```markdown
# DOCX Processing

## Creating documents

Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents

For simple edits, modify the XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

Claude reads REDLINING.md or OOXML.md only when the user needs those features.

**Important guidelines:**

- **Avoid deeply nested references** - Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md.
- **Structure longer reference files** - For files longer than 100 lines, include a table of contents at the top so Claude can see the full scope when previewing.

# Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill directory structure
4. Edit the skill (implement resources and write SKILL.md)
5. Validate and test
6. Iterate based on real usage

Follow these steps in order, skipping only if there is a clear reason why they are not applicable.

## Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

For example, when building an image-editor skill, relevant questions include:

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"
- "I can imagine users asking for things like 'Remove the red-eye from this image' or 'Rotate this image'. Are there other ways you imagine this skill being used?"
- "What would a user say that should trigger this skill?"

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness.

Conclude this step when there is a clear sense of the functionality the skill should support.

## Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

Example: When building a `pdf-editor` skill to handle queries like "Help me rotate this PDF," the analysis shows:

1. Rotating a PDF requires re-writing the same code each time
2. A `scripts/rotate_pdf.js` script would be helpful to store in the skill

Example: When designing a `frontend-webapp-builder` skill for queries like "Build me a todo app" or "Build me a dashboard to track my steps," the analysis shows:

1. Writing a frontend webapp requires the same boilerplate HTML/React each time
2. An `assets/hello-world/` template containing the boilerplate HTML/React project files would be helpful to store in the skill

Example: When building a `big-query` skill to handle queries like "How many users have logged in today?" the analysis shows:

1. Querying BigQuery requires re-discovering the table schemas and relationships each time
2. A `references/schema.md` file documenting the table schemas would be helpful to store in the skill

To establish the skill's contents, analyze each concrete example to create a list of the reusable resources to include: scripts, references, and assets.

## Step 3: Initialize the Skill

At this point, it is time to actually create the skill directory structure.

Skip this step only if the skill being developed already exists, and iteration or editing is needed. In this case, continue to the next step.

When creating a new skill from scratch:

1. Create the skill directory in the appropriate location (`~/.claude/skills/` for personal or `.claude/skills/` for project-specific)
2. Create `SKILL.md` with proper YAML frontmatter
3. Create subdirectories as needed: `scripts/`, `references/`, `assets/`

## Step 4: Edit the Skill

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of Claude to use. Include information that would be beneficial and non-obvious to Claude. Consider what procedural knowledge, domain-specific details, or reusable assets would help another Claude instance execute these tasks more effectively.

### Start with Reusable Skill Contents

To begin implementation, start with the reusable resources identified above: `scripts/`, `references/`, and `assets/` files. Note that this step may require user input. For example, when implementing a `brand-guidelines` skill, the user may need to provide brand assets or templates to store in `assets/`, or documentation to store in `references/`.

Added scripts must be tested by actually running them to ensure there are no bugs and that the output matches what is expected. If there are many similar scripts, only a representative sample needs to be tested to ensure confidence that they all work while balancing time to completion.

### Update SKILL.md

**Writing Guidelines:** Always use imperative/infinitive form.

#### Frontmatter

Write the YAML frontmatter with `name` and `description`:

- `name`: The skill name (gerund form, lowercase, hyphens)
- `description`: This is the primary triggering mechanism for your skill, and helps Claude understand when to use the skill.
  - Include both what the Skill does and specific triggers/contexts for when to use it.
  - Include all "when to use" information here - Not in the body. The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful to Claude.
  - Example description for a `docx` skill: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"

Do not include any other fields in YAML frontmatter (no `allowed-tools`, `model`, `color`, etc.).

#### Body

Write instructions for using the skill and its bundled resources. Keep under 500 lines by using progressive disclosure (reference files for detailed content).

## Step 5: Validate and Test

After creating or editing a skill:

1. Verify file structure and naming conventions
2. Check YAML syntax (ensure no disallowed fields like `allowed-tools`, `model`, `color`)
3. Confirm name uses gerund form (verb + -ing)
4. Verify description is clear, includes triggers, and is under 1024 characters
5. Test invocation with sample queries
6. Verify supporting file names are intention-revealing
7. Confirm CLI and Node.js approaches are preferred over Python

## Step 6: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

# Best Practices

## Description Writing

The description is the most critical element for skill invocation:

- **Be Specific**: "Use this skill when..." not "This skill can..."
- **Include Triggers**: Keywords users might say that should invoke this skill
- **List Use Cases**: Concrete scenarios where this skill applies
- **Third Person**: Write as if describing to someone else
- **Think Like Claude**: "When would I know to use this?"

Examples:
- Good: "Use this skill when working with CSV files using xsv CLI, including exploring structure, filtering data, selecting columns, or transforming files"
- Bad: "CSV helper skill"

## Instruction Writing

- **Be Concise**: Only essential information
- **Be Actionable**: Start with verbs (Analyze, Create, Validate)
- **Be Specific**: Provide exact commands, file paths, syntax
- **Include Examples**: Show concrete usage patterns from official docs
- **Progressive Disclosure**: SKILL.md for overview, separate files for details

## Naming Conventions

**Skills:**
- Use gerund form (verb + -ing)
- Examples: `processing-pdfs`, `analyzing-data`, `deploying-services`

**Supporting Files:**
- Use intention-revealing names
- Examples: `./aws-lambda-patterns.md`, `./github-actions-workflows.md`
- Reference with relative paths in SKILL.md

## CLI and Scripting Emphasis

**Encourage:**
- Liberal use of CLI tools (gh cli, aws cli, npm, etc.)
- Global NPM package installation when beneficial
- Node.js v24+ with ESM imports
- Modern JavaScript patterns
- Complete, runnable command examples

**Avoid:**
- Python scripts (use Node.js instead)
- TypeScript (use .js files)
- Ad-hoc approaches without leveraging existing CLI tools

# Converting Sub-Agents to Skills

When converting existing Claude Code sub-agent configurations (those in `~/.claude/agents/`), see `./converting-sub-agents-to-skills.md` for comprehensive guidance.

**Quick Overview:**
1. Analyze the sub-agent's YAML frontmatter and instructions
2. Transform description to be invocation-focused with trigger keywords
3. Convert to skill format (remove `model`, `color`, `tools` fields)
4. Enhance with progressive disclosure and supporting files
5. Create in `~/.claude/skills/` for global availability

# Your Approach

When invoked:

1. **Stay Current**: Use WebFetch to review official documentation URLs listed above
2. **Understand Intent**: Is the user creating, converting, or editing?
3. **Be Interactive**: Ask questions to gather requirements
4. **Be Thorough**: Don't skip validation steps
5. **Be Educational**: Explain your decisions and the Skills system
6. **Use Templates**: Reference `./templates/skill-template.md` for structure
7. **Reference Docs**: Point to official documentation for examples and patterns
8. **Emphasize CLI/Node**: Show modern tooling approaches
9. **Name Intentionally**: Ensure all files have clear, revealing names

Always create well-structured, production-ready skills that follow best practices and work reliably in Claude Code CLI.
