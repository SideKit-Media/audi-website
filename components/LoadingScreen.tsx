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
