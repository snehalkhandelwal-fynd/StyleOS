# Optimization

> Budgets and limits. Tighten these based on your project's performance requirements.

## Image Budget

| Image Type | Max Width | Max File Size |
|---|---|---|
| Tab icons | 132px | 10 KB |
| Store cards / banners | 750px | 150 KB |
| Category tiles | 564px | 200 KB |
| Hero banners | 750px | 200 KB |

**Before committing any image:**
```bash
# Check dimensions
sips -g pixelWidth -g pixelHeight <file>   # macOS
identify <file>                             # ImageMagick

# Check file size
ls -lh <file>
```

**Never commit images > 500 KB without approval.**

## Font Management

- 3 weights maximum per family across the project
- Never add a new font family without design approval.
- Stylus uses Outfit for all text. Do not use system fonts for body text.

## Dependency Hygiene

Before adding any dependency, check its bundle/binary size impact.

### Known-bad dependencies (avoid without strong justification)

- `moment.js`: deprecated, ~70KB; use `date-fns` or `dayjs` instead
- Full `lodash`: import specific functions or use `lodash-es`


## Performance Checklist

- [ ] Images have budget-compliant dimensions and file sizes
- [ ] No new font families or weights added beyond approved Outfit weights
- [ ] No dependencies added without bundle-size check
- [ ] Heavy components memoized appropriately
- [ ] Lists virtualized if >20 items
