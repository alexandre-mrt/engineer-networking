# DESIGN.md — Engineer Networking Website

## Overview
A content-rich, research-driven website about networking in tech and evolving as an engineer in the AI era. The aesthetic blends editorial magazine quality with interactive data storytelling. Professional but warm, never corporate.

## Color System

### Light Mode
| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background | `--bg` | `#FAFAF9` | Page background (warm off-white) |
| Surface | `--surface` | `#FFFFFF` | Cards, elevated panels |
| Surface Muted | `--surface-muted` | `#F5F3F0` | Alternating sections, code blocks |
| Text Primary | `--text` | `#1A1A1A` | Body text, headings |
| Text Secondary | `--text-secondary` | `#6B6B6B` | Captions, metadata, secondary info |
| Text Tertiary | `--text-tertiary` | `#9B9B9B` | Placeholders, disabled |
| Border | `--border` | `#E8E5E1` | Dividers, card borders |
| Accent | `--accent` | `#2563EB` | Links, CTAs, interactive elements |
| Accent Hover | `--accent-hover` | `#1D4ED8` | Hover states |
| Accent Muted | `--accent-muted` | `#EFF6FF` | Accent backgrounds, tags |
| Success | `--success` | `#059669` | Positive data, growth indicators |
| Warning | `--warning` | `#D97706` | Caution, medium risk |
| Danger | `--danger` | `#DC2626` | Negative data, high risk |
| Highlight | `--highlight` | `#7C3AED` | Key stats, emphasis |

### Dark Mode
| Role | Token | Value |
|------|-------|-------|
| Background | `--bg` | `#0F0F0F` |
| Surface | `--surface` | `#1A1A1A` |
| Surface Muted | `--surface-muted` | `#242424` |
| Text Primary | `--text` | `#EDEDEC` |
| Text Secondary | `--text-secondary` | `#A1A1A1` |
| Text Tertiary | `--text-tertiary` | `#6B6B6B` |
| Border | `--border` | `#2A2A2A` |
| Accent | `--accent` | `#60A5FA` |
| Accent Hover | `--accent-hover` | `#93C5FD` |
| Accent Muted | `--accent-muted` | `#1E293B` |

### Data Visualization Palette
- Chart Series: `#2563EB`, `#7C3AED`, `#059669`, `#D97706`, `#DC2626`, `#EC4899`
- Background fills: 15% opacity of each series color

## Typography

### Font Stack
- **Headings (h1, h2)**: `Fraunces`, variable serif with optical sizing (editorial, distinctive)
- **Body + Sub-headings (h3)**: `Plus Jakarta Sans`, system sans-serif fallback (readable, personality)
- **Mono/Data**: `JetBrains Mono`, monospace fallback
- **Pull Quotes**: `Instrument Serif`, serif fallback (high-contrast editorial)

### Scale (fluid, clamp-based)
| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| Display | clamp(2.5rem, 5vw, 4rem) | 800 | 1.1 | -0.02em |
| H1 | clamp(2rem, 4vw, 3rem) | 700 | 1.2 | -0.015em |
| H2 | clamp(1.5rem, 3vw, 2.25rem) | 700 | 1.25 | -0.01em |
| H3 | clamp(1.25rem, 2.5vw, 1.75rem) | 600 | 1.3 | -0.005em |
| Body Large | 1.125rem | 400 | 1.7 | 0 |
| Body | 1rem | 400 | 1.7 | 0 |
| Small | 0.875rem | 400 | 1.5 | 0.01em |
| Caption | 0.75rem | 500 | 1.4 | 0.02em |

### Reading Width
- Content max-width: `65ch` (optimal readability)
- Full-width sections: data visualizations, hero, feature grids

## Spacing System
Base unit: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Section padding: 96px vertical (mobile: 64px)
- Content gap: 48px between major blocks
- Card padding: 24px (mobile: 16px)
- Inline spacing: 8-16px

## Components

### Hero Section
- Full viewport height with gradient mesh background
- Animated counter stats (46% AI code, 70% hidden jobs, etc.)
- Scroll indicator at bottom

### Navigation
- Sticky top bar with glassmorphism (backdrop-blur)
- Logo left, section links center, theme toggle + CTA right
- Mobile: hamburger menu with slide-in panel
- Reading progress bar below nav (2px accent color)

### Section Headers
- Large display text + subtitle
- Decorative accent line (gradient from accent to highlight)
- Section number as oversized faded background element

### Stat Cards
- Large number (mono font, accent color) + label + source
- Subtle border, hover lift (translateY -2px + shadow)
- Grid: 3 columns desktop, 2 tablet, 1 mobile

### Quote Blocks
- Pull quote with Playfair Display italic
- Left border accent (4px gradient)
- Attribution: name, role, source link
- Optional photo avatar

### Expandable Sections
- Click to expand/collapse
- Smooth height animation (max-height transition)
- Plus/minus icon rotation
- Used for detailed content, frameworks, templates

### Data Visualization Cards
- Chart + title + description + source
- White/dark card with subtle border
- Interactive tooltips on hover
- Responsive: simplify on mobile

### Resource Cards
- Book cover / icon + title + author + one-line description
- Category tag (Book, Podcast, Course, Tool)
- External link icon
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile

### Timeline Component
- Vertical line with nodes
- Alternating left/right content cards
- Scroll-triggered reveal animation
- Used for career evolution paths

### Skill Tree / Radar Chart
- SVG-based interactive visualization
- Hover to highlight branches
- Used for comparing skill profiles (pure coder vs full-stack human)

## Interactive Patterns

### Scroll Animations
- Fade-up on enter viewport (IntersectionObserver)
- Staggered children (50ms delay between siblings)
- Counter animations for statistics
- No animation if prefers-reduced-motion

### Dark/Light Mode
- System preference detection (prefers-color-scheme)
- Manual toggle with localStorage persistence
- Inline script in head to prevent FOUC
- CSS custom properties for all colors
- Smooth 200ms transition on toggle

### Reading Progress
- Thin bar (3px) at top of page
- Fills from left to right based on scroll position
- Accent color gradient

### Sticky Table of Contents
- Desktop: fixed left sidebar on article pages
- Active section highlighted via IntersectionObserver
- Smooth scroll to section on click
- Mobile: hidden, accessible via floating button

## Layout Patterns

### Page Structure
```
[Nav - sticky]
[Hero - full viewport]
[Section 1: The AI Shift - stats + quotes + timeline]
[Section 2: How to Network - frameworks + strategies + templates]
[Section 3: The Full-Stack Human - skills + career paths + data viz]
[Section 4: Resources - books + podcasts + tools grid]
[Footer - newsletter signup + links]
```

### Grid System
- 12-column grid, 1200px max container
- Gutters: 24px (mobile: 16px)
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

## Animations

### Timing
- Micro: 150ms (hover, focus)
- Standard: 300ms (expand, collapse, toggle)
- Emphasis: 500ms (scroll reveal, counter)
- Easing: cubic-bezier(0.16, 1, 0.3, 1) for enters, ease-out for exits

### Motion Principles
- Subtle, not flashy
- Purposeful: every animation communicates state change
- Respect prefers-reduced-motion
- No infinite loops or attention-grabbing pulses

## Do's
- Use warm off-white backgrounds, not pure white
- Keep content width at 65ch for readability
- Source every data point (inline citations)
- Use stat cards for key numbers
- Progressive disclosure for dense content (expandable sections)
- Generous whitespace between sections (96px+)
- Consistent hover states on all interactive elements

## Don'ts
- No pure black text on pure white (#1A1A1A on #FAFAF9 instead)
- No stock photography or generic illustrations
- No autoplay video or audio
- No horizontal scrolling on mobile
- No more than 3 font weights per page
- No animations without reduced-motion fallback
- No content without a source citation
