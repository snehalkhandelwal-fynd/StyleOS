# Setup Guide: Style_OS

> The adoption walkthrough. Three parallel tracks run by whoever on the team is closest to each part of the work. Expect 3-5 days of focused effort to get to first usable state, plus ongoing weekly maintenance.

## Before You Start

Your DS is just getting started. Consider maturing the DS first or running it as a parallel workstream alongside this adoption.

## What's Mandatory vs. Optional

| Mandatory for Day 1 | Optional / fill over time |
|---|---|
| Root `CLAUDE.md` with branch routing | `ds-components.md` |
| `designer-guardrails.md` (pre-filled) | `icons.md` |
| `engineering-standards.md` (pre-filled) | `platform-gotchas.md` (starts empty) |
| `tokens-*.md` | `figma-workflow.md` |
| `architecture.md` (5-line stub OK) | `optimization.md` · `ui-quick-reference.md` |

---

## Phase 1: Foundation (3-5 days, parallel tracks)

Three workstreams run in parallel. Each is owned by whoever on the team is closest to that part of the work.

### Track A: Design System Track

**Owns:** `tokens-colors.md`, `tokens-typography.md`, `tokens-spacing.md`, `ds-components.md`, `icons.md`

**Run by:** whoever is closest to the design system: a designer, a design systems lead, or a small group splitting it up.

**Output:** token names, values, when-to-use guidance, and a component catalog.

**Tips:**
- Tokens are the most-referenced doc in daily work: get these right first
- For each token, capture: name as imported, value, when to use it
- Import path is already configured: `@styleos/ds`
- `ds-components.md` can start minimal ("see Storybook for the full list") and grow over time

### Track B: Engineering Track

**Owns:** `architecture.md`, the off-limits file list, the stack mapping in `CLAUDE.md`

**Run by:** whoever is closest to the codebase: tech lead, senior engineer, or a small engineering pair.

**Stack mapping is pre-filled for react-sdk:**
- Designer territory: `pages/`, `components/`, `components-v2/`
- Engineer territory: `hooks/`, `fetchers/`, `sdk/`

Adjust these in `CLAUDE.md` if your folder structure differs.

### Track C: Joint Track

**Owns:** the root `CLAUDE.md` routing table, the branch convention (`UI/`), `git-workflow.md`

**Run by:** whoever is leading adoption: usually a design lead and a tech lead working together.

**Tips:**
- The branch prefix `UI/` is already wired into the routing logic: change it in `CLAUDE.md` if needed
- Document the convention in `git-workflow.md` so it's discoverable
- Confirm the routing table in `CLAUDE.md` references every doc you've actually filled in

---

## Phase 2: First Real Use (1 week)

Skip the contrived onboarding exercise. Whoever is doing the next piece of real work, designer or engineer, picks it up and ships it through the new workflow. Whoever owns adoption watches closely and notes every friction point.

**What to watch for:**
- Where did Claude generate wrong code? → routing gap or under-specified doc
- Where did the person get stuck? → missing context in a doc
- Where did PR review ask for changes? → rule that needs tightening or adding

Each friction point is a signal to update a doc.

---

## Phase 3: Ongoing (never ends)

The weekly tightening loop. Once a week, whoever runs adoption spends 30 minutes reviewing the week's PRs and updating the guardrails. `platform-gotchas.md` grows. By week four, the rules are project-tuned and the system is self-sustaining.

---

## Signals It's Working

- Designer PRs get merged without architectural rework: only minor visual tweaks
- Engineer PRs are small, predictable, rarely conflict with designer PRs
- New designers onboard in days, not weeks
- The `CLAUDE.md` routing table grows more often than the guardrails themselves

## Signals It's Not Working

- Designer PRs consistently rejected for architectural reasons → guardrails not tight enough
- Engineers rewriting designer-submitted code → contract not clear enough
- Claude generating wrong code in a specific area → routing broken or pointing to a stub doc

## Failure Modes to Avoid

1. **Don't skip the token docs.** Every other doc references them.
2. **Don't make off-limits too broad.** Designers need a generous open tier.
3. **Don't write rules that describe behavior.** Rules must be enforceable.
4. **Don't set this up and walk away.** Needs weekly maintenance for the first month.
5. **Don't assume one role does it all.** Three parallel tracks; match work to people.

## The One Rule of Role Assignment

Match work to whoever is closest to it on your team. The template describes work that needs to happen, not who must do it.
