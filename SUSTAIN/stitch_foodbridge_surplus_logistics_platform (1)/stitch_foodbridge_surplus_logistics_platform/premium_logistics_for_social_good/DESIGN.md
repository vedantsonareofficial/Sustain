---
name: Premium Logistics for Social Good
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#404942'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#707971'
  outline-variant: '#c0c9c0'
  surface-tint: '#2d6a48'
  primary: '#003820'
  on-primary: '#ffffff'
  primary-container: '#0f5132'
  on-primary-container: '#84c39b'
  inverse-primary: '#95d4ac'
  secondary: '#006d36'
  on-secondary: '#ffffff'
  secondary-container: '#6dfe9c'
  on-secondary-container: '#007439'
  tertiary: '#2f312f'
  on-tertiary: '#ffffff'
  tertiary-container: '#454745'
  on-tertiary-container: '#b4b5b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f1c7'
  primary-fixed-dim: '#95d4ac'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#0f5132'
  secondary-fixed: '#6dfe9c'
  secondary-fixed-dim: '#4de082'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#e2e3e0'
  tertiary-fixed-dim: '#c6c7c4'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#454745'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Fira Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Fira Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Fira Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Fira Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 120px
---

## Brand & Style
The design system is built on a foundation of "Dignified Logistics." It moves away from the traditional aesthetic of charity and toward the high-efficiency, premium feel of top-tier delivery and tech platforms. The brand personality is hopeful, professional, and urgent, aiming to inspire confidence in both corporate donors and community partners.

The visual style is **Corporate Modern with a Tactile Edge**. It utilizes heavy whitespace, a sophisticated off-white base, and high-performance accents to create a sense of operational excellence. The emotional response should be one of "effortless impact"—positioning food rescue as a seamless, high-tech logistics solution rather than a fragmented manual effort.

## Colors
This design system uses a high-contrast palette to ensure WCAG 2.1 AA compliance. 

- **Primary Background**: The off-white (#FAFAF7) creates a "gallery" effect, allowing content to breathe and reducing eye strain compared to pure white.
- **Action Accents**: A gradient from Forest Green to Lime Green is reserved for high-priority actions, progress indicators, and "positive status" chips. 
- **Typography & Structure**: Charcoal (#1C1C1C) provides grounded, professional legibility for all body text and UI borders.
- **Functional Colors**: Use soft tints of the primary green for non-actionable background elements to maintain a cohesive brand environment without overstimulating the user.

## Typography
The typography strategy pairs **Plus Jakarta Sans** for headlines with **Fira Sans** for body and UI labels. 

- **Headlines**: Use Plus Jakarta Sans to convey a modern, friendly, and geometric confidence. Tight letter-spacing on larger sizes mimics premium editorial styles.
- **Body**: Fira Sans provides a humanist touch with excellent legibility at smaller sizes, critical for logistics data and driver instructions.
- **Rhythm**: Generous line-heights (1.6x for body) are mandatory to maintain the "clean and modern" feel and prevent data-heavy screens from feeling cluttered.

## Layout & Spacing
The design system utilizes a **Fluid Grid** with a strict 8px spacing scale. 

- **Mobile**: A 4-column grid with 20px side margins. Elements should favor vertical stacking to maximize reachability.
- **Desktop**: A 12-column grid with a maximum content width of 1440px. Use asymmetrical layouts to create visual interest in "Impact Dashboards."
- **White Space**: Prioritize "Negative Space as a Feature." Sections should be separated by at least `lg` (40px) spacing to maintain a premium, uncluttered aesthetic.

## Elevation & Depth
Depth is signaled through **Ambient Shadows** and **Tonal Layering**. 

- **Floating Cards**: Core content containers use a 12% opacity Charcoal shadow with a 24px blur and a 4px Y-offset. This creates a "lifted" effect against the #FAFAF7 background.
- **Interactions**: On hover or active states, the shadow should slightly increase in blur and spread, simulating physical elevation.
- **Sunken Surfaces**: Form inputs and search bars use a subtle 1px border (#1C1C1C at 10% opacity) rather than shadows to distinguish "interactive voids" from "elevated information."

## Shapes
The shape language is defined by significant corner rounding to evoke friendliness and safety. 

- **Standard Elements**: Buttons and input fields use a 16px radius (`rounded-lg`).
- **Containers**: Large cards and modal sheets use a 24px radius (`rounded-xl`).
- **Icons**: Use "Line-style" icons with rounded caps and joins. Motif focus: Stylized hands, organic leaf shapes, and minimalist food silhouettes. Avoid any jagged edges; every vector path should feel smooth and continuous.

## Components
- **Buttons**: Primary buttons feature the Forest-to-Lime gradient with white text. They should have a minimum height of 56px for mobile accessibility.
- **Impact Chips**: Used for showing "kg of food saved" or "meals provided." These use a light green tint (#4ADE80 at 15%) with dark forest green text.
- **Floating Cards**: The primary vessel for logistics data (pickup times, location). They must include 24px of internal padding.
- **Status Indicators**: Use soft pulses for "Live Track" features.
- **Input Fields**: Large, easy-to-tap fields with 16px internal padding and clear floating labels.
- **Imagery**: When photos are used, focus on high-quality produce, professional logistics (vans, crates), and smiling partners. Avoid "desperation" tropes; focus on the abundance being saved.