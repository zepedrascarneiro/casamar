import { MessageCircle } from 'lucide-react'

const WHATSAPP = 'https://api.whatsapp.com/send?phone=5582988330033&text=Ol%C3%A1%2C%20gostaria%20de%20reservar%20minha%20data%20na%20Casa%20Mar%20Ipioca.'

export default function BookingSystem() {
  return (
    <section id="reservar" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '24px', fontWeight: 600 }}>
          Reserve sua data
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '24px', fontWeight: 300 }}>
          <span style={{ fontStyle: 'italic' }}>Garanta</span> seu dia
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 28px' }} />
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 48px', fontSize: '1.05rem', lineHeight: 1.8 }}>
          Cada celebração é única. Fale com a gente pelo WhatsApp para conhecer os espaços disponíveis,
          tirar dúvidas e reservar a sua data.
        </p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 44px', background: '#25D366', color: '#fff', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1fba59'}
          onMouseLeave={e => e.currentTarget.style.background = '#25D366'}>
          <MessageCircle size={18} />
          Reservar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}
