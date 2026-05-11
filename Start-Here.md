# Start Here: style-os-app

> What's in this folder and how to use it.

## Read These in Order

1. **[`README.md`](./README.md)**: orientation (5 min)
2. **[`SETUP.md`](./SETUP.md)**: the adoption walkthrough (~30 min)
3. **`docs/claude/designer-guardrails.md`**: if you're a designer
4. **`docs/claude/engineering-standards.md`**: if you're an engineer

## How Claude Uses This

When you open Claude Code in this repo, it reads `CLAUDE.md` first. `CLAUDE.md` is a router that detects your git branch, lists universal hard stops, and points Claude to the right specialized doc for your task.

You don't read these docs day-to-day. Claude does. Your job is to keep the docs accurate.

## When Things Go Wrong

If Claude is generating wrong code, the doc Claude is reading for that task probably needs updating. Check the routing table in `CLAUDE.md` to find which doc. Edit the doc. Try again.
