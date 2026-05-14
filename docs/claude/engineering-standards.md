# Engineering Standards

> Read before implementation work involving state, hooks, ViewModels, controllers, or API integration.

## Core Principles

1. **Clarity over cleverness.** Verbose `if/else` beats nested ternary.
2. **Small, single-purpose components.** 400 lines recommended max, 600 hard limit.
3. **Separate UI, logic, and data.** Screen → State → Data Layer → API.
4. **Composition over duplication.** Extract shared patterns; don't copy-paste.
5. **Props down, events up.** Minimize shared mutable state.
6. **Co-locate by feature.**
7. **No premature abstraction.** Don't make it generic until a second consumer exists.
8. **Testability.** Pure functions, typed interfaces, separated side effects.
9. **Tokens everywhere.** Every visual value traces to the design system.
10. **When in doubt, don't touch it.**

---

## State Management Rules

### State Placement Decision Tree

```
Needed across entire app?
├── Yes → Global state (Context / Redux / Zustand / equivalent)
└── No → Fetched from API?
    ├── Yes → State hook (ViewModel)
    └── No → Multi-step form/wizard?
        ├── Yes → Reducer pattern
        └── No → Group of related fields?
            ├── Yes → Single state object
            └── No → Individual state variables
```

### Key Rules

1. Never scatter related state: use typed object, not 11 separate `useState`
2. Reducer for multi-step flows: union type actions
3. Group UI visibility state
4. Never store derived state: compute inline with memoization
5. State layer owns API state, Screen owns UI state

### State Limits Per File

| Type | Max per screen | If exceeded |
|---|---|---|
| Local state | 8 | Extract to hook or reducer |
| Refs | 5 | Evaluate necessity |
| Context consumers | 4 | Extract to custom hook |
| State hooks | 1 | Compose hooks |

---

## Data Layer Rules

### Architecture Pattern

```
Screen → State Hook → Fetcher → API Client OR Mock
```

The fetcher layer unifies real and mock paths. Consumers don't know which they're hitting.

### Controller / Repository Rules

- **SDK first**: prefer official SDKs over direct HTTP calls
- Every API call lives in the data layer, never in components
- Every real function has a matching mock for testing and development
- All endpoints declared as shared constants, never inline

### State Hook / ViewModel Rules

- Return `{state, actions}`: state is read-only, actions are methods
- All loading/error states managed inside the hook
- Computed values calculated in the hook, not in JSX
- No UI-only state in the data hook

---

## Type Rules

- **Strict mode ON**: never disable
- **No `any`**: use `unknown` + narrowing
- **No unsafe casts** except at API boundaries with explanatory comment

---

## Error Handling Tiers

| Tier | Component | When |
|---|---|---|
| Full-page | `ErrorView` | API failed, no data at all |
| Section | `SectionError` | Part of screen failed |
| Inline | Field-level text | Form validation |
| Toast | Toast component | Non-blocking |
| Silent | Log warning | Non-fatal, stale cache OK |

---

## Performance Rules

- Virtualized lists for >20 items with stable keys
- Memoize expensive derived data and render functions
- Pure components for list items and heavy views
- Stable style references (no inline object creation)

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Screen | PascalCase + `Screen` | `CartScreen.tsx` |
| Component | PascalCase | `CartProductCard.tsx` |
| Hook | camelCase + `use` | `useCartViewModel.ts` |
| Data layer | camelCase + `Controller` | `cartController.ts` |
| Mock | camelCase + `MockFetchers` | `cartMockFetchers.ts` |
| Callback prop | `on` + action | `onPress`, `onRemove` |
| Boolean prop | `is`/`has`/`show` prefix | `isLoading`, `showRating` |

---

## Code Smells: Block PR

| Smell | Why |
|---|---|
| >8 state variables in one component | Extract hook or reducer |
| API call in component/screen | Must go through data layer → state hook |
| Hardcoded visual values | Use tokens |
| `any` without comment | Use proper types |
| Business logic in JSX | Move to state hook |
| No loading/error/empty states | Broken UX |
