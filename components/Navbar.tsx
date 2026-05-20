'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS, CAR } from '@/data/carData'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', checkMobile)
    checkMobile()
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[60] transition-all duration-300"
        style={{
          background    : scrolled || menuOpen ? 'rgba(13,13,13,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(14px)'          : 'none',
          borderBottom  : scrolled || menuOpen ? '1px solid rgba(187,10,33,0.3)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <AudiRings size={20} />
            {!isMobile && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.35em', color: '#C8C8C8' }}>
                {CAR.brand}
              </span>
            )}
          </div>

          {/* Desktop Links */}
          {!isMobile && (
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
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                style={{ width: '24px', height: '1px', background: '#F5F5F5' }} 
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                style={{ width: '24px', height: '1px', background: '#F5F5F5' }} 
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                style={{ width: '24px', height: '1px', background: '#F5F5F5' }} 
              />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0D0D0D] pt-24 px-8 flex flex-col gap-12"
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: 'var(--font-saira)', fontSize: '32px', fontWeight: 700, letterSpacing: '0.05em', color: '#F5F5F5', textDecoration: 'none' }}
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="mt-auto mb-12 flex flex-col gap-6">
              <button
                style={{ fontFamily: 'var(--font-saira)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.2em', color: '#FFFFFF', border: '1px solid #BB0A21', padding: '16px', background: '#BB0A21', cursor: 'pointer', width: '100%' }}
              >
                CONFIGURE E-TRON
              </button>
              
              <div className="flex flex-col gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: '#BB0A21' }}>THE BRAND</span>
                <span style={{ fontFamily: 'var(--font-barlow)', fontSize: '14px', color: '#8A8A8A' }}>Vorsprung Durch Technik</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
