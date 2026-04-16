import { useState, useEffect } from 'react'
import { Menu, X, MessageCircle, MapPin, Instagram, ChevronDown, Calendar } from 'lucide-react'
import BookingSystem from './BookingSystem.jsx'

const WHATSAPP = 'https://api.whatsapp.com/send?phone=5582988330033&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20Casa%20Mar%20Ipioca.'
const WHATSAPP_NUMBER = '+55 82 98833-0033'

const sections = [
  { id: 'villa', label: 'Villa' },
  { id: 'capela', label: 'Capela' },
  { id: 'salao', label: 'Salão' },
  { id: 'pacotes', label: 'Pacotes' },
  { id: 'reservar', label: 'Reservar' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'contato', label: 'Contato' },
]

const pacotes = [
  {
    nome: 'Destination',
    tagline: 'Intimista',
    convidados: 'Até 4 convidados',
    desc: 'A celebração dos dois, com o mar como testemunha. Uma cerimônia íntima, elegante e inesquecível.',
    inclui: ['Cerimônia na Capela ou beira-mar', 'Decoração minimalista exclusiva', 'Hospedagem do casal na Villa', 'Registro fotográfico essencial'],
  },
  {
    nome: 'Essencial',
    tagline: 'Completo',
    convidados: 'Até 50 convidados',
    desc: 'A experiência completa para casamentos exclusivos. Sofisticação em cada detalhe, do altar à pista.',
    inclui: ['Cerimônia + recepção na propriedade', 'Mobiliário de design', 'Buffet completo incluso', 'Equipe de som, iluminação e assessoria'],
    destaque: true,
  },
  {
    nome: 'Premium',
    tagline: 'Grandioso',
    convidados: 'Até 300 convidados',
    desc: 'O ápice do luxo costeiro. Para casais que buscam uma celebração única, personalizada e sem limites.',
    inclui: ['Assessoria personalizada dedicada', 'Decoração personalizada de autor', 'Hospedagem para família e padrinhos', 'Cerimônia, recepção e after à beira-mar'],
  },
]

const IMG = {
  hero: './images/hero-1.jpg',
  villa: './images/hero-2.jpg',
  capela: './images/hero-3.jpg',
  salao: './images/hero-4.jpg',
  pool: './images/hero-5.jpg',
  noite: './images/hero-6.jpg',
  sign: './images/casa-sign.jpg',
}

function Nav({ active }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(250,247,242,0.95)' : 'rgba(255,255,255,0.0)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: scrolled ? '70px' : '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'height 0.4s ease' }}>
        <a href="#top" style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', letterSpacing: '3px', color: scrolled ? 'var(--navy)' : '#fff', fontWeight: 400, fontStyle: 'italic' }}>
          Casa Mar
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="desktop-nav">
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              style={{ fontFamily: 'var(--sans)', fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, color: scrolled ? 'var(--navy)' : '#fff', transition: 'color 0.3s, opacity 0.3s', opacity: 0.85 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.85}>
              {s.label}
            </button>
          ))}
          <button onClick={() => scrollTo('reservar')}
            style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, padding: '12px 24px', border: `1px solid ${scrolled ? 'var(--navy)' : '#fff'}`, color: scrolled ? 'var(--navy)' : '#fff', background: 'transparent', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = scrolled ? 'var(--navy)' : '#fff'; e.currentTarget.style.color = scrolled ? '#fff' : 'var(--navy)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? 'var(--navy)' : '#fff' }}>
            Reservar Data
          </button>
        </nav>

        <button onClick={() => setOpen(!open)} className="mobile-menu" style={{ display: 'none', color: scrolled ? 'var(--navy)' : '#fff' }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: '#fff', padding: '24px 32px', borderTop: '1px solid rgba(0,0,0,0.05)' }} className="mobile-menu-panel">
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 0', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--navy)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              {s.label}
            </button>
          ))}
          <button onClick={() => scrollTo('reservar')}
            style={{ display: 'block', width: '100%', marginTop: '16px', padding: '16px', textAlign: 'center', background: 'var(--navy)', color: '#fff', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', border: 'none' }}>
            Reservar Data
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-panel { display: none !important; }
        }
      `}</style>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" style={{ position: 'relative', height: '100vh', minHeight: '640px', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${IMG.hero})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        animation: 'kenBurns 18s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(26,35,50,0.3) 0%, rgba(26,35,50,0.2) 40%, rgba(26,35,50,0.7) 100%)',
      }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', padding: '0 24px' }}>
        <div className="fade-up" style={{ maxWidth: '900px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '28px', opacity: 0.85, fontWeight: 500 }}>
            Ipioca · Maceió · Alagoas
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: '32px', letterSpacing: '-1px' }}>
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Casamentos</span><br />
            à beira-mar
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '560px', margin: '0 auto 48px', opacity: 0.9, fontWeight: 300, lineHeight: 1.8 }}>
            Uma villa histórica, uma capela à beira-mar e um salão de eventos.
            Três cenários únicos no mesmo paraíso, prontos para receber o dia mais importante da sua vida.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '18px 44px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}>
              Reservar Minha Data
            </button>
            <button onClick={() => document.querySelector('#villa')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '18px 44px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--navy)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}>
              Conhecer o Espaço
            </button>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 0.7 }}>
          <ChevronDown size={28} style={{ animation: 'float 2s ease-in-out infinite' }} />
          <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }`}</style>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: 'var(--ivory)', textAlign: 'center' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '32px', fontWeight: 600 }}>
          Bem-vindos à
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '40px', fontWeight: 300, lineHeight: 1.1 }}>
          <span style={{ fontStyle: 'italic' }}>Casa Mar</span> Ipioca
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 40px' }} />
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '24px', fontWeight: 300 }}>
          Em uma das praias mais preservadas do litoral alagoano, nasceu um lugar pensado
          para celebrar o que há de mais importante: os momentos que marcam uma vida.
        </p>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.9, fontWeight: 300 }}>
          A Casa Mar reúne em um só endereço uma villa de charme colonial, uma capela íntima
          e um salão de eventos integrado à natureza — três cenários únicos, a poucos passos do mar.
        </p>
      </div>
    </section>
  )
}

function Espaco({ id, num, titulo, subtitulo, desc, destaques, img, reverse }) {
  return (
    <section id={id} style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: reverse ? 'var(--cream)' : 'var(--ivory)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)', alignItems: 'center' }} className="espaco-grid">
        <div style={{ order: reverse ? 2 : 1 }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '20px', fontWeight: 600 }}>
            {num} — {subtitulo}
          </p>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: 'var(--navy)', marginBottom: '28px', fontWeight: 300, lineHeight: 1.1, fontStyle: 'italic' }}>
            {titulo}
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '32px' }} />
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '36px', fontWeight: 300 }}>
            {desc}
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {destaques.map((d, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.95rem', color: 'var(--text)' }}>
                <span style={{ color: 'var(--gold-dark)', fontSize: '14px', marginTop: '2px' }}>◆</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ order: reverse ? 1 : 2, position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '4/5', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', [reverse ? 'left' : 'right']: '-20px', bottom: '-20px', width: '80px', height: '80px', border: '2px solid var(--gold)', zIndex: -1 }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .espaco-grid { grid-template-columns: 1fr !important; }
          .espaco-grid > div { order: unset !important; }
        }
      `}</style>
    </section>
  )
}

function Pacotes() {
  return (
    <section id="pacotes" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: 'var(--navy)', color: '#fff', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px', fontWeight: 600 }}>
          Experiências Exclusivas
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '28px', fontWeight: 300, lineHeight: 1.1 }}>
          Pacotes <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>sob medida</span>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 36px' }} />
        <p style={{ maxWidth: '600px', margin: '0 auto 80px', fontSize: '1.05rem', opacity: 0.8, lineHeight: 1.8, fontWeight: 300 }}>
          De celebrações intimistas a grandes cerimônias, cada pacote é pensado para oferecer
          o máximo em sofisticação, privacidade e beleza natural.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px', textAlign: 'left' }}>
          {pacotes.map((p, i) => (
            <div key={i} style={{
              background: p.destaque ? 'rgba(212,184,140,0.08)' : 'rgba(255,255,255,0.03)',
              border: p.destaque ? '1px solid rgba(212,184,140,0.4)' : '1px solid rgba(255,255,255,0.08)',
              padding: 'clamp(32px, 4vw, 48px)',
              position: 'relative',
            }}>
              {p.destaque && (
                <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%) translateY(-50%)', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 20px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mais escolhido
                </div>
              )}
              <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', fontWeight: 500 }}>
                {p.tagline}
              </p>
              <h3 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 300, fontStyle: 'italic' }}>
                {p.nome}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '24px', opacity: 0.85 }}>
                {p.convidados}
              </p>
              <div style={{ width: '40px', height: '1px', background: 'rgba(212,184,140,0.5)', marginBottom: '24px' }} />
              <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.8, marginBottom: '28px', fontWeight: 300 }}>
                {p.desc}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                {p.inclui.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: '12px', padding: '8px 0', fontSize: '0.9rem', opacity: 0.85 }}>
                    <span style={{ color: 'var(--gold)' }}>◆</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ display: 'block', width: '100%', textAlign: 'center', padding: '16px', background: p.destaque ? 'var(--gold)' : 'transparent', color: p.destaque ? 'var(--navy)' : '#fff', border: p.destaque ? 'none' : '1px solid rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { if (!p.destaque) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--navy)' } else { e.currentTarget.style.background = 'var(--gold-dark)' }}}
                onMouseLeave={e => { if (!p.destaque) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' } else { e.currentTarget.style.background = 'var(--gold)' }}}>
                Ver Datas Disponíveis
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Galeria() {
  const imgs = [IMG.hero, IMG.villa, IMG.capela, IMG.salao, IMG.pool, IMG.noite]
  return (
    <section id="galeria" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '28px', fontWeight: 600 }}>
          Momentos
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '28px', fontWeight: 300 }}>
          <span style={{ fontStyle: 'italic' }}>Galeria</span>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 80px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {imgs.map((src, i) => (
            <div key={i} style={{ aspectRatio: i % 3 === 0 ? '3/4' : '1/1', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Parallax() {
  return (
    <section className="parallax-bg" style={{
      height: '60vh', minHeight: '400px',
      backgroundImage: `url(${IMG.pool})`,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,35,50,0.5)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', color: '#fff' }}>
        <div style={{ maxWidth: '700px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px', fontWeight: 600 }}>
            Promessa
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, lineHeight: 1.3, fontStyle: 'italic' }}>
            "Acreditamos que cada casamento merece um cenário tão único quanto a história dos noivos."
          </h2>
        </div>
      </div>
    </section>
  )
}

function Contato() {
  return (
    <section id="contato" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '28px', fontWeight: 600 }}>
          Agende uma visita
        </p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '28px', fontWeight: 300, lineHeight: 1.1 }}>
          Vamos <span style={{ fontStyle: 'italic' }}>conversar</span>
        </h2>
        <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 36px' }} />
        <p style={{ maxWidth: '560px', margin: '0 auto 60px', color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 300 }}>
          Entre em contato e agende uma visita guiada à Casa Mar.
          Nossa equipe está pronta para tornar o seu dia inesquecível.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          <div style={{ padding: '32px', background: '#fff', textAlign: 'center' }}>
            <MessageCircle size={28} style={{ color: 'var(--gold-dark)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '12px' }}>WhatsApp</p>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--serif)' }}>
              {WHATSAPP_NUMBER}
            </a>
          </div>
          <div style={{ padding: '32px', background: '#fff', textAlign: 'center' }}>
            <MapPin size={28} style={{ color: 'var(--gold-dark)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '12px' }}>Localização</p>
            <p style={{ fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--serif)' }}>
              Praia de Ipioca<br />Maceió — AL
            </p>
          </div>
          <div style={{ padding: '32px', background: '#fff', textAlign: 'center' }}>
            <Instagram size={28} style={{ color: 'var(--gold-dark)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '12px' }}>Instagram</p>
            <a href="https://instagram.com/casamaripioca" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--serif)' }}>
              @casamaripioca
            </a>
          </div>
        </div>

        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '22px 56px', background: 'var(--navy)', color: '#fff', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-soft)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}>
          <MessageCircle size={18} />
          Falar Agora no WhatsApp
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#fff', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px', textAlign: 'left' }}>
          <div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--gold)', marginBottom: '16px' }}>Casa Mar</p>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.8 }}>
              Villa, Capela e Salão de Eventos<br />
              Praia de Ipioca, Maceió — AL
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Navegação</p>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                onClick={e => { e.preventDefault(); document.querySelector(`#${s.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ display: 'block', fontSize: '14px', opacity: 0.7, padding: '4px 0', transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                {s.label}
              </a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Contato</p>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '14px', opacity: 0.7, padding: '4px 0' }}>
              {WHATSAPP_NUMBER}
            </a>
            <a href="https://instagram.com/casamaripioca" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '14px', opacity: 0.7, padding: '4px 0' }}>
              @casamaripioca
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', textAlign: 'center', fontSize: '12px', opacity: 0.5 }}>
          © 2026 Casa Mar Ipioca. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

function FloatingWhatsApp() {
  return (
    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '60px', height: '60px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,0.4)', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      aria-label="WhatsApp">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Intro />

      <Espaco
        id="villa"
        num="01"
        subtitulo="A Villa"
        titulo="Uma casa que respira história"
        desc="A villa principal, com arquitetura colonial preservada e vista privilegiada para o mar, acomoda os noivos e padrinhos em suítes de charme. Jardins tropicais, piscina de borda infinita e varandas integram a natureza ao conforto."
        destaques={['Suítes privativas com vista para o mar', 'Piscina de borda infinita e área gourmet', 'Jardins tropicais exclusivos', 'Arquitetura colonial restaurada']}
        img={IMG.villa}
      />

      <Espaco
        id="capela"
        num="02"
        subtitulo="A Capela"
        titulo="O altar perfeito para o sim"
        desc="A Capela de Ipioca é o cenário ideal para cerimônias religiosas ou ecumênicas. Com estilo rústico-elegante e janelas voltadas para o mar, oferece a intimidade e a espiritualidade que um momento tão sagrado pede."
        destaques={['Capacidade para até 80 convidados', 'Janelas com vista direta para o mar', 'Arquitetura rústico-elegante', 'Atmosfera íntima e espiritual']}
        img={IMG.capela}
        reverse
      />

      <Espaco
        id="salao"
        num="03"
        subtitulo="O Salão de Eventos"
        titulo="Onde a festa ganha vida"
        desc="Um salão integrado à paisagem, com pé-direito alto e portas de vidro que se abrem para o jardim. Flexível para recepções intimistas ou grandes celebrações, com infraestrutura completa de som, iluminação e climatização."
        destaques={['Capacidade até 300 convidados', 'Pé-direito alto e ambiente integrado', 'Infraestrutura completa para eventos', 'Cozinha industrial para buffets']}
        img={IMG.salao}
      />

      <Parallax />

      <Pacotes />

      <BookingSystem />

      <Galeria />

      <Contato />

      <Footer />

      <FloatingWhatsApp />
    </>
  )
}
