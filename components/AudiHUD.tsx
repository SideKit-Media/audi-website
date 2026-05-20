'use client'

import { useTransform, motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CAR, SPECS } from '@/data/carData'
import { useEffect, useState } from 'react'

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

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#C8C8C8', textTransform: 'uppercase' as const }}>{children}</span>
}

export default function AudiHUD({ scrollYProgress }: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const heroOpacity = useTransform(scrollYProgress, [0, 0.04, 0.27, 0.33], [0, 1, 1, 0])
  const perfOpacity = useTransform(scrollYProgress, [0.30, 0.37, 0.60, 0.66], [0, 1, 1, 0])
  const dnaOpacity  = useTransform(scrollYProgress, [0.63, 0.70, 0.97, 1.00], [0, 1, 1, 0])
  const perfBarH    = useTransform(scrollYProgress, [0.30, 0.66], ['0%', '100%'])

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>

      {/* PHASE 1 — IDENTITY */}
      <motion.div style={{ opacity: heroOpacity, position: 'absolute', inset: 0 }}>
        {/* Top-left: brand + model */}
        <div style={{ 
          position: 'absolute', 
          top: isMobile ? '80px' : '96px', 
          left: isMobile ? '20px' : '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          maxWidth: isMobile ? '200px' : 'none'
        }}>
          <RedLine width={40} />
          <Label>{CAR.brand}</Label>
          <h1 style={{ 
            fontFamily: 'var(--font-saira)', 
            fontSize: isMobile ? '42px' : 'clamp(52px, 7vw, 84px)', 
            fontWeight: 900, 
            lineHeight: 0.88, 
            color: '#F5F5F5', 
            letterSpacing: '0.01em' 
          }}>
            {CAR.model.split(' ').map((w, i) => <span key={i} style={{ display: 'block' }}>{w}</span>)}
          </h1>
          <RedLine width="100%" />
          <Label>{CAR.series}</Label>
        </div>

        {/* Top-right: rings + tagline */}
        <div style={{ 
          position: 'absolute', 
          top: isMobile ? '80px' : '96px', 
          right: isMobile ? '20px' : '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end', 
          gap: '8px' 
        }}>
          <AudiRings size={isMobile ? 18 : 24} />
          {!isMobile && <Label>{CAR.tagline}</Label>}
        </div>

        {/* Bottom-left: ghost race number */}
        <div style={{ position: 'absolute', bottom: isMobile ? '20px' : '48px', left: '8px' }}>
          <span style={{ 
            fontFamily: 'var(--font-saira)', 
            fontSize: isMobile ? '80px' : 'clamp(100px, 18vw, 200px)', 
            fontWeight: 900, 
            lineHeight: 1, 
            color: '#F5F5F5', 
            opacity: 0.07, 
            userSelect: 'none', 
            display: 'block' 
          }}>
            {CAR.raceNumber}
          </span>
        </div>

        {/* Bottom-right: 3 stats */}
        <div style={{ 
          position: 'absolute', 
          bottom: isMobile ? '80px' : '64px', 
          right: isMobile ? '20px' : '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end', 
          gap: isMobile ? '12px' : '16px' 
        }}>
          {([SPECS.power, SPECS.torque, SPECS.sprint] as const).map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Label>{s.label}</Label>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-saira)', fontSize: isMobile ? '24px' : '30px', fontWeight: 700, lineHeight: 1, color: '#F5F5F5' }}>{s.value}</span>
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
        {!isMobile && (
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-saira)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5em', color: '#BB0A21', textTransform: 'uppercase' }}>Performance</span>
          </div>
        )}

        {/* Hero stat */}
        <div style={{ 
          position: 'absolute', 
          top: isMobile ? '40%' : '50%', 
          left: isMobile ? '20px' : '72px', 
          transform: 'translateY(-50%)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px' 
        }}>
          <Label>{SPECS.sprint.label} KM/H</Label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-saira)', 
              fontSize: isMobile ? '64px' : 'clamp(72px, 12vw, 112px)', 
              fontWeight: 900, 
              lineHeight: 0.88, 
              color: '#F5F5F5' 
            }}>{SPECS.sprint.value}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#BB0A21', letterSpacing: '0.2em', marginTop: '4px' }}>{SPECS.sprint.unit}</span>
          </div>
          <RedLine width={isMobile ? 120 : 160} />
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label>{SPECS.topSpeed.label}</Label>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-saira)', fontSize: isMobile ? '42px' : '52px', fontWeight: 700, lineHeight: 0.9, color: '#F5F5F5' }}>{SPECS.topSpeed.value}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#BB0A21' }}>{SPECS.topSpeed.unit}</span>
            </div>
          </div>
        </div>

        {/* Bottom data strip */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'rgba(13,13,13,0.85)', 
          backdropFilter: 'blur(10px)', 
          borderTop: '1px solid rgba(187,10,33,0.35)',
          overflowX: isMobile ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isMobile ? 'flex-start' : 'space-between', 
            padding: isMobile ? '16px 20px' : '16px 32px',
            gap: isMobile ? '32px' : '0'
          }}>
            {([SPECS.weight, SPECS.sprint200, SPECS.downforce, SPECS.drive, SPECS.gears] as const).map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '32px' : '32px', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Label>{s.label}</Label>
                  <span style={{ fontFamily: 'var(--font-saira)', fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#F5F5F5', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: '#BB0A21', letterSpacing: '0.15em' }}>{s.unit}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', height: '40px', background: '#C8C8C8', opacity: 0.18 }} />}
              </div>
            ))}
          </div>
          <div style={{ 
            padding: isMobile ? '0 20px 12px' : '0 32px 12px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '8px', 
            letterSpacing: '0.2em', 
            color: '#8A8A8A',
            whiteSpace: isMobile ? 'nowrap' : 'normal'
          }}>
            AUDI SPORT GT3 EVO — TECHNICAL SPECIFICATIONS — {CAR.season}
          </div>
        </div>

        {/* Right: progress bar */}
        {!isMobile && (
          <div style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Label>SEQ</Label>
            <div style={{ width: '1px', height: '96px', background: '#1A1A1A', position: 'relative' }}>
              <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: '#BB0A21', height: perfBarH }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* PHASE 3 — RACING DNA */}
      <motion.div style={{ opacity: dnaOpacity, position: 'absolute', inset: 0 }}>
        {/* Left: title + pills */}
        <div style={{ 
          position: 'absolute', 
          top: isMobile ? '25%' : '50%', 
          left: isMobile ? '20px' : '32px', 
          transform: isMobile ? 'none' : 'translateY(-50%)', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <span style={{ 
            fontFamily: 'var(--font-saira)', 
            fontSize: isMobile ? '52px' : 'clamp(64px, 10vw, 110px)', 
            fontWeight: 900, 
            lineHeight: 0.88, 
            color: '#F5F5F5', 
            marginLeft: '-2px' 
          }}>RACING</span>
          <span style={{ 
            fontFamily: 'var(--font-saira)', 
            fontSize: isMobile ? '52px' : 'clamp(64px, 10vw, 110px)', 
            fontWeight: 900, 
            lineHeight: 0.88, 
            color: '#BB0A21', 
            marginLeft: isMobile ? '8px' : '16px' 
          }}>DNA</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px', marginTop: isMobile ? '20px' : '32px' }}>
            {[
              { label: 'AERODYNAMICS', desc: isMobile ? 'Active rear wing — 350kg downforce' : 'Active rear wing — 350kg downforce at 200km/h' },
              { label: 'DRIVETRAIN',   desc: 'Quattro permanent AWD — 2-speed PDK' },
              { label: 'CHASSIS',      desc: 'Carbon fiber monocoque — 1490kg weight' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', paddingLeft: '12px', borderLeft: '2px solid #BB0A21' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: '#BB0A21', textTransform: 'uppercase' as const }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-barlow)', fontSize: isMobile ? '11px' : '13px', color: '#C8C8C8', marginTop: '2px' }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: ghost + CTA */}
        <div style={{ 
          position: 'absolute', 
          bottom: isMobile ? '100px' : 'auto',
          top: isMobile ? 'auto' : '50%', 
          right: isMobile ? '20px' : '32px', 
          transform: isMobile ? 'none' : 'translateY(-50%)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end' 
        }}>
          <span style={{ 
            fontFamily: 'var(--font-saira)', 
            fontSize: isMobile ? '80px' : 'clamp(100px, 18vw, 200px)', 
            fontWeight: 900, 
            lineHeight: 1, 
            color: '#F5F5F5', 
            opacity: 0.055, 
            userSelect: 'none', 
            position: 'absolute', 
            right: '-8px',
            bottom: isMobile ? '60px' : 'auto'
          }}>GT3</span>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-saira)', fontSize: isMobile ? '22px' : '28px', fontWeight: 700, color: '#F5F5F5' }}>Audi e-tron</span>
            <RedLine width="100%" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: '#BB0A21', textTransform: 'uppercase' as const }}>{CAR.homologation}</span>
            <button
              style={{ 
                marginTop: '16px', 
                padding: isMobile ? '10px 20px' : '12px 24px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: isMobile ? '10px' : '11px', 
                letterSpacing: '0.2em', 
                color: '#BB0A21', 
                border: '1px solid #BB0A21', 
                background: 'transparent', 
                cursor: 'pointer', 
                textTransform: 'uppercase' as const, 
                transition: 'all 0.15s', 
                pointerEvents: 'auto' 
              }}
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
