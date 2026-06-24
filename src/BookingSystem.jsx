import { useState, useMemo } from 'react'
import { Check, X as XIcon, ChevronLeft, ChevronRight, Clock, ArrowLeft, Lock, Copy, MessageCircle, Calendar } from 'lucide-react'

// ============ CONFIGURAÇÃO DE PAGAMENTO ============
const PIX_CHAVE = '52846555000152'
const PIX_CHAVE_FORMATADA = '52.846.555/0001-52'
const PIX_TITULAR = 'Praia Cervejeira Ipioca'
const REEMBOLSO_MESES = 6
const EMAIL_RECEBEDOR = 'zepedrascarneiro@gmail.com'
const COPIAS_INTERNAS = ['raissarprt@gmail.com']
const WHATSAPP_NUMBER = '+55 82 98833-0033'
// ====================================================

// Datas já reservadas
const RESERVADAS = [
  '2026-06-14', '2026-07-19', '2026-08-09',
  '2026-10-11', '2026-12-20', '2027-02-14',
]

function formatDate(d) {
  return d.toISOString().slice(0, 10)
}

function formatDateBR(d) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

// ============ CALENDÁRIO ============
function CalendarGrid({ onDateSelect, selectedDates, multiSelect, maxDates }) {
  const [month, setMonth] = useState(new Date(2026, 5, 1))

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
  minDate.setDate(minDate.getDate() + 30)

  const goPrev = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  const goNext = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
  const monthName = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const selectedIsos = (selectedDates || []).map(d => formatDate(d))

  return (
    <div style={{ background: '#fff', padding: 'clamp(24px, 4vw, 40px)', border: '1px solid rgba(0,0,0,0.06)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '2px', color: 'var(--text-subtle)', padding: '8px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {daysInMonth.map((d, i) => {
          if (!d) return <div key={i} />

          const iso = formatDate(d)
          const isReserved = RESERVADAS.includes(iso)
          const isPast = d < minDate
          const isSelected = selectedIsos.includes(iso)
          const disabled = isReserved || isPast
          const isSat = d.getDay() === 6
          const isSun = d.getDay() === 0
          const isWeekend = isSat || isSun

          return (
            <button key={i}
              onClick={() => !disabled && onDateSelect(d)}
              disabled={disabled}
              style={{
                aspectRatio: '1',
                padding: '8px 4px',
                background: isSelected ? 'var(--navy)' : isReserved ? '#fee' : disabled ? '#f5f5f5' : isWeekend ? 'rgba(212,184,140,0.12)' : '#fff',
                color: isSelected ? '#fff' : isReserved ? '#c94444' : disabled ? '#bbb' : 'var(--navy)',
                border: isSelected ? '2px solid var(--gold)' : isReserved ? '1px solid #fcc' : `1px solid ${disabled ? '#eee' : 'rgba(0,0,0,0.06)'}`,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                transition: 'all 0.15s',
                fontSize: '14px', fontWeight: 500,
              }}
              onMouseEnter={e => { if (!disabled && !isSelected) e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <span>{d.getDate()}</span>
              {isReserved && <span style={{ fontSize: '7px', marginTop: '2px' }}>RESERVADO</span>}
              {isSelected && <span style={{ fontSize: '7px', marginTop: '2px' }}>✓</span>}
            </button>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '16px 24px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }} />
          <span>Disponível</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', background: 'rgba(212,184,140,0.12)', border: '1px solid rgba(0,0,0,0.06)' }} />
          <span>Fim de semana</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '14px', background: '#fee', border: '1px solid #fcc' }} />
          <span>Reservado</span>
        </div>
        {multiSelect && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '14px', background: 'var(--navy)', border: '2px solid var(--gold)' }} />
            <span>Selecionado ({selectedIsos.length}/{maxDates})</span>
          </div>
        )}
      </div>
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

// ============ FLUXO DESTINATION WEDDING (Capela / CasAMar) ============
function DestinationFlow({ produto, onConfirm, onBack }) {
  const [step, setStep] = useState(1) // 1=addon, 2=calendar, 3=form
  const [selectedAddons, setSelectedAddons] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [sending, setSending] = useState(false)

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    )
  }

  const sinalValue = produto.preco
  const totalSteps = 3

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    const protocolo = `CMI-${Date.now().toString(36).toUpperCase()}`
    const validadeReserva = new Date()
    validadeReserva.setHours(validadeReserva.getHours() + 48)
    const limiteReembolso = new Date(selectedDate)
    limiteReembolso.setMonth(limiteReembolso.getMonth() - REEMBOLSO_MESES)

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
      `Produto: ${produto.nome} — ${produto.local}`,
      `Capacidade: até 20 pessoas`,
      `Data escolhida: ${formatDateBR(selectedDate)}`,
      `Horário da cerimônia: ${produto.horario}`,
      `Local: Casa Mar Ipioca — Praia de Ipioca, Maceió/AL`,
      selectedAddons.length > 0 ? `Pacotes adicionais de interesse: ${selectedAddons.join('; ')}` : '',
      '',
      '━━━ PAGAMENTO — SINAL ━━━',
      `Valor do sinal (aluguel do espaço): ${formatCurrency(sinalValue)}`,
      '',
      `  → Pague via PIX para confirmar sua data.`,
      `  → Envie o comprovante pelo WhatsApp: ${WHATSAPP_NUMBER}`,
      '',
      `Chave PIX (CNPJ): ${PIX_CHAVE_FORMATADA}`,
      `Titular: ${PIX_TITULAR}`,
      '',
      '━━━ CONDIÇÕES ━━━',
      '1. A pré-reserva é válida por 48 horas.',
      `   Expira em: ${validadeReserva.toLocaleString('pt-BR')}`,
      '2. A data só é confirmada após recebimento do PIX.',
      `3. Cancelamentos até ${limiteReembolso.toLocaleDateString('pt-BR')} (${REEMBOLSO_MESES} meses antes) são reembolsados integralmente.`,
      '',
      `Observações: ${form.mensagem || '(nenhuma)'}`,
      '',
      'Casa Mar Ipioca | casamaripioca.com.br',
      '═══════════════════════════════════════',
    ].filter(Boolean).join('\n')

    const data = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem: form.mensagem || '(sem observação)',
      produto: `${produto.nome} — ${produto.local}`,
      data_evento: formatDateBR(selectedDate),
      horario: produto.horario,
      valor_sinal: formatCurrency(sinalValue),
      addons: selectedAddons.length > 0 ? selectedAddons.join('; ') : 'Nenhum',
      protocolo,
      contrato_previo: contratoPrevio,
      _subject: `Nova Pré-Reserva — ${produto.nome} ${produto.local} — ${formatDateBR(selectedDate)} [${protocolo}]`,
      _template: 'box',
      _captcha: 'false',
      _cc: [form.email, ...COPIAS_INTERNAS].join(','),
    }

    try {
      await fetch(`https://formsubmit.co/ajax/${EMAIL_RECEBEDOR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
      onConfirm({ ...data, sinalValue })
    } catch {
      alert('Erro ao enviar. Tente pelo WhatsApp: ' + WHATSAPP_NUMBER)
      setSending(false)
    }
  }

  return (
    <div>
      {/* Progresso */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
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

      {/* Passo 1 - Escolher add-ons */}
      {step === 1 && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
            Passo 1 de {totalSteps}
          </p>
          <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '16px', fontWeight: 300, fontStyle: 'italic' }}>
            Personalize seu pacote
          </h3>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            O aluguel do espaço <strong style={{ color: 'var(--navy)' }}>{produto.local}</strong> inclui apenas a cerimônia (até 20 pessoas).
            Deseja adicionar algum pacote extra? (opcional)
          </p>

          {/* Resumo do produto */}
          <div style={{ background: 'var(--cream)', padding: '24px', marginBottom: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '4px' }}>
                  {produto.nome}
                </p>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                  {produto.local}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--navy)', fontWeight: 500 }}>
                {formatCurrency(produto.preco)}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={14} style={{ color: 'var(--gold-dark)' }} />
              <span>Horários disponíveis: {produto.horario}</span>
            </div>
          </div>

          {/* Add-ons */}
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600 }}>
            Pacotes adicionais (à parte)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {produto.addons.map((addon, i) => {
              const isChecked = selectedAddons.includes(addon)
              return (
                <button key={i} onClick={() => toggleAddon(addon)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '20px', background: isChecked ? 'rgba(26,35,50,0.04)' : '#fff',
                    border: isChecked ? '2px solid var(--navy)' : '1px solid rgba(0,0,0,0.08)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '4px', flexShrink: 0,
                    background: isChecked ? 'var(--navy)' : '#fff',
                    border: isChecked ? 'none' : '1px solid rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isChecked && <Check size={14} style={{ color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>{addon}</span>
                </button>
              )
            })}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px', fontStyle: 'italic' }}>
            Os valores dos pacotes adicionais serão informados pela nossa equipe após a reserva.
          </p>

          <button onClick={() => setStep(2)}
            style={{ display: 'block', width: '100%', padding: '20px', background: 'var(--navy)', color: '#fff', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}>
            Escolher Data
          </button>
        </div>
      )}

      {/* Passo 2 - Calendário */}
      {step === 2 && (
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
            Passo 2 de {totalSteps}
          </p>
          <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '16px', fontWeight: 300, fontStyle: 'italic' }}>
            Escolha sua data
          </h3>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            Selecione a data desejada para sua cerimônia. Datas em vermelho já estão reservadas. Antecedência mínima de 30 dias.
          </p>

          <CalendarGrid
            onDateSelect={(d) => { setSelectedDate(d); setTimeout(() => setStep(3), 400) }}
            selectedDates={selectedDate ? [selectedDate] : []}
          />
        </div>
      )}

      {/* Passo 3 - Formulário + Pagamento */}
      {step === 3 && selectedDate && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
            Passo 3 de {totalSteps}
          </p>
          <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '48px', fontWeight: 300, fontStyle: 'italic' }}>
            Confirme sua reserva
          </h3>

          {/* Resumo */}
          <div style={{ background: 'var(--cream)', padding: 'clamp(24px, 4vw, 40px)', marginBottom: '32px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '16px' }}>Resumo</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Produto</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--navy)', fontStyle: 'italic', textAlign: 'right' }}>{produto.nome} — {produto.local}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Data</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--navy)', textTransform: 'capitalize', textAlign: 'right' }}>{formatDateBR(selectedDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Horário</span>
              <span style={{ color: 'var(--navy)', fontSize: '14px' }}>{produto.horario}</span>
            </div>
            {selectedAddons.length > 0 && (
              <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Pacotes adicionais (orçamento à parte)</span>
                {selectedAddons.map((a, i) => (
                  <p key={i} style={{ fontSize: '0.9rem', color: 'var(--navy)', paddingLeft: '12px' }}>◆ {a}</p>
                ))}
              </div>
            )}

            {/* Valor do sinal */}
            <div style={{ marginTop: '16px', padding: '20px', background: 'rgba(212,184,140,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, display: 'block' }}>SINAL — Aluguel do espaço</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pagamento via PIX para confirmar a data</span>
                </div>
                <span style={{ fontSize: '1.5rem', fontFamily: 'var(--serif)', color: 'var(--navy)', fontWeight: 500 }}>{formatCurrency(sinalValue)}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome completo" style={inputStyle} />
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="E-mail" style={inputStyle} />
            </div>
            <input required value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })}
              placeholder="WhatsApp com DDD" style={inputStyle} />
            <textarea rows={3} value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })}
              placeholder="Alguma observação? (opcional)"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} />

            <div style={{ background: 'rgba(212,184,140,0.1)', border: '1px solid rgba(212,184,140,0.3)', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', marginTop: '8px' }}>
              <Lock size={18} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Ao confirmar, você receberá por e-mail o <strong style={{ color: 'var(--navy)' }}>contrato prévio</strong> com seu protocolo e a chave PIX para pagamento de <strong style={{ color: 'var(--navy)' }}>{formatCurrency(sinalValue)}</strong>. Sua data fica reservada por 48 horas. Reembolso integral em cancelamentos até {REEMBOLSO_MESES} meses antes do evento.
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
              {sending ? 'Processando...' : `Confirmar reserva · ${formatCurrency(sinalValue)}`}
            </button>
          </form>
        </div>
      )}

      {/* Voltar */}
      {step > 1 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => setStep(step - 1)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <ArrowLeft size={14} /> Voltar
          </button>
        </div>
      )}
    </div>
  )
}

// ============ FLUXO PRÉ WEDDING (3 datas + WhatsApp) ============
function PreWeddingFlow({ onBack }) {
  const [selectedDates, setSelectedDates] = useState([])
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const MAX_DATES = 3

  const handleDateSelect = (d) => {
    const iso = formatDate(d)
    setSelectedDates(prev => {
      const exists = prev.find(p => formatDate(p) === iso)
      if (exists) return prev.filter(p => formatDate(p) !== iso)
      if (prev.length >= MAX_DATES) return prev
      return [...prev, d].sort((a, b) => a - b)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedDates.length === 0) {
      alert('Por favor, selecione pelo menos 1 data (até 3).')
      return
    }
    setSending(true)

    const protocolo = `PW-${Date.now().toString(36).toUpperCase()}`
    const datasFormatadas = selectedDates.map(d => formatDateBR(d)).join('\n   ')

    const primeiraData = selectedDates[0]
    const confirmacao = new Date(primeiraData)
    confirmacao.setDate(confirmacao.getDate() - 30)

    const data = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem: form.mensagem || '(sem observação)',
      produto: 'Pré Wedding — Sessão de Fotos',
      datas_escolhidas: datasFormatadas,
      data_confirmacao: `Confirmação até ${confirmacao.toLocaleDateString('pt-BR')} (30 dias antes da 1ª data)`,
      protocolo,
      _subject: `Pré Wedding — Sessão de Fotos — ${form.nome} [${protocolo}]`,
      _template: 'box',
      _captcha: 'false',
      _cc: [form.email, ...COPIAS_INTERNAS].join(','),
    }

    try {
      await fetch(`https://formsubmit.co/ajax/${EMAIL_RECEBEDOR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      })
      setSent(true)
    } catch {
      alert('Erro ao enviar. Tente pelo WhatsApp: ' + WHATSAPP_NUMBER)
      setSending(false)
    }
  }

  if (sent) {
    const msg = encodeURIComponent(`Olá! Acabei de solicitar um Pré Wedding — Sessão de Fotos pelo site. Minhas datas preferidas:\n${selectedDates.map(d => '• ' + formatDateBR(d)).join('\n')}\n\nNome: ${form.nome}\nTelefone: ${form.telefone}`)
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(143,165,134,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Check size={36} style={{ color: '#8fa586' }} />
        </div>
        <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', marginBottom: '20px', fontWeight: 300, fontStyle: 'italic' }}>
          Solicitação enviada!
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '16px' }}>
          Recebemos suas {selectedDates.length} datas preferidas. A confirmação será feita com <strong style={{ color: 'var(--navy)' }}>30 dias de antecedência</strong> da primeira data escolhida.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '8px' }}>
          Se houver casamento agendado em alguma dessas datas, entraremos em contato para reagendar.
        </p>

        <div style={{ background: 'var(--cream)', padding: '24px', margin: '32px 0', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'left' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '12px', fontWeight: 600 }}>Suas datas</p>
          {selectedDates.map((d, i) => (
            <p key={i} style={{ padding: '8px 0', borderBottom: i < selectedDates.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', color: 'var(--navy)', textTransform: 'capitalize' }}>
              {i + 1}ª opção: <strong>{formatDateBR(d)}</strong>
            </p>
          ))}
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Para agilizar, envie uma mensagem no WhatsApp:
        </p>

        <a href={`https://api.whatsapp.com/send?phone=5582988330033&text=${msg}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 44px', background: '#25D366', color: '#fff', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1fba59'}
          onMouseLeave={e => e.currentTarget.style.background = '#25D366'}>
          <MessageCircle size={18} />
          Falar no WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--serif)', color: 'var(--navy)', textAlign: 'center', marginBottom: '16px', fontWeight: 300, fontStyle: 'italic' }}>
        Pré Wedding — Sessão de Fotos
      </h3>

      {/* Info do produto */}
      <div style={{ background: 'var(--cream)', padding: '24px', marginBottom: '32px', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '8px', fontWeight: 500 }}>
          A partir de R$ 600
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Incluso: 3 ambientes (Capela + Salão + CasAMar) + 10 fotos (2h de duração)
        </p>
      </div>

      {/* Explicação */}
      <div style={{ background: 'rgba(212,184,140,0.1)', border: '1px solid rgba(212,184,140,0.3)', padding: '20px', marginBottom: '32px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Calendar size={18} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Escolha até <strong style={{ color: 'var(--navy)' }}>3 datas possíveis</strong>. Como casamentos têm prioridade, podemos precisar reagendar. A confirmação da data acontece com <strong style={{ color: 'var(--navy)' }}>30 dias de antecedência</strong> da primeira opção.
        </p>
      </div>

      {/* Calendário */}
      <CalendarGrid
        onDateSelect={handleDateSelect}
        selectedDates={selectedDates}
        multiSelect
        maxDates={MAX_DATES}
      />

      {/* Datas selecionadas */}
      {selectedDates.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '20px', marginTop: '24px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '12px', fontWeight: 600 }}>
            Datas selecionadas ({selectedDates.length}/{MAX_DATES})
          </p>
          {selectedDates.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < selectedDates.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ color: 'var(--navy)', textTransform: 'capitalize' }}>{i + 1}ª opção: {formatDateBR(d)}</span>
              <button onClick={() => setSelectedDates(prev => prev.filter(p => formatDate(p) !== formatDate(d)))}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <XIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulário */}
      {selectedDates.length > 0 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '4px', fontWeight: 600 }}>
            Seus dados
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Seu nome completo" style={inputStyle} />
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="E-mail" style={inputStyle} />
          </div>
          <input required value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })}
            placeholder="WhatsApp com DDD" style={inputStyle} />
          <textarea rows={2} value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })}
            placeholder="Alguma observação? (opcional)"
            style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }} />

          <button type="submit" disabled={sending}
            style={{
              padding: '20px', background: 'var(--navy)', color: '#fff',
              fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600,
              border: 'none', cursor: sending ? 'wait' : 'pointer', marginTop: '8px',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = 'var(--navy-soft)' }}
            onMouseLeave={e => { if (!sending) e.currentTarget.style.background = 'var(--navy)' }}>
            {sending ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      )}
    </div>
  )
}

// ============ TELA DE SUCESSO (Destination Wedding) ============
function SuccessScreen({ data, onReset }) {
  const [copiado, setCopiado] = useState(false)

  const copiarPix = () => {
    navigator.clipboard.writeText(PIX_CHAVE).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2400)
    })
  }

  const whatsappMsg = encodeURIComponent(`Olá! Acabei de fazer a pré-reserva pelo site.\nProtocolo: ${data.protocolo}\nProduto: ${data.produto}\nData: ${data.data_evento}\nNome: ${data.nome}`)

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
          <strong style={{ color: 'var(--navy)' }}>{data.produto}</strong> · <strong style={{ color: 'var(--navy)' }}>{data.data_evento}</strong>
        </p>
        <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--gold-dark)', marginTop: '16px', fontWeight: 600 }}>
          PROTOCOLO: {data.protocolo}
        </p>
      </div>

      {/* Sinal */}
      <div style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(28px, 4vw, 40px)', textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
          Sinal — Aluguel do espaço
        </p>
        <p style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontFamily: 'var(--serif)', fontWeight: 500, marginBottom: '8px' }}>
          {data.valor_sinal}
        </p>
        <p style={{ fontSize: '13px', opacity: 0.7, letterSpacing: '1px' }}>
          Pagamento em até 48h para confirmar a data
        </p>
      </div>

      {/* PIX */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: 'clamp(24px, 4vw, 40px)', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '20px', fontWeight: 600 }}>
          Pagamento via PIX
        </p>

        <div style={{ padding: 'clamp(20px, 3vw, 28px)', background: 'var(--cream)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Chave PIX (CNPJ)
            </p>
            <p style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600 }}>
              {data.valor_sinal}
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
          Após o pagamento, envie o <strong style={{ color: 'var(--navy)' }}>comprovante pelo WhatsApp</strong> citando o protocolo acima.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <a href={`https://api.whatsapp.com/send?phone=5582988330033&text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          padding: '20px', background: '#25D366', color: '#fff',
          fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600,
          marginBottom: '24px', transition: 'all 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1fba59'}
        onMouseLeave={e => e.currentTarget.style.background = '#25D366'}>
        <MessageCircle size={18} />
        Enviar Comprovante no WhatsApp
      </a>

      {/* Reembolso */}
      <div style={{ background: 'rgba(143,165,134,0.12)', border: '1px solid rgba(143,165,134,0.3)', padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Check size={18} style={{ color: '#5f7d5a', flexShrink: 0, marginTop: '3px' }} />
        <p style={{ fontSize: '13px', color: 'var(--navy)', lineHeight: 1.7 }}>
          <strong>Reembolso integral garantido.</strong> Cancelamentos até <strong>{REEMBOLSO_MESES} meses antes</strong> da data do evento são reembolsados 100%.
        </p>
      </div>

      {/* E-mail */}
      <div style={{ background: 'rgba(212,184,140,0.1)', border: '1px solid rgba(212,184,140,0.3)', padding: '24px', marginBottom: '32px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Check size={20} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600, marginBottom: '4px' }}>
            Contrato prévio enviado por e-mail
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Uma cópia com todos os detalhes foi enviada para <strong>{data.email}</strong>. Verifique também a caixa de spam.
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

// ============ COMPONENTE PRINCIPAL ============
export default function BookingSystem({ selectedProduct, onClear }) {
  const [confirmed, setConfirmed] = useState(null)

  const reset = () => {
    setConfirmed(null)
    onClear()
  }

  const hasProduct = selectedProduct && (selectedProduct.flow === 'booking' || selectedProduct.flow === 'prewedding')

  return (
    <section id="reservar" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: 'var(--ivory)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '24px', fontWeight: 600 }}>
            Reserve sua data
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--navy)', marginBottom: '24px', fontWeight: 300 }}>
            <span style={{ fontStyle: 'italic' }}>Garanta</span> seu dia
          </h2>
          <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '0 auto 28px' }} />

          {!hasProduct && !confirmed && (
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Escolha um pacote acima para iniciar sua reserva, ou entre em contato pelo WhatsApp.
            </p>
          )}
        </div>

        {/* Conteúdo */}
        {confirmed ? (
          <SuccessScreen data={confirmed} onReset={reset} />
        ) : hasProduct && selectedProduct.flow === 'booking' ? (
          <DestinationFlow
            produto={selectedProduct}
            onConfirm={setConfirmed}
            onBack={onClear}
          />
        ) : hasProduct && selectedProduct.flow === 'prewedding' ? (
          <PreWeddingFlow onBack={onClear} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => document.querySelector('#pacotes')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                padding: '20px 44px', background: 'var(--navy)', color: '#fff',
                fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'background 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}>
              <Calendar size={18} />
              Ver Pacotes
            </button>
          </div>
        )}

        {/* Botão voltar aos pacotes */}
        {hasProduct && !confirmed && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button onClick={onClear}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              <ArrowLeft size={14} /> Voltar aos pacotes
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
