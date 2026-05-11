# Architecture: style-os-app

> Stack: **react-native**. This is a starter doc: fill in the project-specific details below.

## Pattern

```
Screen (View) → State Hook (ViewModel) → Data Layer → API/SDK Client
```

Both real and mock paths unified at the data layer. Consumers don't know which they're hitting.

## Boundary

Designer side renders. Engineer side computes. The handoff is a typed prop interface.

## Global State Providers

<!-- TODO: List every global state provider, in initialization order -->
<!-- Example: DataSource → Location → Auth → Bag → Wishlist → Toast -->

## Key Patterns

<!-- TODO: Document the most common patterns in this codebase -->

| Pattern | Implementation |
|---|---|
| Add to cart | [how it works] |
| Auth flow | [your implementation] |
| Error UI | [which component] |

## Auth Flow

<!-- TODO: token storage, refresh logic, 401 handling -->

## Mock / API Toggle

<!-- TODO: if your project supports mock mode for development, document it here -->
