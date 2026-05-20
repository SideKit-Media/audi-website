# Audi Sport — e-tron GT Race Showcase

A cinematic, scroll-driven motorsport showcase website built for the Audi e-tron GT Race. Inspired by Apple's product page scroll animations — 243 frames of footage play frame-by-frame as you scroll, creating a video-like experience entirely in the browser.

Live demo: [your-deployment-url-here]

---

## Preview

> Scroll-controlled canvas animation · Cold German precision aesthetic · Pit lane telemetry HUD

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Canvas | HTML5 Canvas API |
| Fonts | Saira Condensed, DM Mono, Barlow |

---

## Features

- **Scroll-driven image sequence** — 243 JPG frames rendered on HTML5 Canvas, mapped to scroll position using Framer Motion's `useScroll`
- **High-DPI canvas rendering** — `devicePixelRatio` scaling ensures sharp output on Retina and 4K displays
- **3-phase HUD overlay** — Identity → Performance → Racing DNA phases cross-fade based on scroll progress
- **Cinematic vignette** — Radial gradient drawn over each frame for depth
- **Loading screen** — Real progress tracking across all 243 frames before sequence begins
- **Glassmorphism navbar** — Transparent at top, blurred glass on scroll
- **Specs grid** — Post-sequence technical specifications section
- **Racing DNA features** — Alternating feature highlight sections
- **Design system** — Custom color palette, typography, and strict design rules enforced throughout

---

## Design System

### Colors

```
#0D0D0D  — Audi Black      (primary background)
#BB0A21  — Audi Red        (accent, max 2 per scroll phase)
#C8C8C8  — Brushed Silver  (data labels)
#F5F5F5  — Racing White    (primary text)
#1A1A1A  — Carbon          (card surfaces)
```

### Typography

```
Saira Condensed  — Headings, large numbers, display
DM Mono          — Specs, labels, telemetry readouts
Barlow           — Body copy, descriptions
```

---

## Project Structure

```
audi-website/
├── app/
│   ├── layout.tsx          # Fonts, metadata, global wrapper
│   ├── globals.css         # Tailwind v4 theme + global styles
│   └── page.tsx            # Orchestrator — owns useScroll
├── components/
│   ├── Navbar.tsx          # Fixed nav with scroll-triggered glass
│   ├── LoadingScreen.tsx   # Frame preload progress screen
│   ├── AudiCanvas.tsx      # Canvas frame renderer (SSR disabled)
│   ├── AudiHUD.tsx         # 3-phase scroll HUD overlay (SSR disabled)
│   ├── SpecsGrid.tsx       # Technical specifications section
│   ├── RacingDNA.tsx       # Feature highlight sections
│   └── Footer.tsx          # Footer with columns
├── data/
│   └── carData.ts          # All copy, specs, and constants
└── public/
    └── images/
        └── audi-sequence/  # 243 frames (not included in repo)
            ├── ezgif-frame-001.jpg
            └── ... ezgif-frame-243.jpg
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/audi-website.git

# Navigate into the project
cd audi-website

# Install dependencies
npm install
```

### Add the Frame Assets

The 243 frames are not included in this repository due to file size.

Place your frames in:
```
public/images/audi-sequence/
```

Naming format: `ezgif-frame-001.jpg` → `ezgif-frame-243.jpg`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## Scroll Architecture

The entire scroll system is owned by a single `useScroll` instance in `app/page.tsx`. The `scrollYProgress` MotionValue is passed as a prop to both `AudiCanvas` and `AudiHUD` — no child component calls `useScroll` independently. This prevents desync between the canvas frame and the HUD overlay.

```
useScroll (page.tsx)
├── AudiCanvas  → maps progress (0→1) to frameIndex (0→242)
└── AudiHUD     → maps progress to 3 opacity phases
```

The sticky container is `730vh` tall — giving each of the 243 frames approximately 3vh of scroll travel for smooth cinematic motion.

---

## Deployment

This project is ready to deploy on Vercel.

```bash
npm install -g vercel
vercel
```

Note: Frame assets in `public/images/audi-sequence/` must be present at build time. Upload them to the project before deploying, or host them on a CDN and update the `IMAGE_BASE` path in `data/carData.ts`.

---

## License

MIT — built for learning and portfolio purposes.

---

Built by Arnav · Audi Sport is a trademark of Audi AG · This project is not affiliated with Audi AG
