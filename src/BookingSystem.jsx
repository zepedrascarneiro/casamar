import { useState, useMemo } from 'react'
import { Calendar, Check, X as XIcon, ChevronLeft, ChevronRight, Users, MapPin, Clock, ArrowLeft, ArrowRight as ArrowRightIcon, Lock, Copy } from 'lucide-react'

// ============ CONFIGURAÇÃO DE PAGAMENTO ============
// Taxa fixa de PRÉ-RESERVA em R$ (descontada do sinal ao firmar contrato)
const TAXA_PRE_RESERVA = 1000
// Percentual do sinal formal cobrado ao firmar o contrato definitivo
const SINAL_PERCENTUAL = 0.20
// Chave PIX (CNPJ)
const PIX_CHAVE = '52846555000152'
const PIX_CHAVE_FORMATADA = '52.846.555/0001-52'
const PIX_TITULAR = 'Praia Cervejeira Ipioca'
// Prazo (meses antes do evento) para reembolso integral em caso de cancelamento
const REEMBOLSO_MESES = 6
// E-mail principal para onde a reserva é enviada
const EMAIL_RECEBEDOR = 'zepedrascarneiro@gmail.com'
// Cópias internas enviadas em paralelo (além do cliente)
const COPIAS_INTERNAS = ['raissarprt@gmail.com']
// ====================================================

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
  const preReserva = TAXA_PRE_RESERVA // valor pago agora para bloquear a data
  const sinalFormal = totalPrice * SINAL_PERCENTUAL // 20% do total (cobrado ao firmar contrato)
  const sinalRestante = Math.max(0, sinalFormal - preReserva) // sinal menos o que já foi pago
  const saldoEvento = totalPrice - sinalFormal // pago no dia do evento

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    const protocolo = `CMI-${Date.now().toString(36).toUpperCase()}`
    const validadeReserva = new Date()
    validadeReserva.setHours(validadeReserva.getHours() + 48)

    // Data limite para reembolso integral (6 meses antes do evento)
    const limiteReembolso = new Date(selectedDate)
    limiteReembolso.setMonth(limiteReembolso.getMonth() - REEMBOLSO_MESES)

    // Contrato Prévio de Reserva (enviado por e-mail)
    const contratoPrevio = [
      '═══════════════════════════════════════',
      '   CONTRATO PRÉVIO DE PRÉ-RESERVA',
      '   CASA MAR IPIOCA — EVENTOS',
      '═══════════════════════════════════════',
      '',
      `Protocolo: ${protocolo}`,
      `Emitido em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      '━━━ DADOS DO(A) CONTRATANTE ━━━',
      `Nome: ${form.nome}`,
      `E-mail: ${form.email}`,
      `WhatsApp: ${form.telefone}`,
      '',
      '━━━ DETALHES DO EVENTO ━━━',
      `Pacote: ${pkg.nome}`,
      `Capacidade: até ${pkg.maxGuests} convidados`,
      `Data escolhida: ${formatDateBR(selectedDate)}`,
      `Temporada: ${TIERS[tier].label}`,
      `Local: Casa Mar Ipioca — Praia de Ipioca, Maceió/AL`,
      '',
      '━━━ VALORES E CRONOGRAMA DE PAGAMENTO ━━━',
      `Valor estimado total do evento: ${formatCurrency(totalPrice)}`,
      '',
      `  1) AGORA — TAXA DE PRÉ-RESERVA: ${formatCurrency(preReserva)}`,
      '     Paga via PIX para bloquear sua data por 48 horas.',
      '     Este valor será DESCONTADO do sinal formal.',
      '',
      `  2) AO FIRMAR CONTRATO — SINAL (20%): ${formatCurrency(sinalFormal)}`,
      `     Deste valor, a pré-reserva (${formatCurrency(preReserva)}) já foi paga.`,
      `     Restante a pagar nesta etapa: ${formatCurrency(sinalRestante)}`,
      '',
      `  3) NO DIA DO EVENTO — SALDO: ${formatCurrency(saldoEvento)}`,
      '     Equivalente a 80% do valor total do evento.',
      '',
      '━━━ PAGAMENTO DA PRÉ-RESERVA (somente PIX) ━━━',
      `Chave PIX (CNPJ): ${PIX_CHAVE_FORMATADA}`,
      `Titular: ${PIX_TITULAR}`,
      `Valor: ${formatCurrency(preReserva)}`,
      '',
      '━━━ CONDIÇÕES ━━━',
      '1. Esta PRÉ-RESERVA é provisória e fica válida por 48 horas.',
      `   Expira em: ${validadeReserva.toLocaleString('pt-BR')}`,
      '2. A data só é bloqueada EXCLUSIVAMENTE após confirmação do PIX.',
      `3. REEMBOLSO: cancelamentos solicitados até`,
      `   ${limiteReembolso.toLocaleDateString('pt-BR')} (${REEMBOLSO_MESES} meses antes do evento)`,
      '   são reembolsados INTEGRALMENTE. Após essa data, não reembolsável.',
      '4. Após o pagamento será emitido o contrato definitivo com todos',
      '   os detalhes, itens inclusos, cláusulas e cronograma.',
      '5. Observações do(a) contratante:',
      `   ${form.mensagem || '(nenhuma)'}`,
      '',
      '━━━ PRÓXIMOS PASSOS ━━━',
      `→ Efetue o PIX de ${formatCurrency(preReserva)} nas próximas 48 horas.`,
      '→ Envie o comprovante para o WhatsApp: +55 82 98833-0033',
      '→ Aguarde o contrato definitivo (até 24h após o comprovante).',
      '',
      'Casa Mar Ipioca | casamaripioca.com.br',
      'Praia de Ipioca — Maceió/AL',
      '═══════════════════════════════════════',
    ].join('\n')

    const data = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem: form.mensagem || '(sem observação)',
      pacote: pkg.nome,
      data_evento: formatDateBR(selectedDate),
      temporada: TIERS[tier].label,
      valor_total: formatCurrency(totalPrice),
      pre_reserva: formatCurrency(preReserva),
      sinal_formal: formatCurrency(sinalFormal),
      sinal_restante: formatCurrency(sinalRestante),
      saldo_evento: formatCurrency(saldoEvento),
      protocolo,
      contrato_previo: contratoPrevio,
      _subject: `Nova Pré-Reserva Casa Mar — ${pkg.nome} — ${formatDateBR(selectedDate)} [${protocolo}]`,
      _template: 'box',
      _captcha: 'false',
      // Cópias simultâneas: cliente + equipe interna (Raíssa)
      _cc: [form.email, ...COPIAS_INTERNAS].join(','),
    }

    try {
      await fetch(`https://formsubmit.co/ajax/${EMAIL_RECEBEDOR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
      onConfirm({ ...data, pre_reserva_valor: preReserva, data_evento_obj: selectedDate })
    } catch (err) {
      alert('Erro ao enviar. Tente pelo WhatsApp: +55 82 98833-0033')
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
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Valor estimado do evento</span>
          <span style={{ color: 'var(--navy)', fontSize: '1.3rem', fontFamily: 'var(--serif)' }}>{formatCurrency(totalPrice)}</span>
        </div>

        {/* Mini-cronograma de pagamentos */}
        <div style={{ margin: '16px -20px 0', padding: '24px 20px', background: 'rgba(212,184,140,0.15)' }}>
          <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600 }}>
            Cronograma de pagamento
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, display: 'block' }}>AGORA · Pré-reserva</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Via PIX · bloqueia a data</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontFamily: 'var(--serif)', color: 'var(--navy)', fontWeight: 500 }}>{formatCurrency(preReserva)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', opacity: 0.85 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>AO FIRMAR CONTRATO · Sinal (20%)</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Descontada a pré-reserva, restam {formatCurrency(sinalRestante)}</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontFamily: 'var(--serif)', color: 'var(--text-muted)' }}>{formatCurrency(sinalFormal)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', opacity: 0.85 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>NO DIA DO EVENTO · Saldo (80%)</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontFamily: 'var(--serif)', color: 'var(--text-muted)' }}>{formatCurrency(saldoEvento)}</span>
          </div>
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
            Ao confirmar, você receberá por e-mail o <strong style={{ color: 'var(--navy)' }}>contrato prévio de pré-reserva</strong> com seu protocolo único e a chave PIX para pagamento de <strong style={{ color: 'var(--navy)' }}>{formatCurrency(preReserva)}</strong>. Sua data fica pré-reservada por 48 horas. O valor é descontado do sinal de 20% quando o contrato definitivo for firmado. Reembolso integral em cancelamentos até {REEMBOLSO_MESES} meses antes do evento.
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
          {sending ? 'Processando...' : `Confirmar pré-reserva · ${formatCurrency(preReserva)}`}
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
  const [copiado, setCopiado] = useState(false)

  const copiarPix = () => {
    navigator.clipboard.writeText(PIX_CHAVE).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2400)
    })
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 8px' }}>
      {/* Sucesso */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(143,165,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Check size={36} style={{ color: '#8fa586' }} />
        </div>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', marginBottom: '20px', fontWeight: 300, fontStyle: 'italic' }}>
          Reserva pré-confirmada
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          Pacote <strong style={{ color: 'var(--navy)' }}>{data.pacote}</strong> · Data <strong style={{ color: 'var(--navy)' }}>{data.data_evento}</strong>
        </p>
        <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--gold-dark)', marginTop: '16px', fontWeight: 600 }}>
          PROTOCOLO: {data.protocolo}
        </p>
      </div>

      {/* Pré-reserva em destaque */}
      <div style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
          Pré-reserva · descontada do sinal ao firmar contrato
        </p>
        <p style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontFamily: 'var(--serif)', fontWeight: 500, marginBottom: '8px' }}>
          {data.pre_reserva}
        </p>
        <p style={{ fontSize: '13px', opacity: 0.7, letterSpacing: '1px' }}>
          Pagamento em até 48h para bloquear a data
        </p>
      </div>

      {/* Pagamento — somente PIX */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: 'clamp(24px, 4vw, 40px)', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '20px', fontWeight: 600 }}>
          Pagamento da pré-reserva via PIX
        </p>

        <div style={{ padding: 'clamp(20px, 3vw, 28px)', background: 'var(--cream)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Chave PIX (CNPJ)
            </p>
            <p style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600 }}>
              {data.pre_reserva}
            </p>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '14px' }}>
            Titular: <strong>{PIX_TITULAR}</strong>
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <code style={{ flex: '1 1 240px', padding: '16px 18px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'monospace', fontSize: '15px', color: 'var(--navy)', wordBreak: 'break-all', letterSpacing: '0.5px' }}>
              {PIX_CHAVE_FORMATADA}
            </code>
            <button onClick={copiarPix}
              style={{
                padding: '16px 22px', background: copiado ? '#8fa586' : 'var(--navy)',
                color: '#fff', fontSize: '11px', letterSpacing: '2px',
                textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
              }}>
              {copiado ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          Após o pagamento, envie o <strong style={{ color: 'var(--navy)' }}>comprovante pelo WhatsApp <a href="https://wa.me/5582988330033" style={{ color: 'var(--gold-dark)' }}>+55 82 98833-0033</a></strong> citando o protocolo acima. Em até 24h você recebe o contrato definitivo.
        </p>
      </div>

      {/* Próximas etapas de pagamento */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600 }}>
          Próximas etapas
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 600 }}>Ao firmar contrato · Sinal (20%)</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Menos a pré-reserva já paga → restante de {data.sinal_restante}</p>
          </div>
          <span style={{ fontSize: '1.05rem', fontFamily: 'var(--serif)', color: 'var(--navy)' }}>{data.sinal_formal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0' }}>
          <p style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 600 }}>No dia do evento · Saldo (80%)</p>
          <span style={{ fontSize: '1.05rem', fontFamily: 'var(--serif)', color: 'var(--navy)' }}>{data.saldo_evento}</span>
        </div>
      </div>

      {/* Cláusula de reembolso */}
      <div style={{ background: 'rgba(143,165,134,0.12)', border: '1px solid rgba(143,165,134,0.3)', padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Check size={18} style={{ color: '#5f7d5a', flexShrink: 0, marginTop: '3px' }} />
        <p style={{ fontSize: '13px', color: 'var(--navy)', lineHeight: 1.7 }}>
          <strong>Reembolso integral garantido.</strong> Em caso de cancelamento solicitado até <strong>{REEMBOLSO_MESES} meses antes</strong> da data do evento, a pré-reserva é devolvida 100%.
        </p>
      </div>

      {/* Contrato enviado */}
      <div style={{ background: 'rgba(212,184,140,0.1)', border: '1px solid rgba(212,184,140,0.3)', padding: '24px', marginBottom: '32px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Check size={20} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600, marginBottom: '4px' }}>
            Contrato prévio enviado por e-mail
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Uma cópia com todos os detalhes da reserva, condições e instruções foi enviada para <strong>{data.email}</strong>. Verifique também a caixa de spam.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onReset}
          style={{ padding: '16px 40px', background: 'transparent', color: 'var(--navy)', border: '1px solid var(--navy)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>
          Nova simulação
        </button>
      </div>
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
