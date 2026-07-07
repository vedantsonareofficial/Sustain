---
name: Lumina Logistics
colors:
  surface: '#0c1511'
  surface-dim: '#0c1511'
  surface-bright: '#323b36'
  surface-container-lowest: '#07100c'
  surface-container-low: '#141d19'
  surface-container: '#18221d'
  surface-container-high: '#232c27'
  surface-container-highest: '#2d3732'
  on-surface: '#dbe5dd'
  on-surface-variant: '#bccabb'
  inverse-surface: '#dbe5dd'
  inverse-on-surface: '#29322d'
  outline: '#869486'
  outline-variant: '#3d4a3e'
  surface-tint: '#4de082'
  primary: '#6bfb9a'
  on-primary: '#003919'
  primary-container: '#4ade80'
  on-primary-container: '#005e2d'
  inverse-primary: '#006d36'
  secondary: '#aecebe'
  on-secondary: '#1a362b'
  secondary-container: '#334f43'
  on-secondary-container: '#a0bfb0'
  tertiary: '#c7e8d5'
  on-tertiary: '#193629'
  tertiary-container: '#abccba'
  on-tertiary-container: '#3a5749'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6dfe9c'
  primary-fixed-dim: '#4de082'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#caeada'
  secondary-fixed-dim: '#aecebe'
  on-secondary-fixed: '#032017'
  on-secondary-fixed-variant: '#304c41'
  tertiary-fixed: '#c9ead7'
  tertiary-fixed-dim: '#adcebc'
  on-tertiary-fixed: '#022015'
  on-tertiary-fixed-variant: '#2f4d3f'
  background: '#0c1511'
  on-background: '#dbe5dd'
  surface-variant: '#2d3732'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system embodies a premium, purpose-driven ethos for high-end logistics focused on social impact. The brand personality is "Sophisticated Stewardship"—combining the technical precision of global logistics with the organic warmth of humanitarian work. 

The visual style is **Modern Corporate** with a heavy emphasis on **Glassmorphism** and **Tonal Layering**. By utilizing a dark, deep-forest base, the interface evokes a sense of vast, quiet efficiency. High-contrast primary accents act as beacons of action, guiding the user through complex data with clarity and urgency. The emotional response is one of calm confidence, reliability, and modern luxury.

## Colors

The palette transitions from a near-black "Night" base to a "Deep Forest" container system. 

- **Primary Green (#4ADE80):** Reserved for critical actions, status indicators, and brand touchpoints. It provides a vibrant, luminous contrast against the dark background.
- **Surface Architecture:** The background uses the darkest shade (#050D09) to maximize depth. Interactive containers use slightly lighter forest greens to establish hierarchy without sacrificing the dark-mode aesthetic.
- **Accessibility:** All text roles are mapped to ensure a minimum 4.5:1 contrast ratio. "On-surface" uses a tinted white to reduce eye strain while maintaining crisp legibility.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a contemporary, welcoming, yet professional tone.

- **Headlines:** Use tighter letter-spacing and bolder weights to create a strong visual anchor against the dark UI. 
- **Body Text:** Line heights are generous (1.5x - 1.6x) to ensure long-form logistical data remains readable in low-light environments.
- **Labels:** Uppercase styles should be used sparingly for "label-sm" to denote secondary metadata or category tags.
- **Scale:** Headlines scale down for mobile devices to ensure that impact is maintained without causing excessive horizontal scrolling or awkward line breaks.

## Layout & Spacing

The layout is built on an **8px grid system**, ensuring mathematical harmony across all components.

- **Grid Strategy:** A 12-column fluid grid for desktop with 24px gutters. On mobile, this collapses to a 4-column grid with 16px margins.
- **Rhythm:** Vertical spacing (stacking) follows the 8px increment. Use `stack-md` (16px) for related elements within a card and `stack-lg` (32px) to separate distinct sections of a page.
- **Safe Areas:** All content must respect a minimum edge margin of 16px on mobile to prevent "visual crowding" against the bezel.

## Elevation & Depth

Depth in this system is communicated through **Tonal Layers** and **Subtle Glassmorphism** rather than traditional heavy shadows.

- **Tiered Surfaces:** Lower elevation levels use the darker `#050D09`, while higher elevation components (like floating cards or menus) use `#11241B` or `#193126`.
- **Glass Effects:** Modal overlays and navigation bars should utilize a 12px backdrop-blur with a 10% opacity white border to simulate premium glass.
- **Shadows:** Where used, shadows must be "Ambient Shadows"—diffused, using a dark green tint (#000000 at 40% opacity with a slight green cast) to ensure they feel integrated into the forest palette.

## Shapes

The shape language is defined by a **"Rounded-Eight"** philosophy. 

All standard components (Buttons, Inputs, Cards) utilize a base radius of 8px (`rounded-md` in most frameworks). This provides a balance between the precision of a professional tool and the approachability of a social-good brand. 

- **Small elements (Checkboxes):** 4px radius.
- **Large containers (Sections):** 16px or 24px radius to create a distinct enclosure.

## Components

- **Buttons:** Primary buttons use the `#4ADE80` background with `#00391C` text. Ghost buttons use the `outline` token with a subtle hover transition that increases the background opacity to 10%.
- **Cards:** Cards should not have borders; instead, use the `surface-container` background to differentiate from the base `surface`.
- **Input Fields:** Use a solid `surface-container-high` background with a bottom-only 2px border or a full subtle `outline` (#3D5248). The active state highlights the border in Primary Green.
- **Chips/Badges:** Use "Low-Contrast Outlines." A chip for a "Delivered" status would have a light green stroke and very dark green background, keeping the vibrant Primary Green for the text only.
- **Lists:** Use subtle dividers using the `outline` token at 50% opacity to maintain a clean, "borderless" appearance.
- **Progress Indicators:** High-visibility Primary Green bars against a `surface-container-high` track to emphasize momentum and impact.