'use client'

import { FEATURES } from '@/data/carData'
import { useEffect, useState } from 'react'

export default function RacingDNA() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section style={{ background: '#0D0D0D' }}>
      {FEATURES.map((feature, i) => (
        <div 
          key={feature.id} 
          style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : (i % 2 === 0 ? 'row' : 'row-reverse'), 
            minHeight: isMobile ? 'auto' : '60vh', 
            alignItems: 'stretch' 
          }}
        >
          <div style={{ 
            width: isMobile ? '100%' : '50%', 
            padding: isMobile ? '64px 24px' : '80px 64px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            justifyContent: 'center'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.35em', color: '#BB0A21', textTransform: 'uppercase' }}>{feature.subtitle}</span>
            <h2 style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 0.92, color: '#F5F5F5' }}>{feature.title}</h2>
            <div style={{ width: '64px', height: '1px', background: '#BB0A21' }} />
            <p style={{ fontFamily: 'var(--font-barlow)', fontSize: '15px', color: '#C8C8C8', lineHeight: 1.65, maxWidth: '400px' }}>{feature.body}</p>
          </div>

          <div style={{ 
            width: isMobile ? '100%' : '50%', 
            minHeight: isMobile ? '40vh' : '60vh', 
            position: 'relative', 
            overflow: 'hidden', 
            background: '#1A1A1A' 
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, #BB0A21 0px, #BB0A21 1px, transparent 1px, transparent 40px)', opacity: 0.05 }} />
            <div style={{ position: 'absolute', inset: 0, background: i % 2 === 0 ? 'linear-gradient(135deg, rgba(187,10,33,0.18) 0%, transparent 55%)' : 'linear-gradient(225deg, rgba(187,10,33,0.18) 0%, transparent 55%)' }} />
            <span style={{ 
              position: 'absolute', 
              bottom: isMobile ? '16px' : '32px', 
              right: isMobile ? '16px' : '32px', 
              fontFamily: 'var(--font-saira)', 
              fontSize: isMobile ? '60px' : '80px', 
              fontWeight: 900, 
              color: '#F5F5F5', 
              opacity: 0.08, 
              lineHeight: 1, 
              userSelect: 'none' 
            }}>
              0{i + 1}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}
