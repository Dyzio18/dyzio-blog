---
description: "Generate a new blog post draft from notes, Obsidian content, or a rough outline, using this repo's MDX conventions and the author's style."
name: "New Blog Post From Notes"
argument-hint: "Provide your notes, vault entry, topic, and whether you want an outline, frontmatter, or full MDX draft."
agent: "Blog Knowledge Architect"
model: "GPT-5 (copilot)"
---

Create a new blog post draft for this repository from the material provided in chat.

Requirements:
- Use the conventions already present in the blog content under [data/blog](./data/blog).
- Follow the writing rules from [author style skill](./../skills/author-style-writing/SKILL.md) and [author style reference](./../skills/author-style-writing/references/author-style.md).
- Default to Polish unless I explicitly ask for English.
- Prefer a publishable MDX draft when enough material is available.
- If the source material is incomplete, first list the missing facts that block a strong final draft.

Expected output:
- A proposed title.
- Suggested frontmatter with `title`, `date`, `tags`, `summary`, and `draft` when appropriate.
- A short outline.
- A complete draft in MDX when the input is sufficient.
- A short note explaining which parts came directly from my notes and which parts were editorially improved.