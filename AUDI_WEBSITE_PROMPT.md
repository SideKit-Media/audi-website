# AUDI MOTORSPORT — SCROLLYTELLING WEBSITE
### Engineering Specification | Claude Code Build Document
### Project: `audi-website` | Next.js 14+ | TypeScript | Tailwind v4 | Framer Motion

---

## ENGINEER CONTEXT

You are a Senior Creative Frontend Engineer with expertise in:
- Scroll-driven canvas animation (Apple-style image sequences)
- High-performance React rendering patterns
- Automotive brand design systems
- Awwwards-level UI/UX

You write production-grade TypeScript with zero errors, zero hydration mismatches, and zero performance regressions. Every decision is intentional. Every line is purposeful.

---

## PROJECT OBJECTIVE

Build a complete, single-page **Audi Motorsport showcase website**.

The centerpiece is a **scroll-controlled image sequence** — 243 JPG frames rendered onto an HTML5 Canvas that play like a cinematic video as the user scrolls. This is the same technique used on Apple product pages.

After the sequence completes, the page continues naturally with specs, features, and footer sections.

**Aesthetic:** Cold German Precision x Motorsport Aggression.
Pit lane telemetry — not Monaco showroom.

---

## ASSET SPECIFICATION

```
Frames location : C:\Users\yashv\audi-website\public\images\audi-sequence\
Public URL base : /images/audi-sequence/
Total frames    : 243
Filename format : ezgif-frame-001.jpg to ezgif-frame-243.jpg
Padding rule    : (i + 1).toString().padStart(3, '0')
Example URL     : /images/audi-sequence/ezgif-frame-001.jpg
```

**NEVER use any other path or filename format. Always pad to 3 digits.**

---

## TECH STACK

```
Framework   : Next.js 14+ (App Router, TypeScript strict mode)
Styling     : Tailwind CSS v4 (@theme variables only — no hardcoded colors in JSX)
Animation   : Framer Motion v11+
Canvas      : HTML5 Canvas API (no third-party canvas libraries)
Fonts       : Google Fonts via next/font/google (never CDN links)
```

**Install command (run first):**
```bash
npm install framer-motion clsx tailwind-merge
```

---

## DESIGN SYSTEM

### Color Palette
Derived from Audi e-tron GT Race livery (white/black/red) and Audi F1 concept (gunmetal/gloss black/signal red).

```
audi-black     : #0D0D0D   Primary bg, canvas void
audi-carbon    : #1A1A1A   Card surfaces, borders
audi-dark      : #111111   Post-sequence section bg
audi-red       : #BB0A21   Primary accent — max 2 visible per phase
audi-red-hot   : #E8001A   Hover states only
audi-silver    : #C8C8C8   Data labels, secondary text
audi-aluminium : #8A8A8A   Tertiary text, muted borders
audi-white     : #F5F5F5   Primary text, hero headings
```

### Typography
```
Saira Condensed  — Display, headings, large numbers (weights: 400, 600, 700, 900)
DM Mono          — Specs, labels, telemetry readouts, nav (weights: 300, 400, 500)
Barlow           — Body copy, feature descriptions (weights: 400, 500)
```

### Design Rules (ABSOLUTE — never violate)
1. border-radius: 0 globally — sharp corners on every element without exception
2. 1px borders only — never 2px+ except the 2px spec card top accent
3. Red is a weapon — maximum 2 red elements visible at any time per scroll phase
4. Numbers are telemetry — format: large value (Saira Condensed 900) + small unit (DM Mono, red)
5. No purple, blue, or soft gradients — ever
6. No Inter, Roboto, or system fonts — ever
7. Noise texture on body at 3% opacity — always
8. Custom scrollbar: 3px wide, track #1A1A1A, thumb #BB0A21
9. Text selection: background #BB0A21, color #FFFFFF

---

## ARCHITECTURE — MASTER SCROLL SYSTEM

```
CRITICAL RULE: useScroll is called ONCE in app/page.tsx.
The scrollYProgress MotionValue is passed as a PROP to all children.
No child component ever calls useScroll independently.
Violation of this rule causes scroll desync bugs.
```

```
app/page.tsx
├── useScroll (single source of truth)
├── <Navbar />                    (uses window scroll internally — no prop)
├── <section ref={containerRef}>  (h-[730vh] — locks scroll for full animation)
│   └── sticky div h-screen
│       ├── <AudiCanvas scrollYProgress />   (z-index: 0 — canvas layer)
│       └── <AudiHUD scrollYProgress />      (z-index: 10 — HUD overlay)
└── post-sequence div
    ├── <SpecsGrid />
    ├── <RacingDNA />
    └── <Footer />
```

Why 730vh?
243 frames x ~3vh per frame = ~729vh approx 730vh
This gives each frame approximately 3vh of scroll travel, resulting in smooth cinematic motion.

---

## FILE GENERATION ORDER

Generate files in EXACTLY this sequence. Confirm each compiles before proceeding.

```
01. app/layout.tsx
02. app/globals.css
03. data/carData.ts
04. components/Navbar.tsx
05. components/LoadingScreen.tsx
06. components/AudiCanvas.tsx       CRITICAL: Canvas + DPR fix + frame naming
07. components/AudiHUD.tsx          CRITICAL: 3 scroll phases, prop-based only
08. components/SpecsGrid.tsx
09. components/RacingDNA.tsx
10. components/Footer.tsx
11. app/page.tsx                    LAST: orchestrates everything
```

---

## FILE 01 — app/layout.tsx

```tsx
import type { Metadata } from 'next'
import { Saira_Condensed, DM_Mono, Barlow } from 'next/font/google'
import './globals.css'

const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-saira',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Audi Sport | e-tron GT Race — Quattro Motorsport',
  description: 'FIA GT3 homologated. 630 PS. Quattro AWD. Where electric meets motorsport.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sairaCondensed.variable} ${dmMono.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## FILE 02 — app/globals.css

```css
@import "tailwindcss";

@theme {
  --color-audi-black     : #0D0D0D;
  --color-audi-carbon    : #1A1A1A;
  --color-audi-dark      : #111111;
  --color-audi-red       : #BB0A21;
  --color-audi-red-hot   : #E8001A;
  --color-audi-silver    : #C8C8C8;
  --color-audi-aluminium : #8A8A8A;
  --color-audi-white     : #F5F5F5;

  --font-saira  : "Saira Condensed", sans-serif;
  --font-mono   : "DM Mono", monospace;
  --font-barlow : "Barlow", sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 0 !important;
}

html {
  background: #0D0D0D;
  color: #F5F5F5;
  overflow-x: hidden;
}

body {
  background: #0D0D0D;
  font-family: var(--font-mono);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Noise texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.032;
}

/* Custom scrollbar */
::-webkit-scrollbar        { width: 3px; }
::-webkit-scrollbar-track  { background: #1A1A1A; }
::-webkit-scrollbar-thumb  { background: #BB0A21; }
::-webkit-scrollbar-thumb:hover { background: #E8001A; }

/* Text selection */
::selection {
  background: #BB0A21;
  color: #FFFFFF;
}
```

---

## FILE 03 — data/carData.ts

```ts
export const CAR = {
  model        : 'e-tron GT Race',
  brand        : 'Audi Sport',
  series       : 'Quattro Motorsport Series',
  class        : 'FIA GT3',
  season       : 'Season 2026',
  raceNumber   : '04',
  tagline      : 'Vorsprung Durch Technik',
  homologation : 'FIA GT3 Homologated',
} as const

export const SPECS = {
  power     : { label: 'POWER',     value: '630',     unit: 'PS'   },
  torque    : { label: 'TORQUE',    value: '740',     unit: 'NM'   },
  sprint    : { label: '0-100',     value: '3.4',     unit: 'SEC'  },
  topSpeed  : { label: 'TOP SPEED', value: '305',     unit: 'KM/H' },
  weight    : { label: 'WEIGHT',    value: '1490',    unit: 'KG'   },
  downforce : { label: 'DOWNFORCE', value: '350',     unit: 'KG'   },
  drive     : { label: 'DRIVE',     value: 'QUATTRO', unit: 'AWD'  },
  gears     : { label: 'GEARS',     value: '2-SPD',   unit: 'PDK'  },
  sprint200 : { label: '0-200',     value: '7.8',     unit: 'SEC'  },
} as const

export const GRID_SPECS = [
  { label: 'ENGINE',     value: 'e-tron Electric', unit: 'MOTOR' },
  { label: 'POWER',      value: '630',             unit: 'PS'    },
  { label: 'TORQUE',     value: '740',             unit: 'NM'    },
  { label: '0-100 KM/H', value: '3.4',             unit: 'SEC'   },
  { label: 'TOP SPEED',  value: '305',             unit: 'KM/H'  },
  { label: 'CLASS',      value: 'GT3',             unit: 'FIA'   },
] as const

export const FEATURES = [
  {
    id       : 'awd',
    title    : 'Quattro All-Wheel Drive',
    subtitle : 'SYSTEM 01 — DRIVETRAIN',
    body     : 'Permanent all-wheel drive with torque vectoring across both axles. Power distributed in milliseconds, not seconds. Zero slip. Zero compromise.',
  },
  {
    id       : 'aero',
    title    : 'Aerodynamic Package',
    subtitle : 'SYSTEM 02 — DOWNFORCE',
    body     : 'Active rear wing generates 350kg of downforce at 200km/h. Carbon front splitter, side skirts, and diffuser operate as a single unified aerodynamic system.',
  },
] as const

export const NAV_LINKS = ['LINEUP', 'TECHNOLOGY', 'RACING'] as const

export const TOTAL_FRAMES = 243
export const IMAGE_BASE   = '/images/audi-sequence'

/** Returns padded frame URL: /images/audi-sequence/ezgif-frame-001.jpg */
export function getFrameUrl(index: number): string {
  const padded = (index + 1).toString().padStart(3, '0')
  return `${IMAGE_BASE}/ezgif-frame-${padded}.jpg`
}
```

---

## FILE 04 — components/Navbar.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS, CAR } from '@/data/carData'

function AudiRings({ size = 24 }: { size?: number }) {
  return (
    <svg width={size * 3.2} height={size * 0.9} viewBox={`0 0 ${size * 3.2} ${size * 0.9}`} fill="none" aria-label="Audi four rings">
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={size * 0.45 + i * size * 0.73}
          cy={size * 0.45}
          r={size * 0.38}
          stroke="#F5F5F5"
          strokeWidth={size * 0.07}
          fill="none"
        />
      ))}
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background    : scrolled ? 'rgba(13,13,13,0.9)'           : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)'                    : 'none',
        borderBottom  : scrolled ? '1px solid rgba(187,10,33,0.3)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <AudiRings size={22} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.35em', color: '#C8C8C8' }}>
            {CAR.brand}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link, i) => (
            <span key={link} className="flex items-center gap-6">
              <a
                href="#"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', color: '#8A8A8A', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8A8A')}
              >
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span style={{ width: '1px', height: '12px', background: '#8A8A8A', opacity: 0.35 }} />
              )}
            </span>
          ))}

          <span style={{ width: '1px', height: '16px', background: '#8A8A8A', opacity: 0.35, marginLeft: '8px' }} />

          <button
            style={{ fontFamily: 'var(--font-saira)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: '#BB0A21', border: '1px solid #BB0A21', padding: '8px 16px', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#BB0A21'; e.currentTarget.style.color = '#FFFFFF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#BB0A21' }}
          >
            CONFIGURE
          </button>
        </div>
      </div>
    </nav>
  )
}
```

---

## FILE 05 — components/LoadingScreen.tsx

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'

function AudiRings({ size = 44 }: { size?: number }) {
  return (
    <svg width={size * 3.2} height={size * 0.9} viewBox={`0 0 ${size * 3.2} ${size * 0.9}`} fill="none">
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={size * 0.45 + i * size * 0.73}
          cy={size * 0.45}
          r={size * 0.38}
          stroke="#BB0A21"
          strokeWidth={size * 0.05}
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.18, duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

interface Props {
  loaded    : number
  total     : number
  isVisible : boolean
}

export default function LoadingScreen({ loaded, total, isVisible }: Props) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ background: '#0D0D0D', zIndex: 9998 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <AudiRings size={44} />

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.4em', color: '#C8C8C8', marginTop: '32px' }}>
            LOADING TELEMETRY
          </p>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: '#8A8A8A', marginTop: '8px' }}>
            {loaded} / {total} FRAMES — {pct}%
          </p>

          <div style={{ width: '200px', height: '1px', background: '#1A1A1A', marginTop: '24px', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#BB0A21' }}
              initial={{ width: '0%' }}
              animate={{ width: `${pct}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## FILE 06 — components/AudiCanvas.tsx

CRITICAL FILE — every comment is load-bearing. Read before modifying.

```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { MotionValue } from 'framer-motion'
import { useMotionValueEvent } from 'framer-motion'
import LoadingScreen from './LoadingScreen'
import { getFrameUrl } from '@/data/carData'

interface Props {
  scrollYProgress : MotionValue<number>
  totalFrames     : number
}

export default function AudiCanvas({ scrollYProgress, totalFrames }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const prevFrameRef = useRef<number>(-1)
  const rafRef       = useRef<number | null>(null)

  const [loaded,  setLoaded]  = useState(0)
  const [isReady, setIsReady] = useState(false)

  /**
   * Setup canvas dimensions for devicePixelRatio.
   * Prevents blurry output on Retina and 4K displays.
   */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w   = window.innerWidth
    const h   = window.innerHeight
    canvas.width        = w * dpr
    canvas.height       = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
  }, [])

  /**
   * Draw a single frame with OBJECT-FIT: COVER logic + vignette.
   */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img    = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cW = canvas.clientWidth
    const cH = canvas.clientHeight

    // Cover: fill canvas, maintain aspect ratio, crop edges
    const scale = Math.max(cW / img.naturalWidth, cH / img.naturalHeight)
    const x     = (cW - img.naturalWidth  * scale) / 2
    const y     = (cH - img.naturalHeight * scale) / 2

    ctx.clearRect(0, 0, cW, cH)
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)

    // Cinematic vignette
    const vignette = ctx.createRadialGradient(cW / 2, cH / 2, cH * 0.2, cW / 2, cH / 2, cH * 0.88)
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.75)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, cW, cH)
  }, [])

  /**
   * Preload all 243 frames on mount.
   * Tracks real progress for LoadingScreen.
   */
  useEffect(() => {
    setupCanvas()

    let loadedCount = 0
    const images: HTMLImageElement[] = new Array(totalFrames)

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image()
      img.src = getFrameUrl(i)
      img.onload = () => {
        loadedCount++
        setLoaded(loadedCount)
        if (loadedCount === totalFrames) { setIsReady(true); drawFrame(0) }
      }
      img.onerror = () => {
        loadedCount++
        setLoaded(loadedCount)
        if (loadedCount === totalFrames) setIsReady(true)
      }
      images[i] = img
    }

    imagesRef.current = images

    const handleResize = () => { setupCanvas(); if (prevFrameRef.current >= 0) drawFrame(prevFrameRef.current) }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [totalFrames, setupCanvas, drawFrame])

  /**
   * Map scroll progress to frame index.
   * Uses rAF to avoid drawing more than once per display refresh.
   */
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isReady) return
    const frameIndex = Math.min(Math.round(progress * (totalFrames - 1)), totalFrames - 1)
    if (frameIndex === prevFrameRef.current) return
    prevFrameRef.current = frameIndex
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex))
  })

  return (
    <>
      <LoadingScreen loaded={loaded} total={totalFrames} isVisible={!isReady} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
      />
    </>
  )
}
```

---

## FILE 07 — components/AudiHUD.tsx

```tsx
'use client'

import { useTransform, motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CAR, SPECS } from '@/data/carData'

interface Props { scrollYProgress: MotionValue<number> }

function AudiRings({ size = 24 }: { size?: number }) {
  return (
    <svg width={size * 3.2} height={size * 0.9} viewBox={`0 0 ${size * 3.2} ${size * 0.9}`} fill="none">
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={size * 0.45 + i * size * 0.73} cy={size * 0.45} r={size * 0.38} stroke="#F5F5F5" strokeWidth={size * 0.07} fill="none" />
      ))}
    </svg>
  )
}

function RedLine({ width = 40 }: { width?: number | string }) {
  return <div style={{ width, height: '1px', background: '#BB0A21' }} />
}

function Label({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#C8C8C8', textTransform: 'uppercase' as const }}>{children}</span>
}

export default function AudiHUD({ scrollYProgress }: Props) {
  const heroOpacity = useTransform(scrollYProgress, [0, 0.04, 0.27, 0.33], [0, 1, 1, 0])
  const perfOpacity = useTransform(scrollYProgress, [0.30, 0.37, 0.60, 0.66], [0, 1, 1, 0])
  const dnaOpacity  = useTransform(scrollYProgress, [0.63, 0.70, 0.97, 1.00], [0, 1, 1, 0])
  const perfBarH    = useTransform(scrollYProgress, [0.30, 0.66], ['0%', '100%'])

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>

      {/* PHASE 1 — IDENTITY */}
      <motion.div style={{ opacity: heroOpacity, position: 'absolute', inset: 0 }}>
        {/* Top-left: brand + model */}
        <div style={{ position: 'absolute', top: '96px', left: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <RedLine width={40} />
          <Label>{CAR.brand}</Label>
          <h1 style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(52px, 7vw, 84px)', fontWeight: 900, lineHeight: 0.88, color: '#F5F5F5', letterSpacing: '0.01em' }}>
            {CAR.model.split(' ').map((w, i) => <span key={i} style={{ display: 'block' }}>{w}</span>)}
          </h1>
          <RedLine width="100%" />
          <Label>{CAR.series}</Label>
        </div>

        {/* Top-right: rings + tagline */}
        <div style={{ position: 'absolute', top: '96px', right: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <AudiRings size={24} />
          <Label>{CAR.tagline}</Label>
        </div>

        {/* Bottom-left: ghost race number */}
        <div style={{ position: 'absolute', bottom: '48px', left: '8px' }}>
          <span style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(100px, 18vw, 200px)', fontWeight: 900, lineHeight: 1, color: '#F5F5F5', opacity: 0.07, userSelect: 'none', display: 'block' }}>
            {CAR.raceNumber}
          </span>
        </div>

        {/* Bottom-right: 3 stats */}
        <div style={{ position: 'absolute', bottom: '64px', right: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
          {([SPECS.power, SPECS.torque, SPECS.sprint] as const).map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Label>{s.label}</Label>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-saira)', fontSize: '30px', fontWeight: 700, lineHeight: 1, color: '#F5F5F5' }}>{s.value}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#BB0A21' }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Label>Scroll</Label>
          <div style={{ width: '1px', height: '32px', background: '#8A8A8A', opacity: 0.5, position: 'relative', overflow: 'hidden' }}>
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: '#BB0A21' }}
              animate={{ height: ['0%', '100%', '0%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* PHASE 2 — PERFORMANCE */}
      <motion.div style={{ opacity: perfOpacity, position: 'absolute', inset: 0 }}>
        {/* Vertical label */}
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--font-saira)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5em', color: '#BB0A21', textTransform: 'uppercase' }}>Performance</span>
        </div>

        {/* Hero stat */}
        <div style={{ position: 'absolute', top: '50%', left: '72px', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label>{SPECS.sprint.label} KM/H</Label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(72px, 12vw, 112px)', fontWeight: 900, lineHeight: 0.88, color: '#F5F5F5' }}>{SPECS.sprint.value}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#BB0A21', letterSpacing: '0.2em', marginTop: '4px' }}>{SPECS.sprint.unit}</span>
          </div>
          <RedLine width={160} />
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label>{SPECS.topSpeed.label}</Label>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-saira)', fontSize: '52px', fontWeight: 700, lineHeight: 0.9, color: '#F5F5F5' }}>{SPECS.topSpeed.value}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#BB0A21' }}>{SPECS.topSpeed.unit}</span>
            </div>
          </div>
        </div>

        {/* Bottom data strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(13,13,13,0.82)', backdropFilter: 'blur(6px)', borderTop: '1px solid rgba(187,10,33,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
            {([SPECS.weight, SPECS.sprint200, SPECS.downforce, SPECS.drive, SPECS.gears] as const).map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Label>{s.label}</Label>
                  <span style={{ fontFamily: 'var(--font-saira)', fontSize: '22px', fontWeight: 700, color: '#F5F5F5', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: '#BB0A21', letterSpacing: '0.15em' }}>{s.unit}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', height: '40px', background: '#C8C8C8', opacity: 0.18 }} />}
              </div>
            ))}
          </div>
          <div style={{ padding: '0 32px 12px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: '#8A8A8A' }}>
            AUDI SPORT GT3 EVO — TECHNICAL SPECIFICATIONS — {CAR.season}
          </div>
        </div>

        {/* Right: progress bar */}
        <div style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Label>SEQ</Label>
          <div style={{ width: '1px', height: '96px', background: '#1A1A1A', position: 'relative' }}>
            <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: '#BB0A21', height: perfBarH }} />
          </div>
        </div>
      </motion.div>

      {/* PHASE 3 — RACING DNA */}
      <motion.div style={{ opacity: dnaOpacity, position: 'absolute', inset: 0 }}>
        {/* Left: title + pills */}
        <div style={{ position: 'absolute', top: '50%', left: '32px', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(64px, 10vw, 110px)', fontWeight: 900, lineHeight: 0.88, color: '#F5F5F5', marginLeft: '-2px' }}>RACING</span>
          <span style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(64px, 10vw, 110px)', fontWeight: 900, lineHeight: 0.88, color: '#BB0A21', marginLeft: '16px' }}>DNA</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            {[
              { label: 'AERODYNAMICS', desc: 'Active rear wing — 350kg downforce at 200km/h' },
              { label: 'DRIVETRAIN',   desc: 'Quattro permanent AWD — 2-speed PDK' },
              { label: 'CHASSIS',      desc: 'Carbon fiber monocoque — 1490kg dry weight' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', paddingLeft: '12px', borderLeft: '2px solid #BB0A21' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: '#BB0A21', textTransform: 'uppercase' as const }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-barlow)', fontSize: '13px', color: '#C8C8C8', marginTop: '2px' }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: ghost + CTA */}
        <div style={{ position: 'absolute', top: '50%', right: '32px', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(100px, 18vw, 200px)', fontWeight: 900, lineHeight: 1, color: '#F5F5F5', opacity: 0.055, userSelect: 'none', position: 'absolute', right: '-8px' }}>GT3</span>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-saira)', fontSize: '28px', fontWeight: 700, color: '#F5F5F5' }}>Audi e-tron</span>
            <RedLine width="100%" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: '#BB0A21', textTransform: 'uppercase' as const }}>{CAR.homologation}</span>
            <button
              style={{ marginTop: '16px', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: '#BB0A21', border: '1px solid #BB0A21', background: 'transparent', cursor: 'pointer', textTransform: 'uppercase' as const, transition: 'all 0.15s', pointerEvents: 'auto' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#BB0A21'; e.currentTarget.style.color = '#FFFFFF' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#BB0A21' }}
            >
              Explore the Lineup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
```

---

## FILE 08 — components/SpecsGrid.tsx

```tsx
import { GRID_SPECS, CAR } from '@/data/carData'

export default function SpecsGrid() {
  return (
    <section style={{ background: '#111111', padding: '128px 32px' }}>
      <div style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, lineHeight: 0.9, color: '#F5F5F5' }}>TECHNICAL</div>
        <div style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, lineHeight: 0.9, color: '#BB0A21', marginLeft: '40px' }}>SPECIFICATIONS</div>
        <div style={{ width: '96px', height: '1px', background: '#BB0A21', marginTop: '16px' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1A1A1A' }}>
        {GRID_SPECS.map((spec) => (
          <div key={spec.label} style={{ background: '#0D0D0D', borderTop: '2px solid #BB0A21', padding: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#C8C8C8', textTransform: 'uppercase' }}>{spec.label}</span>
            <span style={{ fontFamily: 'var(--font-saira)', fontSize: '40px', fontWeight: 700, color: '#F5F5F5', lineHeight: 1 }}>{spec.value}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#BB0A21', letterSpacing: '0.15em' }}>{spec.unit}</span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: '#8A8A8A', marginTop: '32px' }}>
        {CAR.brand} — {CAR.model} — {CAR.class} — {CAR.season}
      </p>
    </section>
  )
}
```

---

## FILE 09 — components/RacingDNA.tsx

```tsx
import { FEATURES } from '@/data/carData'

export default function RacingDNA() {
  return (
    <section style={{ background: '#0D0D0D' }}>
      {FEATURES.map((feature, i) => (
        <div key={feature.id} style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', minHeight: '60vh', alignItems: 'center' }}>
          <div style={{ width: '50%', padding: '80px 64px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.35em', color: '#BB0A21', textTransform: 'uppercase' }}>{feature.subtitle}</span>
            <h2 style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 0.92, color: '#F5F5F5' }}>{feature.title}</h2>
            <div style={{ width: '64px', height: '1px', background: '#BB0A21' }} />
            <p style={{ fontFamily: 'var(--font-barlow)', fontSize: '15px', color: '#C8C8C8', lineHeight: 1.65, maxWidth: '400px' }}>{feature.body}</p>
          </div>

          <div style={{ width: '50%', minHeight: '60vh', position: 'relative', overflow: 'hidden', background: '#1A1A1A' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, #BB0A21 0px, #BB0A21 1px, transparent 1px, transparent 40px)', opacity: 0.05 }} />
            <div style={{ position: 'absolute', inset: 0, background: i % 2 === 0 ? 'linear-gradient(135deg, rgba(187,10,33,0.18) 0%, transparent 55%)' : 'linear-gradient(225deg, rgba(187,10,33,0.18) 0%, transparent 55%)' }} />
            <span style={{ position: 'absolute', bottom: '32px', right: '32px', fontFamily: 'var(--font-saira)', fontSize: '80px', fontWeight: 900, color: '#F5F5F5', opacity: 0.08, lineHeight: 1, userSelect: 'none' }}>0{i + 1}</span>
          </div>
        </div>
      ))}
    </section>
  )
}
```

---

## FILE 10 — components/Footer.tsx

```tsx
function AudiRings({ size = 32 }: { size?: number }) {
  return (
    <svg width={size * 3.2} height={size * 0.9} viewBox={`0 0 ${size * 3.2} ${size * 0.9}`} fill="none">
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={size * 0.45 + i * size * 0.73} cy={size * 0.45} r={size * 0.38} stroke="#F5F5F5" strokeWidth={size * 0.06} fill="none" />
      ))}
    </svg>
  )
}

const COLS = [
  { title: 'MOTORSPORT', links: ['GT3 Program', 'DTM History', 'Le Mans Legacy', 'Quattro Heritage'] },
  { title: 'TECHNOLOGY',  links: ['e-tron Platform', 'Quattro AWD', 'Aerodynamics', 'Carbon Fiber'] },
  { title: 'CONNECT',     links: ['Configure', 'Find Dealer', 'Press Room', 'Contact Sport'] },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A', paddingTop: '80px', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}><AudiRings size={32} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', padding: '0 64px 64px', borderBottom: '1px solid #1A1A1A' }}>
        {COLS.map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.35em', color: '#BB0A21', textTransform: 'uppercase' }}>{col.title}</span>
            {col.links.map((link) => (
              <a key={link} href="#" style={{ fontFamily: 'var(--font-barlow)', fontSize: '14px', color: '#8A8A8A', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8A8A')}
              >{link}</a>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px 0' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: '#8A8A8A', textTransform: 'uppercase' }}>© 2026 Audi AG — Audi Sport Division</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: '#BB0A21', textTransform: 'uppercase' }}>Vorsprung Durch Technik</span>
      </div>
    </footer>
  )
}
```

---

## FILE 11 — app/page.tsx (GENERATE LAST)

```tsx
'use client'

import { useRef }       from 'react'
import { useScroll }    from 'framer-motion'
import dynamic          from 'next/dynamic'
import Navbar           from '@/components/Navbar'
import SpecsGrid        from '@/components/SpecsGrid'
import RacingDNA        from '@/components/RacingDNA'
import Footer           from '@/components/Footer'
import { TOTAL_FRAMES } from '@/data/carData'

// SSR disabled — both require browser APIs (window, canvas)
const AudiCanvas = dynamic(() => import('@/components/AudiCanvas'), { ssr: false })
const AudiHUD    = dynamic(() => import('@/components/AudiHUD'),    { ssr: false })

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  // THE single useScroll call — MotionValue passed as prop to children
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <main style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* SCROLL-LOCKED CANVAS SEQUENCE — 730vh */}
      <section ref={containerRef} style={{ height: '730vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
          <AudiCanvas scrollYProgress={scrollYProgress} totalFrames={TOTAL_FRAMES} />
          <AudiHUD    scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* POST-SEQUENCE — natural scroll resumes here */}
      <div style={{ position: 'relative', zIndex: 20, background: '#111111' }}>
        <SpecsGrid />
        <RacingDNA />
        <Footer />
      </div>
    </main>
  )
}
```

---

## FINAL CHECKLIST — VERIFY BEFORE npm run dev

```
ASSETS
[ ] public/images/audi-sequence/ezgif-frame-001.jpg exists
[ ] public/images/audi-sequence/ezgif-frame-243.jpg exists
[ ] Total frame count = 243 exactly

CODE
[ ] TOTAL_FRAMES = 243 in data/carData.ts
[ ] getFrameUrl() uses padStart(3, '0')
[ ] AudiCanvas imported with { ssr: false } in page.tsx
[ ] AudiHUD imported with { ssr: false } in page.tsx
[ ] Only page.tsx calls useScroll — no child does
[ ] AudiHUD wrapper has pointerEvents: 'none'
[ ] CTA button inside AudiHUD has pointerEvents: 'auto'
[ ] npm install framer-motion clsx tailwind-merge completed

QUALITY
[ ] npx tsc --noEmit passes with zero errors
[ ] No hydration warnings in console
[ ] Canvas is sharp on Retina display (DPR fix applied)
[ ] Loading screen shows real progress percentage
```
