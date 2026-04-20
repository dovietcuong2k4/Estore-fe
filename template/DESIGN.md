# Design System Documentation: The Kinetic Vault

## 1. Overview & Creative North Star: "The Kinetic Vault"
This design system moves away from the traditional, cluttered e-commerce grid. Our Creative North Star is **The Kinetic Vault**—an immersive, high-end digital environment where premium electronics aren't just listed; they are curated like artifacts in a high-tech gallery.

The aesthetic is defined by "Editorial Dark Mode." We achieve this through deep tonal depth, intentional asymmetry, and high-contrast typography. Unlike standard "out-of-the-box" templates, this system relies on overlapping elements and varying surface heights to create a sense of physical space and momentum. We don't use lines to separate ideas; we use light, shadow, and atmospheric shifts.

## 2. Colors & Surface Logic
The palette is rooted in the deep void of space, utilizing a sophisticated range of charcoals and cyans to create a sense of premium precision.

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or containers. High-end design feels "molded," not "boxed." Boundaries must be defined solely through background color shifts. For example, a featured product section in `surface-container-low` sits directly against the `background` without a dividing line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked layers.
*   **Base:** The `background` (`#060e20`) is your canvas.
*   **Sections:** Use `surface-container-low` or `surface-container-high` to block out large content areas.
*   **Elements:** Cards and floating modules should use `surface-container-highest` to "pop" toward the user.
*   **Nesting:** A `surface-container-lowest` card placed inside a `surface-container-high` section creates a "carved out" look, suggesting a sophisticated inset detail common in luxury hardware design.

### The "Glass & Gradient" Rule
To elevate the experience from "dark theme" to "luxury tech," use Glassmorphism for floating navigation and overlay cards. 
*   **Floating Elements:** Apply `surface` color at 60% opacity with a `20px` to `40px` backdrop-blur. 
*   **Signature Textures:** Use a linear gradient transitioning from `primary` (`#8ff5ff`) to `primary-container` (`#00eefc`) at a 135-degree angle for hero CTAs. This creates a "glow" effect rather than a flat fill.

## 3. Typography
We utilize a dual-typeface strategy to balance high-tech precision with editorial authority.

*   **Display & Headline (Space Grotesk):** This is our "Editorial" voice. Use `display-lg` and `headline-lg` for product titles and promotional headers. The geometric, slightly futuristic nature of Space Grotesk conveys innovation.
*   **Body & Title (Inter):** For functional data, product specs, and descriptions, Inter provides maximum legibility. 
*   **Hierarchy Note:** Use `secondary` (`#ac8aff`) for sub-headlines or "New Arrival" labels to pull the eye through the layout asynchronously.

## 4. Elevation & Depth
In a dark interface, traditional black shadows are invisible. We use Tonal Layering and Light Leaks.

### The Layering Principle
Depth is achieved by stacking surface tokens. A `surface-container-highest` element should feel "closer" to the user than a `surface-dim` background.

### Ambient Shadows
When a floating effect is required (e.g., a hovered product card), use an extra-diffused shadow (blur: 32px, spread: -4px) with the color `on-surface` at 5% opacity. This mimics a soft atmospheric glow rather than a harsh drop shadow.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., an input field), use the "Ghost Border" technique: the `outline-variant` token at 15% opacity. It should be felt, not seen.

## 5. Components

### Buttons
*   **Primary:** A gradient-fill using `primary` to `primary-container`. Text should be `on-primary` (dark) for maximum punch. Corner radius: `full`.
*   **Secondary:** No fill. A Ghost Border using `primary` at 20% opacity. On hover, transition to a 10% `primary` surface tint.
*   **Tertiary:** Text-only in `secondary` (`#ac8aff`) with a `label-md` weight.

### Product Cards
*   **Structure:** No borders. Use `surface-container-lowest` for the image container and `surface-container-low` for the card body. 
*   **Asymmetry:** Offset the product image so it breaks the top or side boundary of the card container, creating a 3D "layered" effect.
*   **Typography:** Product name in `title-md`, price in `primary` (`#8ff5ff`) using `headline-sm`.

### Promotional Banners
*   **The "Editorial" Layout:** Avoid centered text. Use left-aligned `display-md` typography that overlaps a high-quality, desaturated product render. 
*   **Depth:** Apply a `tertiary-container` subtle radial gradient behind the product to create a "halo" effect, pulling it out of the dark background.

### Navigation Bar
*   **Style:** Fixed at the top. Use Glassmorphism (60% `surface` + backdrop-blur). 
*   **Separation:** Instead of a bottom border, use a subtle 10% opacity `primary` glow at the very bottom edge of the nav bar.

### Input Fields
*   **Base:** `surface-container-highest`.
*   **State:** When focused, transition the Ghost Border to 100% `primary` opacity and add a subtle `primary_dim` outer glow.

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace negative space. High-end products need "room to breathe."
*   **Do** use `secondary` (`#ac8aff`) for micro-interactions, like notification pings or "In Stock" indicators.
*   **Do** use the `xl` (`0.75rem`) roundedness for large containers and `sm` (`0.125rem`) for small technical labels to create a hierarchy of "softness."

### Don’t:
*   **Don’t** use 100% white (#FFFFFF). Always use `on-surface` (`#dee5ff`) to avoid eye strain and maintain the deep-blue atmospheric tint.
*   **Don’t** use standard divider lines between list items. Use 16px or 24px of vertical space or a subtle shift from `surface` to `surface-container-low`.
*   **Don’t** use high-saturation reds for errors. Use `error_dim` (`#d7383b`) to ensure it fits the sophisticated palette without feeling jarring.