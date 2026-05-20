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
