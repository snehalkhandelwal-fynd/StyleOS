# CLAUDE.md

This is the StyleOS React Native app.

Before implementing onboarding, avatar setup, location, homepage, or bottom navigation, always read:

- docs/claude/styleos-onboarding-homepage.md

Follow that file as the source of truth for UI, navigation, screen order, React Native structure, validation, and homepage sections.

> Router for style-os-app. Detects context, lists hard stops, points to specialized docs. Keep this file short. Complexity lives in `docs/claude/`, loaded on demand.

## Branch-Based Context

Detect the current git branch before every task.

- **Branch starts with `UI/`**: Designer branch. Read `docs/claude/designer-guardrails.md` before any task. UI-only.
- **Any other branch**: Full engineering access. Read `docs/claude/engineering-standards.md` before implementation work.

> If branch detection fails, ask: "Which branch are you on?" before writing code.

---

## Hard Stops: All Branches, All Roles

Before writing ANY code, check these. If any is true, **STOP**.

| About to… | Do this instead |
|---|---|
| Hardcode a color, font, or spacing value | Use a token from `@yourorg/ds`. If none exists, add one first. |
| Skip loading, error, or empty state | All three are mandatory |
| Component with >12 flat props | Group into typed objects or split |
| File >600 lines | Split or extract hooks |
| Add a dependency | Check bundle/binary size first |
| Mock data in production screen | Mocks belong in stories or dedicated mock files only |
| Use `any` type | Use `unknown` + narrowing or define a proper interface |

---

## Architecture: The Sacred Boundary

**Stack: react-native**

### Designer territory
- `src/features/*/screens/`
- `src/features/*/components/`

### Engineer territory
- `src/features/*/viewModels/`
- `src/features/*/controllers/`
- `src/services/`
- `src/core/`

### Off-limits (universal: applies regardless of stack)
- Any file importing HTTP clients (axios, fetch, SDK clients)
- Auth, session, and token management
- Native platform directories
- Build configs (package.json, build.gradle, pubspec.yaml, etc.)
- CI/CD configs and environment files

**The contract:** Engineer side provides `{data, isLoading, error, callbacks}`. UI renders them.

---

## Three-Tier File Permissions

### Open: edit freely
- `src/features/*/screens/`
- `src/features/*/components/`
- `*.stories.*`: always safe

### Scoped: specific edits only
- Navigation config: only add new screen entries
- Type definitions: only add new screen params, never modify existing
- Design system tokens: add new, never rename or delete

### Off-Limits: hard-blocked on `UI/` branches
- Any file importing HTTP clients or SDK clients
- Auth / session / token management
- Native platform directories
- Build configs
- CI/CD and env files

---

## Routing Table: MUST Read Before Working

| Task | MUST read first |
|---|---|
| Any task on a `UI/` branch | `docs/claude/designer-guardrails.md` |
| State management, hooks, ViewModels | `docs/claude/engineering-standards.md` |
| Data fetching, API integration | `docs/claude/engineering-standards.md` |
| Color values | `docs/claude/tokens-colors.md` |
| Typography values | `docs/claude/tokens-typography.md` |
| Spacing values | `docs/claude/tokens-spacing.md` |
| Creating or modifying styles | `docs/claude/ui-quick-reference.md` |
| Which design system components exist | `docs/claude/ds-components.md` |
| Icon names | `docs/claude/icons.md` |
| Layout bugs, platform crashes | `docs/claude/platform-gotchas.md` |
| Git branching, PRs | `docs/claude/git-workflow.md` |
| Image budgets, dependencies | `docs/claude/optimization.md` |
| Architecture overview | `docs/claude/architecture.md` |
| StyleOS onboarding, homepage, or bottom navigation | `docs/claude/styleos-onboarding-homepage.md` |

---

## Communication Style

Designers on `UI/` branches are not developers. Explain technical concepts in plain English, use analogies, break down CLI commands. Engineers on other branches can handle technical language directly.
