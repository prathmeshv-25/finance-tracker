```markdown
# Design System Strategy: The Fluid Ledger

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Vault"**
In the Indian fintech landscape, users are often overwhelmed by cluttered interfaces and loud, aggressive notification patterns. This design system rejects the "noisy" dashboard in favor of an editorial, high-end experience. We move beyond standard SaaS templates by embracing **The Ethereal Vault**—a philosophy where security is felt through stability and calm, not through heavy borders or dark shadows. 

We break the "standard" grid by using intentional asymmetry in our layout, high-contrast typography scales for immediate information hierarchy, and a "No-Line" architecture. The result is a dashboard that feels less like a spreadsheet and more like a premium financial concierge.

---

## 2. Colors & Surface Architecture
Our palette transitions from a deep, authoritative `primary` (#24389c) to a breathy, expansive `surface` (#f7f9fb). This creates a sense of "Tonal Depth" where information feels nested rather than pasted.

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To separate a sidebar from a main feed, or a table from a header, use background shifts. 
*   **Example:** A sidebar using `surface_container_high` sitting against a main content area of `surface`. 

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
*   **Level 0 (Base):** `surface` (#f7f9fb)
*   **Level 1 (Sections):** `surface_container_low` (#f2f4f6)
*   **Level 2 (Cards/Interaction):** `surface_container_lowest` (#ffffff)
*   **Level 3 (Pop-overs/Modals):** `surface_bright` with Glassmorphism.

### The "Glass & Gradient" Rule
For primary actions and UPI transaction statuses, avoid flat fills. Use a subtle linear gradient from `primary` (#24389c) to `primary_container` (#3f51b5) at a 135° angle. For floating navigation elements, apply `backdrop-blur: 12px` to a 80% opaque `surface_container_lowest` to create a "frosted glass" effect that maintains context of the data beneath.

---

## 3. Typography
We utilize a dual-font pairing to balance authority with utility. **Manrope** (Display/Headline) provides a modern, geometric friendliness, while **Inter** (Body/Labels) ensures pixel-perfect legibility for complex financial data.

*   **Display & Headlines (Manrope):** Large, bold, and airy. Use `display-lg` (3.5rem) for total balance figures to give them an "editorial" weight.
*   **Body & Titles (Inter):** High X-height for readability. Use `title-md` (1.125rem) for transaction names.
*   **Semantic Data:** Always use `label-md` (0.75rem) with `font-weight: 600` for currency codes (e.g., ₹ INR) to ensure they are distinct from the numerical values.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** and **Ambient Light**, never through heavy 1px borders.

*   **The Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. The slight shift in hex value creates a "natural" edge.
*   **Ambient Shadows:** For "Floating" states (like a UPI QR Scanner modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06)`. Note the use of `on_surface` (#191c1e) at 6% opacity to tint the shadow naturally.
*   **The Ghost Border Fallback:** If a high-density table requires separation, use `outline_variant` (#c5c5d4) at **15% opacity**. This provides an "optical hint" of a line without breaking the fluidity of the layout.

---

## 5. Components

### Cards & Progress Bars
*   **Layout:** No borders. Use `surface_container_lowest` for the card body. 
*   **Progress:** For budget tracking, the background track should be `surface_container_highest`. The "fill" uses the `primary` gradient. 
*   **Spacing:** Use `spacing-6` (1.5rem) for internal padding to allow the data to breathe.

### UPI Transaction Tables
*   **Rule:** Forbid divider lines between rows. Use a `spacing-2` (0.5rem) vertical gap between rows, where each row is a subtle `surface_container_low` shape that turns `surface_container_highest` on hover.
*   **Currency:** Align all ₹ symbols in a dedicated column using `label-sm` and `secondary` color to keep the focus on the amount.

### Buttons
*   **Primary:** `primary` fill, white text, `rounded-lg` (0.5rem). Use a subtle inner-glow (top-down white gradient at 10%) to give it a "pressed" premium feel.
*   **Tertiary:** No background. Use `primary` text with an icon. On hover, apply a `surface_container_low` background.

### Input Fields
*   **Style:** Minimalist. No bottom line or full border. Use a `surface_container_low` background with `rounded-md`. The label should be "floating" using `label-sm` above the field.

---

## 6. Do’s and Don'ts

### Do:
*   **Use Asymmetry:** Place your primary balance card off-center or oversized to break the "standard dashboard" feel.
*   **Embrace Negative Space:** If a section feels "empty," leave it. Financial clarity comes from what is *not* there.
*   **Use Semantic Colors Sparingly:** Use `error` (#ba1a1a) only for failed transactions or critical alerts. For "Expenses," use a muted version of Red or simply `on_surface_variant`.

### Don't:
*   **Don't use 100% Black:** Never use #000000. Use `on_surface` (#191c1e) for text to maintain a soft, premium feel.
*   **Don't use Dividers:** If you feel the urge to draw a line to separate content, increase the `spacing` scale or change the `surface_container` tier instead.
*   **Don't Over-Shadow:** If more than two elements have a shadow, the layout is too heavy. Stick to Tonal Layering for 90% of the UI.

---

## 7. Contextual Utility (The Indian Market)
*   **UPI Priority:** The "Scan & Pay" or "Transfer" actions should use the Glassmorphism rule to sit "above" the dashboard, accessible via a floating action button (FAB) that utilizes the `tertiary` (#6c3400) palette for high-contrast visibility.
*   **Number Formatting:** Always use the Indian Numbering System (Lakhs/Crores) for high-value displays (e.g., ₹1,00,000 instead of ₹100,000). Use `title-lg` for these values.```