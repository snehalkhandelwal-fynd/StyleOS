# Icons

## How to Use Icons

```ts
<Icon name="cart" size={24} color={colors.primary} />
```

## Available Icons

### Navigation
- `back`, `close`, `menu`, `search`

### Actions
- `send`, `microphone`, `notification`

### Commerce
- `cart`, `wishlist`, `heart`, `heart-filled`, `bag`

### User
- `user`, `settings`, `logout`

### Feedback
- `check`, `error`, `warning`, `info`

### Media
- `image`, `camera`, `gallery`

## Rules

- Always use icons from this catalog: never inline SVGs in components
- Adding a new icon requires design review and SVG optimization
- Icon size should come from the spacing scale where possible
- Icons shown in the same header/action row must use the same size, stroke weight, and color unless the design explicitly defines a selected state.
- For homepage/search header actions, match `notification`, `heart`, and `user` to the profile/user icon's visual size and line weight.
