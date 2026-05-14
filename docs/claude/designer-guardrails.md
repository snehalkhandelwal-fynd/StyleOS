# Designer Guardrails

> Auto-referenced when the current branch starts with `UI/`.
> You are assisting a designer who vibe-codes UI. Your scope is strictly visual.

## Your Scope

**You do:**
- Layouts, spacing, visual hierarchy
- Components and variants
- Screen structure and visual flows
- Navigate between existing screens
- Display data already provided via props or existing hooks

**You never:**
- Add API calls or data-fetching logic
- Modify business rules, calculations, or state machines
- Import from engineer territory (see `CLAUDE.md` stack mapping)
- Add new hook calls that don't already exist in the file
- Add new context imports for auth, session, cart, etc.

> **Default:** If unsure whether something is engineering → it IS engineering → don't touch it → leave a clean prop seam.

---

## How to Leave Clean Seams for Engineers

When the screen needs data the state layer doesn't yet provide, define the prop interface clearly and use mock data:

```ts
interface DeliveryInfoProps {
  deliveryEstimate: { date: string; isFree: boolean };
  onPincodeChange: (pincode: string) => void;
}
```

The engineer will see the prop types and know exactly what to wire up. **Do NOT add `// TODO (engineer):` comments**: they accumulate across branches and become noise. Well-typed props and mock data are the contract.

---

## The Nine Rules

### Rule 1: Screens Are Thin Shells (~50–100 lines)

A screen calls a state hook, destructures the result, and renders components. No logic.

```ts
export const CartScreen = () => {
  const vm = useCartViewModel();

  if (vm.isLoading) return <LoadingView />;
  if (vm.error) return <ErrorView error={vm.error} onRetry={vm.refresh} />;

  return (
    <Container>
      <Header title="My Bag" />
      <CartItemList items={vm.items} onRemove={vm.removeItem} />
      <CartFooter total={vm.total} onCheckout={vm.checkout} />
    </Container>
  );
};
```

### Rule 2: Components Take Props, Not Context

```ts
// ✅ All data via props
const PriceRow = ({ mrp, sellingPrice, discount }: PriceRowProps) => (...)

// ❌ Component fetches its own context
const PriceRow = () => {
  const { prices } = useCartContext();
}
```

### Rule 3: Every Component Prop Contract Is Documented

Components with >3 props must have a TSDoc comment explaining the data contract.

### Rule 4: Mock Data Lives in Stories, Not Screens

Mocks belong in `.stories.tsx` (or your project's equivalent). Never in a production screen.

### Rule 5: Every Optional Section Is a Boolean Prop

```ts
interface ProductCardProps {
  showCashback?: boolean;
  cashbackText?: string;
  showEmi?: boolean;
  emiText?: string;
}
```

### Rule 6: Loading / Error / Empty: Every Data-Driven View

```ts
if (isLoading) return <LoadingView />;
if (error) return <ErrorView error={error} onRetry={onRetry} />;
if (!data || data.length === 0) return <EmptyView message="..." />;
return <ActualContent data={data} />;
```

### Rule 7: Dynamic Content Rules

| Always a prop (never hardcode) | Can be hardcoded |
|---|---|
| Prices, amounts, counts | Static labels ("Cancel", "Apply") |
| Offer/promo/marketing copy | Empty state messages |
| Thresholds & limits | Component-internal UX labels |
| Product/brand names | Icon names tied to a fixed purpose |

### Rule 8: Safe Signal Check

Before editing any component file, check its imports:
- Imports from engineer territory → **read-only**, not a pure UI component
- Only imports from `@styleos/ds`, framework primitives, or sibling components → **safe to edit**

### Rule 9: Forms Use One State Object, Not Many

```ts
const [form, setForm] = useState({
  name: '', phone: '', pincode: '', city: '',
});
const update = (field, value) => setForm(prev => ({...prev, [field]: value}));
```

---

## PR Checklist for `UI/` Branches

- [ ] On a `UI/feature-…` branch (not main/develop)
- [ ] Only edited: screen JSX, presentational components, styles, stories
- [ ] Did NOT change: state management files, data-fetching files, services
- [ ] Did NOT change: config, core utilities, theme internals
- [ ] Did NOT change: `package.json`, build configs, env files
- [ ] Did NOT add: new API calls, hook calls, or context imports
- [ ] Props and interfaces are well-typed
- [ ] Loading/error/empty states exist for every data-driven view

---

## Communication Reminder

You are talking to a designer, not a developer. When explaining anything:
- Plain English, no jargon without explanation
- Break CLI commands into what each word means
- Use analogies ("stash = putting aside in a drawer")
- Use ASCII diagrams for flows
