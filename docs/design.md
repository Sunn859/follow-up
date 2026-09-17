---
name: Precision CRM & Pipeline Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  numeric-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system embodies the calculated elegance and direct efficiency of modern high-performance SaaS tools like Linear and Stripe. Engineered specifically for revenue teams, customer success managers, and contact follow-up specialists operating in high-volume environments, it rejects decorative clutter in favor of typographic clarity, structured spatial density, and frictionless micro-interactions.

The aesthetic philosophy centers on:
- **Calibrated Restraint:** White and slate surface layers define context without aggressive visual weight. Surfaces are separated by razor-thin slate dividers rather than dense dropshadows.
- **Operational Focus:** High-chroma accents are reserved strictly for actionable cues (primary triggers, overdue escalations, stage badges), directing user attention instantly toward what needs immediate intervention.
- **Bilingual Typographic Harmony:** Latin and Southeast Asian (Thai) glyphs co-exist with unified optical baselines, proportional line-heights, and matched structural weights, ensuring seamless legibility across multi-regional workspaces.

## Colors

The palette leverages high-order slate neutrals paired with a concentrated royal indigo core. Secondary and status palettes use dialed two-tone pairings (saturated foreground token on a desaturated, high-luminosity background container) to maximize scannability across dense data grids.

### Core Roles
- **Primary Core (`#4F46E5`):** Primary interactions, focused input rings, dominant button states, active navigation indicators. Active hover shifts to Deep Royal (`#4338CA`).
- **Base Canvas (`#F8FAFC`):** Global dashboard background, providing soft contrast against elevated cards and slide-over panels.
- **Surface Elevation (`#FFFFFF`):** High-surface containers, metric cards, sticky table headers, slide-overs, and popovers.
- **Dividers & Strokes (`#E2E8F0`):** Precise 1px borders providing structure without visual noise. Subtle borders use `#F1F5F9`.

### Typography Neutrals
- **Text Primary (`#0F172A`):** High-contrast lead metrics, table values, modal headings.
- **Text Secondary (`#475569`):** Field labels, table column headers, metadata, breadcrumbs.
- **Text Muted (`#94A3B8`):** Placeholder text, shortcut tags, deactivated icons.

### Operational Status Tokens (Text & Border / Surface Pill)
- **Pending / Due (รอติดตาม):** Amber Core (`#D97706`) over Warm Sun (`#FEF3C7`).
- **In Progress / Active (กำลังดำเนินการ):** Blue Core (`#2563EB`) over Soft Sky (`#DBEAFE`).
- **Completed / Closed (สำเร็จแล้ว):** Emerald Core (`#059669`) over Mint Wash (`#D1FAE5`).
- **Cancelled / Inactive (ยกเลิก/ระงับ):** Slate Core (`#475569`) over Cloud Mist (`#F1F5F9`).
- **Overdue / Urgent (ด่วน/เกินกำหนด):** Rose Core (`#DC2626`) over Blush Tint (`#FEE2E2`).

### Channel Identification Tokens
- **LINE:** Forest Jade (`#06C755`)
- **Phone:** Steel Indigo (`#4F46E5`)
- **Email:** Sky Cerulean (`#0284C7`)
- **Facebook:** Ultramarine (`#1877F2`)

## Typography

Typography prioritizes tabular clarity and structural rigor. **Inter** serves as the primary Latin engine, integrated with native OpenType features (`tnum` for tabular figures and `cv05` for clean lowercase stems). When rendering Thai text strings, use standard fallback chains targeting **Prompt** or **Kanit** to ensure uniform visual line weighting and optical height parity with Inter.

### Rules for Implementation
- **Tabular Alignment:** All pipeline deal amounts, dates, follow-up countdowns, and table records must enforce `font-feature-settings: 'tnum' 1`.
- **Label Hierarchy:** Input field labels and column headers utilize uppercase tracking or tight medium-weight rendering (`label-xs` and `label-sm`) with 60% text slate opacity for clean structural scanning.
- **Thai Typography Rhythm:** Thai characters naturally sit larger than Latin glyphs at equivalent point sizes. Keep line-height multipliers at a minimum of `1.5` for mixed-language paragraphs to prevent diacritic overlapping.

## Layout & Spacing

The layout is built around a fixed-fluid hybrid architecture optimized for desktop workflow densities (`1440px+` primary target, down to `1024px` laptop resolutions). 

### Grid & Canvas Structure
- **Sidebar Rail:** Fixed 260px left column collapsible to an 72px icon-only micro rail for space conservation.
- **Main Canvas:** Fluid viewport container bounded by `margin-lg` (2rem / 32px) padding on ultra-wide viewports and `margin` (1.5rem / 24px) on standard viewports.
- **KPI Summary Row:** Responsive 4-column dynamic grid using `gutter-lg` (24px) spacing, reflowing to a 2x2 grid on sub-1280px viewports.
- **Split View Follow-up Matrix:** Follow-up records table occupies a fluid 65% width paired alongside an optional 35% sticky profile preview drawer or sliding panel.

### Spatial Rhythm
Internal element spacing adheres strictly to an 8-point system, employing 4px micro-steps (`space-xs`) strictly for button icons, badges, and inline compact tags. Section modules enforce `space-xl` (32px) separating blocks to retain the spacious Linear-like visual calm.

## Elevation & Depth

Visual hierarchy uses crisp 1px structural outlines combined with shallow, highly-diffused ambient shadow passes. Rather than simulating dramatic physical elevation, depth distinguishes foreground interactive layers from static underlying canvases.

### Depth Hierarchy
- **Level 0 (Flat Ground):** `#F8FAFC` canvas. No shadow, no outline.
- **Level 1 (Card & Panel Surface):** `#FFFFFF` cards, metric blocks, table wrappers. Contained by a crisp 1px solid stroke (`#E2E8F0`) paired with a micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active Overlays & Dropdowns):** Action menus, filter flyouts, date pickers. `1px` border (`#E2E8F0`), elevated by `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals & Slide-Overs):** Customer follow-up detail drawer, bulk edit modals. Surrounded by a 1px border (`#E2E8F0`), supported by `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` over a backdrop blur mask (`rgba(15, 23, 42, 0.3)` with `backdrop-filter: blur(4px)`).

## Shapes

The design system employs a refined Soft geometry (`roundedness: 1`). Structural sharpness signals enterprise reliability, while subtle edge softenings prevent an overly clinical or uninviting feel.

### Corner Radius Mapping
- **Base Components (Inputs, Buttons, Badges):** `4px` (`rounded-sm` to `rounded-md`). Sharp, professional, consistent with high-density data software.
- **Containers (Cards, KPI Blocks, Table Shells):** `8px` (`rounded-lg`). Creates clean structural frames without eating into internal cell padding.
- **Modals, Slide-Overs, Large Drawers:** `12px` (`rounded-xl`) on outer edges or exposed corners.
- **Contact Badges & User Avatars:** Fully rounded pill-shapes (`9999px`) to immediately separate identity tags from transactional layout blocks.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, border `transparent`. Hover: `#4338CA`. Subtle inset top highlight `inset 0 1px 0 rgba(255, 255, 255, 0.15)`. Height: 36px (regular), 32px (compact). Padding: 12px horizontal.
- **Secondary / Outline:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover: `#F8FAFC` with border `#CBD5E1`.
- **Ghost:** Background `transparent`, text `#475569`. Hover: `#F1F5F9`, text `#0F172A`.

### Status Badges & Chips
- Status badges feature a solid 6px indicator dot, an 11px uppercase label (`label-xs`), and an edge border matching 20% opacity of the badge text.
- Dimensions: Height 22px, padding 8px horizontal, radius 4px or pill.
- **Channel Indicators (LINE, Phone, Email, FB):** Compact pill chips featuring a 12px brand-tinted channel icon alongside muted handle/phone typography with a hover copy-to-clipboard shortcut.

### Data Tables
- **Header:** Sticky, height 36px, background `#F8FAFC`, bottom border `1px solid #E2E8F0`, typography `label-xs` uppercase text in `#475569`.
- **Row:** Height 48px, background `#FFFFFF`, bottom border `1px solid #F1F5F9`. Hover state shifts full row background to `#F8FAFC`.
- **Cell Padding:** 12px vertical, 16px horizontal. Numeric cells align right with tabular figures.

### KPI Summary Cards
- White surface, `1px solid #E2E8F0`, 16px internal padding.
- Layout: Top row contains KPI category title and an icon-container badge. Middle row displays bold `display-lg` figure. Bottom row houses a trend pill (+14.2% in emerald or -3.1% in rose) paired with a contextual label (e.g., "vs last week").

### Input Fields & Search Bars
- Background `#FFFFFF`, border `1px solid #E2E8F0`, height 36px, typography `body-md`. 
- Focus state: Border transitions to `#4F46E5` accompanied by an outer glow ring `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- Global Search includes an inline keyboard accelerator badge (e.g., `⌘K`) rendered in `#94A3B8` on `#F1F5F9`.

### Tabbed Segment Controls
- Capsule container (`#F1F5F9`, 4px padding, 6px radius) housing segment items.
- Active item uses `#FFFFFF` fill, crisp 1px shadow, text `#0F172A`, and weight `500`. Inactive items use text `#64748B` with transparent background.

### Slide-over Follow-up Drawer
- Fixed-right 480px panel elevated via Level 3 depth.
- Organized into three vertical zones: Customer header with direct quick-action contact triggers (One-click LINE dial, Call log); Chronological activity feed showing timestamped follow-up milestones; Fast-entry response editor with rich-text shortcuts and due-date rescheduling.