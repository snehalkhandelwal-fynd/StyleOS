# Git Workflow

## Branch Structure

```
main
 └── develop
      ├── UI/develop-ui             : designer integration branch
      │    └── UI/feature-*         : designer feature branches
      └── feature/*                             : engineering feature branches
      └── fix/*                                 : bug fix branches
```

## Branch Naming

| Branch Pattern | Who Creates It | Purpose |
|---|---|---|
| `UI/feature-<name>` | Designers | Any UI-only work |
| `UI/develop-ui` | Design lead | Integration branch for designer PRs |
| `feature/<name>` | Engineers | Engineering feature work |
| `fix/<name>` | Any | Bug fixes |
| `develop` | n/a | Integration branch |
| `main` | n/a | Protected, production |

## The `UI/` Prefix Convention

**This is the single most important convention.** Claude detects the `UI/` prefix and automatically applies designer guardrails. Without the prefix, Claude assumes full engineering access.

## PR Flow

### Designer PR Flow

1. Branch off `UI/develop-ui`
2. Work with Claude Code on UI only
3. Open PR against `UI/develop-ui`
4. Reviewed by design lead + an engineer
5. Merge to `UI/develop-ui`
6. `UI/develop-ui` merges to `develop` on a regular cadence

### Engineering PR Flow

1. Branch off `develop`
2. Work with Claude Code: full engineering access
3. Open PR against `develop`
4. Reviewed by another engineer
5. Merge to `develop`

### Release Flow

`develop` → `main` on a release cadence.

## PR Checklist Templates

See `designer-guardrails.md` for the designer PR checklist. Engineering PRs should include:

- [ ] Types are strict (no `any` without justification)
- [ ] Data layer functions have matching mocks
- [ ] Error states handled at appropriate tier
- [ ] No business logic in UI components
- [ ] Unit tests for non-trivial logic
