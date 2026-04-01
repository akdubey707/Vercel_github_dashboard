# Design System Documentation: The Architectural Studio

## 1. Overview & Creative North Star
**Creative North Star: "The Precise Architect"**

This design system moves beyond the generic "SaaS dashboard" aesthetic to embrace a high-end, editorial approach to project management. We are designing for developers—users who value precision, information density, and logical flow. Instead of a standard grid of boxes, we utilize **The Architectural Studio** philosophy: a layout that feels like a physical workspace. 

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. Navigation elements are often offset or grouped to create a visual rhythm, while critical project data is elevated through a sophisticated scale of display typography. The experience should feel like high-end blueprint software—authoritative, clean, and meticulously crafted.

---

## 2. Colors & Surface Philosophy

Our palette is rooted in professional slates and deep indigo-teals, but its power lies in how we apply it. 

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Within this system, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts or tonal transitions. Use `surface_container_low` for secondary sidebars sitting on a `surface` background to create separation without visual noise.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create depth:
*   **Base Layer:** `surface` (#f7f9fb)
*   **Secondary Sections:** `surface_container_low` (#f2f4f6)
*   **Active Workspaces:** `surface_container_lowest` (#ffffff)
*   **Elevated Details:** `surface_container_high` (#e6e8ea)

### The "Glass & Gradient" Rule
To elevate the developer experience from "utility" to "premium," use Glassmorphism for floating panels (e.g., Command Palettes or Popovers). Use `surface_container_lowest` at 80% opacity with a `24px` backdrop blur. 

For Primary CTAs and Hero states, apply a **Signature Texture**: a subtle linear gradient from `primary` (#000000) to `primary_container` (#131b2e). This provides a "deep space" feel that flat hex codes cannot replicate.

---

## 3. Typography

The typography strategy pairs **Manrope** (Display/Headlines) for an architectural, geometric feel with **Inter** (Body/UI) for maximum readability in code-heavy environments.

*   **The Display Scale:** Use `display-lg` (3.5rem) sparingly for project titles to create high-contrast editorial impact.
*   **The Data Scale:** `body-md` (Inter, 0.875rem) is our workhorse. It is optimized for high-density project listings.
*   **The Label Scale:** `label-sm` (0.6875rem) should be used for metadata and tags, always in uppercase with `0.05em` letter spacing to maintain a technical, "blueprint" aesthetic.

---

## 4. Elevation & Depth

### The Layering Principle
Avoid "boxed-in" designs. Depth is achieved by "stacking" surface tokens. Place a `surface_container_lowest` card on a `surface_container_low` section. This creates a soft, natural lift that mimics fine stationery.

### Ambient Shadows
When a floating effect is required (e.g., a dragging task card), use **Ambient Shadows**:
*   **Blur:** 32px to 48px
*   **Opacity:** 4% - 6%
*   **Color:** Tinted with `on_surface` (#191c1e) to ensure the shadow feels like a part of the environment, not a grey smudge.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**: `outline_variant` (#c6c6cd) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons: Precision Tools
*   **Primary:** A deep gradient of `primary` to `primary_container`. Radius: `lg` (0.5rem / 8px). Text: `label-md` (Inter, Bold).
*   **Secondary:** No background. Use `surface_container_high` on hover. This keeps the interface light.
*   **Tertiary:** Ghost style. `on_surface_variant` text that shifts to `primary` on interaction.

### Input Fields: The Editor State
Input fields should feel like code editor lines. 
*   **Base:** `surface_container_highest` background, no border.
*   **Active State:** Transition background to `surface_container_lowest` and add a 2px "Focus Bar" on the left edge using the `tertiary_container` (#0c9488) color.
*   **Rounding:** `md` (0.375rem).

### Card-Based Project Listings
Forbid divider lines. Use **Vertical White Space** (Spacing `8` or `10`) to separate items.
*   **Structure:** Use `surface_container_low` for the card body and `surface_container_lowest` for a "Header Chip" within the card to denote status.
*   **Nesting:** Place technical metadata (e.g., repo links, commit IDs) in `surface_container_highest` containers within the card to differentiate data types.

### Specialized Component: The "Threaded" Activity Feed
Instead of a list, use a vertical line (the `outline_variant` at 20% opacity) that connects activity nodes, mimicking a Git branch or a logical flow, reinforcing the developer-centric nature of the system.

---

## 6. Do's and Don'ts

### Do
*   **Use Asymmetric Margins:** Give your "Project Title" more room on the top than the bottom to create a modern, intentional feel.
*   **Embrace the Spacing Scale:** Stick strictly to the defined scale (e.g., use `12` for section gaps, `4` for component internals).
*   **Tonal Context:** Use `on_tertiary_container` (Teal) for success states—it’s more sophisticated than a standard "Green."

### Don't
*   **Don't use 100% Black:** Even for text, use `on_surface` (#191c1e). It reduces eye strain and feels more premium.
*   **Don't use Shadows on everything:** Let background color shifts do 90% of the work. Reserve shadows only for elements that truly "float" (modals, dropdowns).
*   **Don't crowd the UI:** Developers need "focus air." If a screen feels busy, increase the spacing from `8` to `12` rather than adding a border.