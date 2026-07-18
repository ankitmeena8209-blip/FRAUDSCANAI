---
name: Cyber-Linear Aesthetic
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#161d1f'
  surface-container: '#1a2123'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2f3638'
  on-surface: '#dce4e6'
  on-surface-variant: '#bac9cd'
  inverse-surface: '#dce4e6'
  inverse-on-surface: '#2a3233'
  outline: '#859397'
  outline-variant: '#3b494c'
  surface-tint: '#00daf8'
  primary: '#baf2ff'
  on-primary: '#00363f'
  primary-container: '#00e0ff'
  on-primary-container: '#005f6d'
  inverse-primary: '#006877'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#e3e8ff'
  on-tertiary: '#002a78'
  tertiary-container: '#bccbff'
  on-tertiary-container: '#004cc9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a5eeff'
  primary-fixed-dim: '#00daf8'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#0d1516'
  on-background: '#dce4e6'
  surface-variant: '#2f3638'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-stakes cybersecurity environment, evoking a sense of "watchful intelligence." The brand personality is technical, futuristic, and authoritative, yet highly polished. It draws inspiration from modern developer-centric tools like Linear and Vercel, focusing on precision and clarity.

The visual style utilizes a **Dark Futuristic** aesthetic characterized by:
- **Glassmorphism:** Deep translucent layers that create a sense of verticality.
- **Aurora Gradients:** Subtle, high-chroma glows that signal activity and high-priority alerts.
- **Technical Precision:** Use of hairline borders (1px) and micro-interactions to reinforce the "scanning" nature of the product.
- **Modern Minimalism:** Heavy use of negative space to ensure complex data remains digestible.

## Colors
The palette is built upon a "Deep Space" foundation to provide maximum contrast for neon accents.

- **Primary (Electric Cyan):** Used for active states, primary actions, and "safe" status indicators.
- **Secondary (Vivid Purple):** Used for AI-driven insights and decorative aurora blurs.
- **Tertiary (Deep Blue):** Used for background structural elements and subtle UI grounding.
- **Neutral:** A range of cool grays starting from the #05070A base, moving up to #FFFFFF for high-contrast typography.

Success, warning, and error states should utilize the primary cyan for positive, amber for warning, and a high-energy crimson for detected fraud.

## Typography
This design system utilizes **Geist** for its systematic, developer-friendly aesthetic. It provides a neutral but sharp tone perfect for SaaS interfaces. For technical data, logs, and ID strings, **JetBrains Mono** is employed to maintain the "security" and "code" feel.

- **Headlines:** Should be tightly tracked (negative letter spacing) to create a sophisticated, editorial look.
- **Labels:** Monospaced fonts are used for all metadata and status badges to differentiate them from prose content.
- **Contrast:** Maintain a high contrast ratio. Body text should be slightly off-white (rgba(255,255,255,0.85)) to reduce eye strain against the pure black background.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. Navigation and sidebars are fixed, while the main dashboard area is fluid up to a maximum width of 1440px.

- **Grid:** A 12-column grid is used for dashboard layouts.
- **Spacing Scale:** A strictly linear 4px-based scale (4, 8, 12, 16, 24, 32, 48, 64).
- **Mobile Adaption:** On mobile, margins shrink to 16px and 12-column layouts reflow into a single-column stack. Heavy cards switch from horizontal layouts to vertical orientations.

## Elevation & Depth
Depth is not communicated via traditional shadows, but through **Tonal Layering** and **Illumination**:

1.  **Level 0 (Floor):** Pure #05070A. Used for the global background.
2.  **Level 1 (Cards):** Semi-transparent surface (#0C0F14 at 70% opacity) with a `backdrop-filter: blur(12px)`.
3.  **Level 2 (Popovers/Modals):** Lighter surface with a "Glowing Border" — a 1px solid border using a linear gradient of Cyan to Purple at 30% opacity.
4.  **The "Scanner" Effect:** Use an animated 1px horizontal line that periodically moves across high-elevation cards to simulate a continuous security scan.

## Shapes
The design system uses a distinctive **Hyper-Rounded** approach for structural containers, contrasted with sharp technical details.

- **Large Containers:** Dashboard cards and main sections use a generous 24px radius to create a "premium hardware" feel.
- **Interactive Elements:** Buttons and inputs use a tighter 8px radius to signify precision.
- **Micro-elements:** Checkboxes and status pips remain slightly rounded (2px) to maintain a technical, data-driven look.

## Components
### Buttons
- **Magnetic Buttons:** Primary buttons should use a subtle hover animation where the text and icon "pull" toward the cursor.
- **Style:** Primary buttons are Solid Cyan with black text. Secondary buttons are "Ghost" style with 1px glass borders.

### Premium Glass Cards
- Cards must feature `backdrop-filter: blur(20px)` and a subtle `bg-gradient` (top-left to bottom-right) from rgba(255,255,255,0.05) to transparent.

### Sophisticated Form Elements
- **Inputs:** Dark backgrounds with a 1px border that glows (Box-shadow) Cyan when focused.
- **Animated Progress Bars:** Multi-layered bars. The base is a dark track; the progress is a gradient with a "shimmer" animation moving through it.

### Additional Elements
- **Data Grids:** Use "Animated Grids" for background sections — a subtle 24px x 24px grid of dots or lines that pulse slightly in the presence of data updates.
- **Status Chips:** High-contrast capsules with a monospaced font and a "pulse" dot indicator.