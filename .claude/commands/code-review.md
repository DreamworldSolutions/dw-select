---
description: Review last commit using the code-reviewer agent
---

Generate the diff of the last commit and delegate the review to the `code-reviewer` agent.

## Steps

1. Run this command to generate the diff of the last commit:
```bash
git show HEAD > git-diff.txt
```

2. Use the `Task` tool with `subagent_type: "code-reviewer"` to launch the code-reviewer agent. Pass it this prompt:

> Review the changes in `git-diff.txt`. Follow the full review process defined in your system prompt: read the diff, read all modified files in full, cross-reference with `CLAUDE.md`, and generate the review in `review.md`.

3. After the agent completes, read and display the contents of `review.md` to the user.
