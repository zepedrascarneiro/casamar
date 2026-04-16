import { useState, useMemo } from 'react'
import { Calendar, Check, X as XIcon, ChevronLeft, ChevronRight, Users, MapPin, Clock, ArrowLeft, ArrowRight as ArrowRightIcon, Lock } from 'lucide-react'

// Datas já reservadas (ficará vermelho)
const RESERVADAS = [
  '2026-06-14', '2026-07-19', '2026-08-09',
  '2026-10-11', '2026-12-20', '2027-02-14',
]

// Preços base por pacote (sinal = 20% do pacote)
const PACOTES_PRECO = {
  destination: { base: 12000, nome: 'Destination', maxGuests: 4, desc: 'Cerimônia intimista com até 4 convidados' },
  essencial:   { base: 45000, nome: 'Essencial',   maxGuests: 50, desc: 'Cerimônia + recepção até 50 convidados' },
  premium:     { base: 95000, nome: 'Premium',     maxGuests: 300, desc: 'Grande celebração até 300 convidados' },
}

// Tiers de preço por tipo de data
const TIERS = {
  alta: { label: 'Alta Temporada', mult: 1.3, color: '#c9885c', bg: 'rgba(201,136,92,0.15)' },
  media: { label: 'Média Temporada', mult: 1.0, color: '#d4b88c', bg: 'rgba(212,184,140,0.15)' },
  baixa: { label: 'Baixa Temporada', mult: 0.85, color: '#8fa586', bg: 'rgba(143,165,134,0.15)' },
}

// Retorna tier de preço baseado na data
function getTier(date) {
  const m = date.getMonth()
  const d = date.getDay()
  // Fins de semana em Dez/Jan/Fev/Jun/Jul = ALTA
  if ([11, 0, 1, 5, 6].includes(m) && (d === 5 || d === 6)) return 'alta'
  // Fins de semana em geral = MÉDIA
  if (d === 5 || d === 6) return 'media'
  // Dias de semana = BAIXA
  return 'baixa'
}

function formatDate(d) {
  return d.toISOString().slice(0, 10)
}

function formatDateBR(d) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

function CalendarGrid({ selectedPackage, onDateSelect, selectedDate }) {
  const [month, setMonth] = useState(new Date(2026, 5, 1)) // Junho 2026

  const daysInMonth = useMemo(() => {
    const year = month.getFullYear()
    const m = month.getMonth()
    const first = new Date(year, m, 1)
    const last = new Date(year, m + 1, 0)
    const startPadding = first.getDay()
    const days = []

    for (let i = 0; i < startPadding; i++) days.push(null)
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, m, i))
    return days
  }, [month])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + 60) // Mínimo 60 dias de antecedência

  const goPrev = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  const goNext = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))

  const monthName = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const basePrice = PACOTES_PRECO[selectedPackage]?.base || 0

  return (
    <div style={{ background: '#fff', padding: 'clamp(24px, 4vw, 40px)', border: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={goPrev} style={{ padding: '10px', background: 'transparent', color: 'var(--navy)', display: 'flex', alignItems: 'center' }}
          disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)}>
          <ChevronLeft size={24} />
        </button>
        <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--navy)', textTransform: 'capitalize', fontWeight: 400 }}>
          {monthName}
        </h4>
        <button onClick={goNext} style={{ padding: '10px', background: 'transparent', color: 'var(--navy)', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Weekdays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '2px', color: 'var(--text-subtle)', padding: '8px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {daysInMonth.map((d, i) => {
          if (!d) return <div key={i} />

          const iso = formatDate(d)
          const isReserved = RESERVADAS.includes(iso)
          const isPast = d < minDate
          const tier = getTier(d)
          const price = basePrice * TIERS[tier].mult
          const isSelected = selectedDate && formatDate(selectedDate) === iso
          const disabled = isReserved || isPast

          return (
            <button key={i}
              onClick={() => !disabled && onDateSelect(d)}
              disabled={disabled}
              style={{
                aspectRatio: '1',
                padding: '8px 4px',
                background: isSelected ? 'var(--navy)' : isReserved ? '#fee' : disabled ? '#f5f5f5' : TIERS[tier].bg,
                color: isSelected ? '#fff' : isReserved ? '#c94444' : disabled ? '#bbb' : 'var(--navy)',
                border: isSelected ? '2px solid var(--gold)' : `1px solid ${isReserved ? '#fcc' : disabled ? '#eee' : TIERS[tier].color + '40'}`,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                transition: 'all 0.15s',
                fontSize: '14px', fontWeight: 500,
                position: 'relative',
              }}
              onMouseEnter={e => { if (!disabled && !isSelected) e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <span>{d.getDate()}</span>
              {!disabled && !isSelected && (
                <span style={{ fontSize: '8px', opacity: 0.7, marginTop: '2px' }}>
                  {TIERS[tier].label.split(' ')[0].slice(0, 3).toUpperCase()}
                </span>
              )}
              {isReserved && <span style={{ fontSize: '8px', marginTop: '2px' }}>RESERVADO</span>}
            </button>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>
        {Object.entries(TIERS).map(([k, t]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '14px', background: t.bg, border: `1px solid ${t.color}` }} />
            <span>{t.label} — {formatCurrency(basePrice * t.mult)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', background: '#fee', border: '1px solid #fcc' }} />
          <span>Reservado</span>
        </div>
      </div>
    </div>
  )
}

function Step1_Package({ onSelect, selected }) {
  return (
    <div>
      <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
        Passo 1 de 3
      </p>
      <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '16px', fontWeight: 300, fontStyle: 'italic' }}>
        Qual o seu sonho?
      </h3>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 60px', lineHeight: 1.8 }}>
        Escolha o pacote que melhor se encaixa na sua celebração. Você ajusta detalhes depois.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
        {Object.entries(PACOTES_PRECO).map(([key, pkg]) => (
          <button key={key} onClick={() => onSelect(key)}
            style={{
              padding: '36px 28px',
              background: selected === key ? 'var(--navy)' : '#fff',
              color: selected === key ? '#fff' : 'var(--navy)',
              border: selected === key ? '2px solid var(--gold)' : '1px solid rgba(0,0,0,0.08)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}>
            <Users size={24} style={{ color: selected === key ? 'var(--gold)' : 'var(--gold-dark)', marginBottom: '20px' }} />
            <h4 style={{ fontSize: '1.5rem', fontFamily: 'var(--serif)', fontStyle: 'italic', marginBottom: '8px', fontWeight: 400 }}>{pkg.nome}</h4>
            <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '16px' }}>
              Até {pkg.maxGuests} convidados
            </p>
            <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.7, marginBottom: '20px' }}>
              {pkg.desc}
            </p>
            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: selected === key ? 'var(--gold)' : 'var(--gold-dark)', fontWeight: 600 }}>
              A partir de {formatCurrency(pkg.base * 0.85)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function Step2_Date({ selectedPackage, onDateSelect, selectedDate }) {
  return (
    <div>
      <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
        Passo 2 de 3
      </p>
      <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '16px', fontWeight: 300, fontStyle: 'italic' }}>
        Escolha sua data
      </h3>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 40px', lineHeight: 1.8 }}>
        O preço varia conforme a temporada. Datas em vermelho já estão reservadas. Antecedência mínima de 60 dias.
      </p>

      <CalendarGrid selectedPackage={selectedPackage} onDateSelect={onDateSelect} selectedDate={selectedDate} />
    </div>
  )
}

function Step3_Confirm({ selectedPackage, selectedDate, onConfirm, onSubmit }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [sending, setSending] = useState(false)

  const pkg = PACOTES_PRECO[selectedPackage]
  const tier = getTier(selectedDate)
  const totalPrice = pkg.base * TIERS[tier].mult
  const sinal = totalPrice * 0.2

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    const data = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem: form.mensagem,
      pacote: pkg.nome,
      data_evento: formatDateBR(selectedDate),
      preco_total: formatCurrency(totalPrice),
      sinal: formatCurrency(sinal),
      _subject: `Nova Reserva Casa Mar — ${pkg.nome} — ${formatDateBR(selectedDate)}`,
      _template: 'box',
      _captcha: 'false',
    }

    try {
      await fetch('https://formsubmit.co/ajax/zepedrascarneiro@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
      onConfirm(data)
    } catch (err) {
      alert('Erro ao enviar. Tente pelo WhatsApp.')
      setSending(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
        Passo 3 de 3
      </p>
      <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '48px', fontWeight: 300, fontStyle: 'italic' }}>
        Confirme sua reserva
      </h3>

      {/* Resumo */}
      <div style={{ background: 'var(--cream)', padding: 'clamp(28px, 4vw, 48px)', marginBottom: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px' }}>Resumo</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Pacote</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--navy)', fontStyle: 'italic' }}>{pkg.nome}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Data</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', color: 'var(--navy)', textTransform: 'capitalize', textAlign: 'right' }}>{formatDateBR(selectedDate)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Temporada</span>
          <span style={{ color: TIERS[tier].color, fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>{TIERS[tier].label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Valor total estimado</span>
          <span style={{ color: 'var(--navy)', fontSize: '1.3rem', fontFamily: 'var(--serif)' }}>{formatCurrency(totalPrice)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0 0', background: 'rgba(212,184,140,0.15)', margin: '16px -20px 0', padding: '24px 20px' }}>
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dark)', display: 'block', marginBottom: '4px' }}>Sinal para reservar</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>20% do valor total · restante no evento</span>
          </div>
          <span style={{ color: 'var(--navy)', fontSize: '2rem', fontFamily: 'var(--serif)', fontWeight: 500 }}>{formatCurrency(sinal)}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
            placeholder="Seu nome completo"
            style={inputStyle} />
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="E-mail"
            style={inputStyle} />
        </div>
        <input required value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })}
          placeholder="WhatsApp com DDD"
          style={inputStyle} />
        <textarea rows={3} value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })}
          placeholder="Alguma observação? (opcional)"
          style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} />

        <div style={{ background: 'rgba(212,184,140,0.1)', border: '1px solid rgba(212,184,140,0.3)', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', marginTop: '8px' }}>
          <Lock size={18} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Ao confirmar, você será redirecionado para o pagamento do sinal via <strong style={{ color: 'var(--navy)' }}>Mercado Pago</strong>.
            Após a confirmação, você receberá por e-mail o <strong style={{ color: 'var(--navy)' }}>contrato prévio de reserva</strong> com sua data bloqueada exclusivamente.
          </p>
        </div>

        <button type="submit" disabled={sending}
          style={{
            padding: '22px', background: 'var(--navy)', color: '#fff',
            fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600,
            border: 'none', cursor: sending ? 'wait' : 'pointer',
            marginTop: '12px', transition: 'background 0.3s',
          }}
          onMouseEnter={e => { if (!sending) e.currentTarget.style.background = 'var(--navy-soft)' }}
          onMouseLeave={e => { if (!sending) e.currentTarget.style.background = 'var(--navy)' }}>
          {sending ? 'Processando...' : `Pagar sinal de ${formatCurrency(sinal)} e reservar`}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  border: '1px solid rgba(0,0,0,0.1)',
  background: '#fff',
  fontSize: '14px',
  fontFamily: 'var(--sans)',
  color: 'var(--navy)',
  outline: 'none',
}

function SuccessScreen({ data, onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(143,165,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
        <Check size={36} style={{ color: '#8fa586' }} />
      </div>
      <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', marginBottom: '20px', fontWeight: 300, fontStyle: 'italic' }}>
        Solicitação recebida!
      </h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.05rem' }}>
        Recebemos sua solicitação de reserva para o pacote <strong style={{ color: 'var(--navy)' }}>{data.pacote}</strong> na data <strong style={{ color: 'var(--navy)' }}>{data.data_evento}</strong>.
      </p>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '40px' }}>
        Em instantes você receberá um e-mail com:
      </p>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '48px', display: 'inline-block', textAlign: 'left' }}>
        {['Link de pagamento do sinal via Mercado Pago', 'Contrato prévio de reserva', 'Próximos passos e documentação'].map((item, i) => (
          <li key={i} style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)' }}>
            <Check size={16} style={{ color: 'var(--gold-dark)' }} />
            {item}
          </li>
        ))}
      </ul>
      <p style={{ fontSize: '13px', color: 'var(--text-subtle)', marginBottom: '32px' }}>
        Verifique sua caixa de entrada e a caixa de spam.
      </p>
      <button onClick={onReset}
        style={{ padding: '16px 40px', background: 'transparent', color: 'var(--navy)', border: '1px solid var(--navy)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>
        Nova simulação
      </button>
    </div>
  )
}

export default function BookingSystem() {
  const [step, setStep] = useState(1)
  const [pkg, setPkg] = useState(null)
  const [date, setDate] = useState(null)
  const [confirmed, setConfirmed] = useState(null)

  const handlePackageSelect = (key) => {
    setPkg(key)
    setTimeout(() => setStep(2), 300)
  }

  const handleDateSelect = (d) => {
    setDate(d)
    setTimeout(() => setStep(3), 400)
  }

  const reset = () => {
    setStep(1)
    setPkg(null)
    setDate(null)
    setConfirmed(null)
  }

  return (
    <section id="reservar" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Título da seção */}
        {!confirmed && (
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '24px', fontWeight: 600 }}>
              Reserve sua data
            </p>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '24px', fontWeight: 300 }}>
              <span style={{ fontStyle: 'italic' }}>Garanta</span> seu dia
            </h2>
            <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 28px' }} />
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Em 3 passos simples: escolha seu pacote, selecione uma data disponível
              e garanta sua reserva com o pagamento do sinal.
            </p>
          </div>
        )}

        {/* Progresso */}
        {!confirmed && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: step >= n ? 'var(--navy)' : 'transparent',
                  border: `1px solid ${step >= n ? 'var(--navy)' : 'rgba(0,0,0,0.15)'}`,
                  color: step >= n ? '#fff' : 'var(--text-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontFamily: 'var(--serif)',
                }}>{n}</div>
                {n < 3 && <div style={{ width: '40px', height: '1px', background: step > n ? 'var(--navy)' : 'rgba(0,0,0,0.1)' }} />}
              </div>
            ))}
          </div>
        )}

        {/* Conteúdo */}
        {confirmed ? (
          <SuccessScreen data={confirmed} onReset={reset} />
        ) : step === 1 ? (
          <Step1_Package onSelect={handlePackageSelect} selected={pkg} />
        ) : step === 2 ? (
          <Step2_Date selectedPackage={pkg} onDateSelect={handleDateSelect} selectedDate={date} />
        ) : (
          <Step3_Confirm selectedPackage={pkg} selectedDate={date} onConfirm={setConfirmed} />
        )}

        {/* Navegação */}
        {!confirmed && step > 1 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => setStep(step - 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              <ArrowLeft size={14} /> Voltar
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
