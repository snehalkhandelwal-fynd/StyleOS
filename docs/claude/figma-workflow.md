# Figma Workflow

## Where Designs Live

<!-- TODO: Link to your Figma file structure -->
<!-- Main app designs: [Figma URL] -->
<!-- Design system source of truth: [Figma URL] -->

## Design Token Sync

<!-- TODO: How do designers get tokens from Figma into code?
- Manual: designer updates tokens after design review
- Automated: Figma Tokens plugin → JSON → tokens.ts
- Style Dictionary: platform-specific outputs from a single source -->

## From Figma to Code

### For Designers Using Claude

1. Open the Figma file for the screen you're building
2. In Claude Code, describe the screen: reference the Figma frame name if helpful
3. Claude generates the screen using design system tokens and components
4. Compare the rendered output against Figma side-by-side
5. Iterate on spacing, alignment, and visual details with Claude

### For Engineers Wiring Data

Engineers don't need to open Figma. They work from the typed prop interface the designer left behind.

## Common Pitfalls

- **Pixel-perfect obsession.** Get within 1-2 pixels; don't chase exact parity at the cost of time.
- **One-off designs.** If Figma shows something not in the design system, talk to design before building a one-off component.
- **Ignoring tokens in Figma.** If the designer used a hex value instead of a token, ask which token it should be before implementing.
