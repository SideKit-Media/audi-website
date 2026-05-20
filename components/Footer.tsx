'use client'

'use client'

import { useEffect, useState } from 'react'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A', paddingTop: isMobile ? '64px' : '80px', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}><AudiRings size={isMobile ? 24 : 32} /></div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
        gap: isMobile ? '48px' : '32px', 
        padding: isMobile ? '0 32px 64px' : '0 64px 64px', 
        borderBottom: '1px solid #1A1A1A',
        textAlign: isMobile ? 'center' : 'left'
      }}>
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

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 32px 0',
        gap: isMobile ? '16px' : '0',
        textAlign: 'center'
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: '#8A8A8A', textTransform: 'uppercase' }}>© 2026 Audi AG — Audi Sport Division</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: '#BB0A21', textTransform: 'uppercase' }}>Vorsprung Durch Technik</span>
      </div>
    </footer>
  )
}
