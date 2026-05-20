import { GRID_SPECS, CAR } from '@/data/carData'

export default function SpecsGrid() {
  return (
    <section style={{ background: '#111111', padding: 'clamp(64px, 10vw, 128px) 20px' }}>
      <div style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
        <div style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(36px, 8vw, 88px)', fontWeight: 900, lineHeight: 0.9, color: '#F5F5F5' }}>TECHNICAL</div>
        <div style={{ fontFamily: 'var(--font-saira)', fontSize: 'clamp(36px, 8vw, 88px)', fontWeight: 900, lineHeight: 0.9, color: '#BB0A21', marginLeft: 'clamp(20px, 4vw, 40px)' }}>SPECIFICATIONS</div>
        <div style={{ width: '96px', height: '1px', background: '#BB0A21', marginTop: '16px' }} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1px', 
        background: '#1A1A1A' 
      }}>
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
