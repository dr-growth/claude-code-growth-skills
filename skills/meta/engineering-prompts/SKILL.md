---
name: engineering-prompts
description: Use this skill when creating, improving, or troubleshooting prompts for Claude and other LLMs. Helps with prompt engineering, improving AI results, writing effective prompts, diagnosing prompt issues, applying techniques like chain-of-thought or few-shot learning, optimizing for Claude 4.x models (Opus/Sonnet/Haiku), understanding model settings (temperature, tokens), and evaluating prompt quality. Triggers include "prompt engineering", "improve my prompt", "better AI results", "write effective prompts", "troubleshoot prompt", "prompt not working", "optimize for Claude", "few-shot examples", "chain of thought", "XML tags for Claude".
---

# Prompt Engineering Skill

Use this comprehensive guide to create, improve, and troubleshoot prompts for Claude and other LLMs. This skill helps you write more effective prompts, apply proven techniques, and optimize specifically for Claude 4.x models.

---

## Your Role

You are an expert prompt engineering assistant specializing in Claude 4.x models (Opus 4.6, Sonnet 4.5, Haiku 4.5). Your goal is to help users:

1. **Diagnose prompt issues** using a systematic framework
2. **Apply proven techniques** from foundational research and Anthropic best practices
3. **Iterate toward better results** through testing and refinement
4. **Optimize for Claude** using XML tags, thinking capabilities, and tool use patterns

You work iteratively, starting with quick diagnostics and progressing to deep technique application as needed. You always provide concrete, actionable improvements rather than generic advice.

---

## When to Use This Skill

Use this skill when you need to:

- **Create new prompts** for specific tasks or use cases
- **Improve existing prompts** that aren't producing desired results
- **Diagnose issues** with prompt performance or output quality
- **Learn techniques** like few-shot learning, chain-of-thought, or structured outputs
- **Optimize for Claude** using XML tags, thinking modes, or tool use
- **Evaluate quality** using the 7-point scorecard
- **Automate testing** with the included Node.js scripts

---

## Quick Diagnostic Workflow

Start here when a prompt isn't working. These 6 questions identify common issues:

### 1. **Is the instruction clear and unambiguous?**
- ❌ "Make it better" → ✅ "Rewrite this paragraph to be more concise (under 100 words) while preserving key points"
- **Fix**: Add specific, measurable criteria

### 2. **Is there sufficient context?**
- ❌ "Summarize this" → ✅ "Summarize this technical report for non-technical stakeholders who need to understand business impact"
- **Fix**: Specify audience, purpose, background knowledge

### 3. **Are there relevant examples?**
- ❌ "Format as JSON" → ✅ "Format as JSON like this: `{\"name\": \"...\", \"age\": 25}`"
- **Fix**: Add 2-5 concrete examples, especially for format or style

### 4. **Is the desired output format specified?**
- ❌ "Analyze the data" → ✅ "Analyze the data and provide: 1) Key trends (bullet points), 2) Anomalies (table), 3) Recommendations (numbered list)"
- **Fix**: Use XML tags, specify structure, show example output

### 5. **Have you identified potential ambiguities?**
- ❌ "Review the document" → ✅ "Review the document for: grammar errors, factual inaccuracies, and tone inconsistencies. Provide specific line numbers."
- **Fix**: List all evaluation dimensions explicitly

### 6. **Have you tested with edge cases?**
- ❌ Tested only with typical inputs → ✅ Tested with: empty input, very long input, special characters, boundary values
- **Fix**: Create test suite with diverse scenarios

**Quick Reference Table:**

| Symptom | Diagnosis | Solution | See Reference |
|---------|-----------|----------|---------------|
| Vague or inconsistent outputs | Unclear instructions | Add specific criteria, constraints | [01-core-techniques.md](reference/01-core-techniques.md) |
| Generic responses | Missing context | Specify audience, purpose, tone | [02-claude-specific-practices.md](reference/02-claude-specific-practices.md) |
| Wrong format | No output specification | Use XML tags, show examples | [technique-templates/xml-structured.md](templates/technique-templates/xml-structured.md) |
| Occasional errors | No examples provided | Add 3-5 diverse examples | [technique-templates/few-shot.md](templates/technique-templates/few-shot.md) |
| Superficial analysis | No reasoning guidance | Apply chain-of-thought | [technique-templates/chain-of-thought.md](templates/technique-templates/chain-of-thought.md) |
| Fails on edge cases | Insufficient testing | Test with boundary conditions | [03-diagnostic-framework.md](reference/03-diagnostic-framework.md) |

---

## Core Workflow

Follow these 5 steps for systematic prompt improvement:

### Step 1: Understand the Goal

**Define your success criteria:**
- What specific task should Claude perform?
- What does good output look like? (quality, format, length)
- Who is the audience? (technical, business, general)
- What constraints exist? (time, tokens, style)

**Example:**
```
Task: Generate weekly status report from project updates
Good output:
  - Bullet points organized by category
  - Highlights key accomplishments and blockers
  - Under 200 words
Audience: Executive team (non-technical)
Constraints: Must complete in <10 seconds
```

### Step 2: Choose Your Technique

Match technique to task type:

| Task Type | Recommended Technique | Why |
|-----------|----------------------|-----|
| Simple, one-off task | Zero-Shot Prompting | Quick, no setup needed |
| Classification/labeling | Few-Shot Learning | Examples define categories |
| Analysis/reasoning | Chain-of-Thought | Shows logical steps |
| Complex problem-solving | Tree of Thoughts | Explores multiple paths |
| Code generation | Contextual + Few-Shot | Context + examples = precision |
| Content creation | Role + System Prompts | Sets tone and expertise |
| Multi-step process | ReAct | Interleaves reasoning and action |
| High-stakes decision | Self-Consistency | Multiple runs reduce error |

**Not sure?** Start with **Few-Shot + Chain-of-Thought** as a reliable baseline.

### Step 3: Draft Initial Prompt

**Use a template:**
1. Browse [templates/role-templates/](templates/role-templates/) for your use case
2. Select the closest match (operations, sales, marketing, technical-developer, etc.)
3. Fill in placeholders with your specific details
4. Add technique structure (CoT, few-shot, XML)

**Claude 4.x optimizations:**
- Wrap structure in XML tags: `<context>`, `<instructions>`, `<examples>`
- For reasoning tasks, add: "Think through this step-by-step"
- For complex tasks, specify effort: "Use extended thinking for this complex analysis"
- For structured output, provide XML schema

**Example:**
```xml
<context>
You are analyzing customer feedback for a SaaS product.
Target audience: Product team
Goal: Identify top 3 feature requests
</context>

<instructions>
1. Read all feedback entries
2. Identify distinct feature requests
3. Count mentions of each request
4. Rank by frequency
5. Provide rationale for top 3
</instructions>

<output_format>
<feature_request rank="1">
  <name>Feature name</name>
  <mentions>Count</mentions>
  <rationale>Why it's important</rationale>
</feature_request>
</output_format>
```

### Step 4: Test and Iterate

**Manual testing:**
1. Run prompt with representative input
2. Evaluate output against success criteria
3. Use [quality scorecard](templates/quality-scorecard.md) (7 dimensions, 1-5 scale)
4. Note what works and what needs improvement

**Automated testing (optional):**
```bash
# Score your prompt automatically
node scripts/score-prompt.js my-prompt.txt

# A/B test two variations
node scripts/test-prompt.js prompt-v1.txt prompt-v2.txt test-input.txt
```

**What to test:**
- Typical cases (80% of real usage)
- Edge cases (empty, very long, special characters)
- Boundary conditions (exactly at limits)
- Adversarial inputs (trying to break it)

### Step 5: Refine Based on Results

Use the [prompt refinement worksheet](templates/prompt-refinement-worksheet.md) to systematically improve.

**Common issues and fixes:**

| Issue | Fix | Example |
|-------|-----|---------|
| Too verbose | Add length constraint | "In under 100 words..." |
| Too terse | Request detailed explanation | "Provide reasoning for each step" |
| Wrong tone | Specify tone explicitly | "Use conversational, friendly tone" |
| Misses key points | Add examples of good output | Show 2-3 ideal responses |
| Inconsistent format | Use XML schema + strict instructions | Provide exact tag structure |
| Hallucinations | Add "Only use provided information" | See [02-claude-specific-practices.md](reference/02-claude-specific-practices.md) |

**Iteration strategy:**
1. Fix the biggest issue first
2. Test again
3. Repeat until meeting success criteria (aim for scorecard >25/35)
4. Stop when marginal gains aren't worth effort

---

## 11 Core Techniques Quick Reference

### 1. **Zero-Shot Prompting**
Give clear instruction without examples. Best for simple, well-defined tasks.

**When to use:** Task is straightforward, examples would be obvious
```
Translate this sentence to French: "Hello, how are you?"
```

### 2. **Few-Shot Learning**
Provide 2-5 examples before asking for new output. Teaches format and style.

**When to use:** Classification, formatting, style matching
```
Sentiment: "I love this!" → Positive
Sentiment: "It's okay" → Neutral
Sentiment: "Terrible experience" → Negative
Sentiment: "Best purchase ever!" → ?
```

### 3. **System Prompting**
Set persistent context and behavior at system level.

**When to use:** Consistent role across conversation, API usage
```xml
<system>
You are a patient technical support agent specializing in database issues.
Always ask clarifying questions before providing solutions.
</system>
```

### 4. **Role Prompting**
Assign specific persona or expertise.

**When to use:** Need domain expertise, specific writing style
```
You are a senior data scientist with 10 years of experience in healthcare analytics.
Explain this statistical finding to hospital administrators.
```

### 5. **Contextual Prompting**
Provide comprehensive background information.

**When to use:** Task requires deep domain knowledge, complex decision-making
```xml
<context>
Company: SaaS startup, 50 employees, Series A funded
Product: Project management tool for remote teams
Current challenge: 30% churn in first 90 days
Recent changes: Added mobile app, increased price by 20%
</context>
```

### 6. **Step-Back Prompting**
Ask for high-level principles before specific answer.

**When to use:** Complex problems, teaching, ensuring deep understanding
```
Before answering how to optimize this database query,
first explain the general principles of database index usage.
Then apply those principles to this specific case.
```

### 7. **Chain-of-Thought (CoT)**
Request explicit reasoning steps. Dramatically improves complex reasoning.

**When to use:** Math, logic, analysis, multi-step problems
```
Solve this step-by-step, showing your reasoning at each stage:
If a train travels 120 miles in 2 hours, then speeds up to cover
the next 180 miles in 2.5 hours, what was its average speed?
```

### 8. **Self-Consistency**
Generate multiple responses, select most consistent answer.

**When to use:** High-stakes decisions, reducing errors, validation
```
Generate 3 different solutions to this problem, then identify
which approach appears most reliable based on common patterns.
```

### 9. **Tree of Thoughts (ToT)**
Explore multiple reasoning paths simultaneously.

**When to use:** Creative problems, strategic planning, ambiguous situations
```
Consider three different approaches to solving this problem:
1) Cost optimization approach
2) User experience approach
3) Technical simplicity approach

Evaluate each path's pros and cons, then recommend the best.
```

### 10. **ReAct (Reasoning + Acting)**
Interleave thought and action for tool use.

**When to use:** Multi-step processes, tool/API usage, search tasks
```
Task: Find the current weather in Paris and recommend what to wear.

Thought: I need current weather data for Paris.
Action: [Search weather Paris]
Observation: 18°C, light rain forecast
Thought: For 18°C with rain, I should recommend layers and rain gear.
Response: [Generate recommendation]
```

### 11. **Automatic Prompt Engineering (APE)**
Use Claude to help design prompts.

**When to use:** Stuck on how to phrase prompt, need optimization
```
I need to create a prompt that [goal].
My current attempt is: [current prompt]
It's producing [issue].
Help me refine this prompt to achieve [desired outcome].
```

**Detailed examples and templates:** See [reference/01-core-techniques.md](reference/01-core-techniques.md)

---

## Claude 4.x Specific Guidance

### XML Tags (Highly Recommended)

Claude models are trained to recognize XML-like structure. This dramatically improves parsing and following instructions.

**Basic pattern:**
```xml
<instructions>
Do task A, then task B, then task C
</instructions>

<context>
Background information here
</context>

<examples>
Example 1: ...
Example 2: ...
</examples>
```

**Why XML works:**
- Clear separation of prompt components
- Unambiguous boundaries
- Claude is trained to pay special attention to content within tags
- Reduces prompt injection risks

**Custom tags:** You can create your own tags! Use semantic names: `<customer_data>`, `<constraints>`, `<success_criteria>`

**More patterns:** See [templates/technique-templates/xml-structured.md](templates/technique-templates/xml-structured.md)

### Thinking Capabilities

**Claude 4.6 Opus (Adaptive Thinking):**
```javascript
// Use 'effort' parameter to control thinking depth
{
  model: "claude-opus-4-6",
  messages: [...],
  effort: "medium"  // low | medium | high | max
}
```
- Low: Quick tasks, simple reasoning
- Medium: Standard tasks (default)
- High: Complex analysis, multi-step problems
- Max: Extremely difficult problems requiring deep thought

**Claude 3.5 Sonnet/Opus (Extended Thinking):**
```javascript
// Enable explicit thinking for older models
{
  model: "claude-3-5-sonnet-20241022",
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  }
}
```

**In prompts:** "Think through this step-by-step" or "Use extended reasoning"

### Tool Use Optimization

**Parallel tool calling:**
```xml
<instructions>
You have access to: search_database, fetch_weather, get_stock_price
When multiple tools are needed, call them in parallel for efficiency.
</instructions>
```

**Explicit vs. suggestive:**
- Explicit: "Use the search_database tool to find..." (forces tool use)
- Suggestive: "You have access to search_database if needed" (optional)

**More details:** See [reference/02-claude-specific-practices.md](reference/02-claude-specific-practices.md)

### Model Selection

| Model | Best For | Characteristics |
|-------|----------|-----------------|
| Opus 4.6 | Complex reasoning, long tasks, high-stakes | Slowest, most capable, adaptive thinking |
| Sonnet 4.5 | Balanced performance, most use cases | Fast, highly capable, great value |
| Haiku 4.5 | Simple tasks, high volume, low latency | Fastest, cost-effective, surprising capability |

---

## Quick Wins

Apply these immediately for better prompts:

1. **Be explicit about format**
   - ❌ "List the items"
   - ✅ "List the items as a numbered list with each item on a new line"

2. **Add relevant context**
   - ❌ "Summarize this"
   - ✅ "Summarize this technical doc for executives who need to decide on budget allocation"

3. **Use XML tags**
   - Wrap instructions, context, examples in semantic tags
   - Claude pays special attention to tagged content

4. **Provide 3-5 examples**
   - Show desired format, style, and edge cases
   - Diverse examples teach better than many similar ones

5. **Match your tone needs**
   - "Use friendly, conversational tone" vs. "Use formal, technical tone"
   - Be explicit about formality, emotion, complexity

6. **Test with the scorecard**
   - Use [quality scorecard](templates/quality-scorecard.md) to evaluate
   - Aim for >25/35 score for production use

---

## Interactive Tools

Three Node.js scripts automate common tasks:

### 1. Automated Quality Scoring
```bash
node scripts/score-prompt.js my-prompt.txt
```
- Scores your prompt against 7 quality dimensions (1-5 each)
- Provides total score, rating, strengths, and improvements
- Uses Claude API for objective evaluation
- Output: JSON with actionable feedback

### 2. A/B Testing
```bash
node scripts/test-prompt.js prompt-v1.txt prompt-v2.txt test-input.txt
```
- Tests two prompt variations side-by-side
- Measures latency and token usage
- Shows differences in output
- Helps choose best version empirically

### 3. Template Generator
```bash
node scripts/generate-template.js
```
- Interactive CLI for customizing role templates
- Walks through available templates
- Prompts for placeholder values
- Saves personalized prompt

**Requirements:**
```bash
npm install -g @anthropic-ai/sdk
export ANTHROPIC_API_KEY="your-api-key"
```

Scripts are optional but highly recommended for efficiency.

---

## Learning Path

Progressive mastery sequence:

### Beginner (Start Here)
- Read this SKILL.md completely
- Apply Quick Diagnostic Workflow to an existing prompt
- Use the quality scorecard to evaluate
- Try one new technique (recommend: Few-Shot)

### Intermediate (After 5-10 prompts)
- Study [reference/01-core-techniques.md](reference/01-core-techniques.md) (all 11 techniques)
- Master XML structuring: [templates/technique-templates/xml-structured.md](templates/technique-templates/xml-structured.md)
- Learn Chain-of-Thought deeply: [templates/technique-templates/chain-of-thought.md](templates/technique-templates/chain-of-thought.md)
- Explore role templates: [templates/role-templates/](templates/role-templates/)

### Advanced (After 20+ prompts)
- Study Claude-specific optimizations: [reference/02-claude-specific-practices.md](reference/02-claude-specific-practices.md)
- Learn advanced techniques: [reference/05-advanced-techniques.md](reference/05-advanced-techniques.md)
- Master model settings: [reference/04-model-settings-guide.md](reference/04-model-settings-guide.md)
- Use automation scripts regularly

### Expert (Mastery)
- Combine multiple techniques fluidly
- Create custom templates for your domain
- Teach others using the diagnostic framework
- Contribute improvements to this skill

**Structured curriculum:** See [reference/07-learning-path.md](reference/07-learning-path.md)

---

## Additional Resources

**Reference Documentation:**
- [01-core-techniques.md](reference/01-core-techniques.md) - Deep dive into all 11 techniques with examples
- [02-claude-specific-practices.md](reference/02-claude-specific-practices.md) - Claude 4.x optimizations from Anthropic
- [03-diagnostic-framework.md](reference/03-diagnostic-framework.md) - Expanded troubleshooting guide
- [04-model-settings-guide.md](reference/04-model-settings-guide.md) - Temperature, tokens, effort parameters
- [05-advanced-techniques.md](reference/05-advanced-techniques.md) - ToT, ReAct, Self-Consistency, Meta-Prompting
- [06-glossary.md](reference/06-glossary.md) - Comprehensive terminology
- [07-learning-path.md](reference/07-learning-path.md) - Beginner to expert progression

**Templates:**
- [prompt-refinement-worksheet.md](templates/prompt-refinement-worksheet.md) - Interactive improvement checklist
- [quality-scorecard.md](templates/quality-scorecard.md) - 7-point evaluation tool
- [role-templates/](templates/role-templates/) - 8 role-based prompt starters
- [technique-templates/](templates/technique-templates/) - CoT, few-shot, XML patterns

**Scripts:**
- [score-prompt.js](scripts/score-prompt.js) - Automated quality evaluation
- [test-prompt.js](scripts/test-prompt.js) - A/B testing framework
- [generate-template.js](scripts/generate-template.js) - Interactive template customization

---

## Getting Help

**Within this skill:**
- Start with Quick Diagnostic Workflow (6 questions)
- Check Quick Reference Table for your symptom
- Browse templates for your use case
- Read relevant reference documentation

**External resources:**
- [Official Claude Documentation](https://docs.anthropic.com/)
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Interactive Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)

**Testing your prompts:**
- Use quality scorecard (manual)
- Run score-prompt.js (automated)
- Test with diverse inputs including edge cases

---

**Version:** 1.0.0
**Last Updated:** February 2026
**Compatible with:** Claude Opus 4.6, Sonnet 4.5, Haiku 4.5
