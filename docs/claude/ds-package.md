# `@styleos/ds` — Package Guide

> Read this before adding, editing, or removing anything inside `packages/ds/`. For *consumption* (which components/tokens exist), see [`ds-components.md`](ds-components.md), [`tokens-colors.md`](tokens-colors.md), [`tokens-typography.md`](tokens-typography.md), [`tokens-spacing.md`](tokens-spacing.md), [`icons.md`](icons.md).

## Where it lives

```
packages/ds/
├── package.json              # name: @styleos/ds, peerDeps: react, react-native, react-native-svg
├── tsconfig.json
└── src/
    ├── index.ts              # barrel — re-exports tokens + components
    ├── tokens/
    │   ├── colors.ts
    │   ├── spacing.ts        # spacing + radii
    │   ├── typography.ts     # typography + fontFamilies
    │   └── index.ts
    └── components/
        ├── Icon.tsx
        ├── Button.tsx
        ├── InputField.tsx
        ├── Card.tsx
        ├── Badge.tsx
        ├── IconButton.tsx
        └── index.ts
```

The root [`package.json`](../../package.json) declares yarn workspaces. App code (when it lands under `apps/*`) will resolve `@styleos/ds` to this folder automatically — no publishing required.

## Public API contract

Anything re-exported from [`packages/ds/src/index.ts`](../../packages/ds/src/index.ts) is the package's **public API**. Treat it like a versioned contract:

- **Add** new tokens / components / variants freely — additive changes are safe.
- **Rename or remove** an export only with a deliberate migration. App code may depend on the old name.
- **Change a token value** (e.g. `colors.ink` from `#111111` → `#000000`) only with design review — the value flows through every screen.

## How to extend

### Add a token

1. Add the entry to the relevant `src/tokens/<file>.ts` (`as const` literal — do not introduce a `string`-typed entry).
2. Re-export through `src/tokens/index.ts` if a new symbol was introduced.
3. Update the matching consumer doc (`tokens-colors.md` / `tokens-typography.md` / `tokens-spacing.md`) so the catalog stays in sync.

### Add a component

1. New file under `src/components/<Name>.tsx`.
2. Component takes **props, not context**. No reads from app state, navigation, or theme providers.
3. Style with tokens only — never inline hex / numeric spacing.
4. Variants live in a string-literal union prop, never branched on raw strings.
5. Re-export from `src/components/index.ts`.
6. Add it to [`ds-components.md`](ds-components.md) with prop table + variants table.

### Add an icon

1. Add the name to the `IconName` union in [`packages/ds/src/components/Icon.tsx`](../../packages/ds/src/components/Icon.tsx).
2. Add it to the catalog in [`icons.md`](icons.md) under the correct category.
3. Wire the actual SVG path when SVG assets land (current `Icon.tsx` renders a placeholder square — the prop contract is real, the visual is a stub).

## Dependencies

`@styleos/ds` may depend on:

- `react`, `react-native` (peer)
- `react-native-svg` (peer — for the eventual real Icon impl)

It must **not** depend on:

- HTTP clients, SDK clients, auth, navigation
- Anything under `apps/*` or `src/features/*`
- Any project state stores

The DS is a leaf — apps depend on it, it depends on nothing of ours.

## Hard rules

- **No `any`.** Use `unknown` + narrowing or define a proper interface.
- **No inline hex / raw spacing.** If a value isn't a token yet, add the token first.
- **No business logic.** Components render; they do not fetch, validate, or persist.
- **No story-only mocks in the component file.** Put mocks in `*.stories.*` once Storybook lands.

## Stub status (as of 0.1.0)

- `Icon` renders a square placeholder. The full SVG implementation lands when design ships the icon set + `react-native-svg` is installed in the consuming app.
- No Storybook yet. Stories go under `packages/ds/src/components/*.stories.tsx` once configured.
- No tests yet. Visual regression + prop-contract tests land alongside Storybook.
