# Claude Rules: Style_OS

> Generated for a react-sdk project using **@styleos/ds**. The standardized starting point for designers and engineers sharing this repository.

This template encodes a portable pattern: branch-as-identity, modular routed docs, three-tier file permissions, and types-as-spec. Designers ship production UI code; engineers wire data on a parallel cadence.

## How It Works

1. **`CLAUDE.md` is a router, not a manual.** Detects the branch, lists hard stops, points to specialized docs.
2. **Branch names carry identity.** Designer branches use the configured prefix; everything else is engineering.
3. **Three-tier file permissions.** Open / Scoped / Off-Limits.
4. **Types are the spec.** The handoff between designers and engineers is a typed prop interface, not a Jira ticket.

## What's Mandatory vs. Optional

**Mandatory for Day 1**
- Root `CLAUDE.md` with branch routing
- `designer-guardrails.md` (pre-filled)
- `engineering-standards.md` (pre-filled)
- `tokens-*.md` (colors, typography, spacing)
- `architecture.md` (even a 5-line stub is enough)

**Optional / fill over time**
- `ds-components.md` (can start as "see Storybook")
- `icons.md`
- `platform-gotchas.md` (starts empty by design)
- `figma-workflow.md`
- `optimization.md`, `ui-quick-reference.md`

## To Adopt This Template

Start with [`SETUP.md`](./SETUP.md). It runs three parallel tracks across whoever on your team is closest to each part of the work: usually 3-5 days of focused effort to get to first usable state, plus ongoing weekly maintenance.
