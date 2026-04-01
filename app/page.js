'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = {
  bg: '#060E1F',
  bgCard: 'rgba(15,37,87,0.35)',
  bgCardHover: 'rgba(15,37,87,0.55)',
  border: 'rgba(106,173,255,0.15)',
  borderActive: 'rgba(106,173,255,0.4)',
  accent: '#6AADFF',
  accentDark: '#2B5CE6',
  red: '#CC0000',
  text: '#FFFFFF',
  textMuted: '#8899AA',
  textLight: '#A8D4FF',
  gradient: 'linear-gradient(135deg, #060E1F 0%, #0F2557 50%, #0D1E45 100%)',
  btnGradient: 'linear-gradient(135deg, #2B5CE6 0%, #1B3A8C 100%)',
};

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Cascadia Code", Consolas, monospace';

const EVENT_DATE = new Date('2026-09-28T09:00:00-03:00');

const REGIONS = ['SP Capital', 'SP Interior', 'RJ', 'MG', 'Sul', 'Norte', 'Nordeste', 'Centro-Oeste'];

const AGENDA_DAY1 = [
  { time: '08h - 09h', title: 'Credenciamento', location: 'Hall Principal', icon: '🎫', cat: 'logistics' },
  { time: '09h - 10h', title: 'Abertura Oficial', location: 'Plenária Principal', icon: '🎤', cat: 'main' },
  { time: '10h - 11h30', title: 'Palestra "Estratégias 2027"', location: 'Plenária Principal', icon: '📊', cat: 'main' },
  { time: '11h30 - 12h', title: 'Coffee Break', location: 'Área de Convivência', icon: '☕', cat: 'break' },
  { time: '12h - 13h30', title: 'Almoço', location: 'Restaurante', icon: '🍽️', cat: 'break' },
  { time: '14h - 16h', title: 'Workshops Simultâneos', location: 'Salas 1-4', icon: '💡', cat: 'workshop' },
  { time: '16h - 18h', title: 'Rota de Vendas — Feira de Fornecedores', location: 'Pavilhão de Exposições', icon: '🏪', cat: 'fair' },
  { time: '20h - 00h', title: 'Festa de Abertura', location: 'Área Externa', icon: '🎉', cat: 'social' },
];

const AGENDA_DAY2 = [
  { time: '09h - 10h30', title: 'Palestra Motivacional', location: 'Plenária Principal', icon: '🔥', cat: 'main' },
  { time: '10h30 - 11h', title: 'Coffee Break', location: 'Área de Convivência', icon: '☕', cat: 'break' },
  { time: '11h - 12h30', title: 'Painéis Temáticos', location: 'Salas 1-3', icon: '🗣️', cat: 'workshop' },
  { time: '12h30 - 14h', title: 'Almoço', location: 'Restaurante', icon: '🍽️', cat: 'break' },
  { time: '14h - 15h30', title: 'Premiações e Reconhecimentos', location: 'Plenária Principal', icon: '🏆', cat: 'main' },
  { time: '15h30 - 16h30', title: 'Encerramento', location: 'Plenária Principal', icon: '👏', cat: 'main' },
];

const STANDS = [
  { id: 1, name: 'Samsung', num: 'A-01', cat: 'Eletrônicos' },
  { id: 2, name: 'LG', num: 'A-02', cat: 'Eletrônicos' },
  { id: 3, name: 'Brastemp', num: 'A-03', cat: 'Eletrodomésticos' },
  { id: 4, name: 'Consul', num: 'A-04', cat: 'Eletrodomésticos' },
  { id: 5, name: 'Electrolux', num: 'B-01', cat: 'Eletrodomésticos' },
  { id: 6, name: 'Philips', num: 'B-02', cat: 'Eletrônicos' },
  { id: 7, name: 'Sony', num: 'B-03', cat: 'Eletrônicos' },
  { id: 8, name: 'Motorola', num: 'B-04', cat: 'Celulares' },
  { id: 9, name: 'Apple', num: 'C-01', cat: 'Celulares' },
  { id: 10, name: 'Tramontina', num: 'C-02', cat: 'Utilidades' },
  { id: 11, name: 'Mondial', num: 'C-03', cat: 'Eletrodomésticos' },
  { id: 12, name: 'Multilaser', num: 'C-04', cat: 'Eletrônicos' },
];

const FEED_POSTS = [
  { id: 1, user: 'Mariana Silva', initials: 'MS', color: '#E63946', time: 'Agora', text: 'Acabei de chegar no Tauá! O credenciamento está super rápido. Impressionada com a estrutura do evento! 🏨✨', likes: 24, comments: 5, photo: false },
  { id: 2, user: 'Carlos Mendes', initials: 'CM', color: '#457B9D', time: '5 min', text: 'Workshop de negociação foi incrível! Muitas dicas práticas para aplicar no dia a dia. #ConvençãoCB2026', likes: 18, comments: 3, photo: true, photoColor: '#1D3557' },
  { id: 3, user: 'Ana Beatriz', initials: 'AB', color: '#2A9D8F', time: '15 min', text: 'Alguém mais animado para a festa de abertura hoje à noite? 🎉🎶', likes: 42, comments: 12, photo: false },
  { id: 4, user: 'Roberto Alves', initials: 'RA', color: '#E9C46A', time: '30 min', text: 'A palestra sobre Estratégias 2027 abriu minha mente. O futuro do varejo é agora! Parabéns aos organizadores. 👏', likes: 31, comments: 7, photo: true, photoColor: '#264653' },
  { id: 5, user: 'Juliana Costa', initials: 'JC', color: '#F4A261', time: '1h', text: 'Já visitei 8 estandes! Quem vai bater meu recorde? 😄 A Rota de Vendas está demais!', likes: 15, comments: 4, photo: false },
  { id: 6, user: 'Equipe Organização', initials: 'EO', color: '#CC0000', time: '2h', text: '📢 Lembrete: A Plenária Principal começa às 9h em ponto amanhã. Não percam a palestra motivacional! Boa noite a todos! 🌙', likes: 56, comments: 8, photo: false },
];

const FAQ_ITEMS = [
  { q: 'Qual a senha do Wi-Fi do evento?', a: 'Rede: CB_Convenção2026 | Senha: vendas2026! — Disponível em todas as áreas do hotel.' },
  { q: 'Qual o dress code do evento?', a: 'Dia 1 e 2: Smart Casual (evitar chinelos e bermudas). Festa de Abertura: Casual/Esporte fino.' },
  { q: 'Há estacionamento no local?', a: 'Sim! O Tauá Hotel dispõe de estacionamento gratuito para todos os participantes. Vagas limitadas — chegue cedo.' },
  { q: 'Qual o horário de check-in no hotel?', a: 'Check-in a partir das 14h no dia 27/09 (véspera). Check-out até 12h do dia 29/09.' },
  { q: 'As refeições estão incluídas?', a: 'Sim! Café da manhã, almoço, coffee breaks e jantar estão inclusos para todos os participantes credenciados.' },
  { q: 'O que devo levar?', a: 'Documento com foto, confirmação de inscrição (digital ou impressa), roupas adequadas ao dress code e itens pessoais.' },
  { q: 'Contato para emergências?', a: 'Central do Evento: (11) 99999-0000 (WhatsApp). Disponível 24h durante os dias do evento.' },
  { q: 'Como usar o app durante o evento?', a: 'Navegue pelas seções usando o menu inferior. Use o QR Code de identificação nos estandes e atividades. Acompanhe a agenda e o feed em tempo real.' },
];

const MAP_AREAS = [
  { id: 'plenaria', name: 'Plenária Principal', x: 10, y: 10, w: 45, h: 25, color: '#2B5CE6', desc: 'Capacidade: 1.500 pessoas. Palco principal, telões laterais e sistema de som profissional.' },
  { id: 'sala1', name: 'Sala 1', x: 58, y: 10, w: 18, h: 12, color: '#457B9D', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala2', name: 'Sala 2', x: 78, y: 10, w: 18, h: 12, color: '#457B9D', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala3', name: 'Sala 3', x: 58, y: 25, w: 18, h: 12, color: '#457B9D', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'sala4', name: 'Sala 4', x: 78, y: 25, w: 18, h: 12, color: '#457B9D', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'restaurante', name: 'Restaurante', x: 10, y: 40, w: 35, h: 18, color: '#2A9D8F', desc: 'Restaurante principal — Buffet completo, almoço e jantar inclusos.' },
  { id: 'convivencia', name: 'Área de Convivência', x: 48, y: 40, w: 25, h: 18, color: '#E9C46A', desc: 'Espaço para coffee breaks, networking e descanso.' },
  { id: 'pavilhao', name: 'Pavilhão de Exposições', x: 10, y: 62, w: 55, h: 22, color: '#E76F51', desc: '50+ estandes de fornecedores. Rota de Vendas e feira de exposições.' },
  { id: 'externa', name: 'Área Externa', x: 68, y: 55, w: 28, h: 30, color: '#F4A261', desc: 'Área ao ar livre — Festa de abertura, atividades de integração e lazer.' },
  { id: 'recepcao', name: 'Recepção / Credenciamento', x: 10, y: 88, w: 86, h: 10, color: '#CC0000', desc: 'Entrada principal — Credenciamento, distribuição de crachás e kits.' },
];

// ─── Helper Components ───────────────────────────────────────────────────────

function QRPlaceholder({ size = 80 }) {
  const cells = [];
  // deterministic pseudo-random pattern
  const seed = [1,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1];
  const grid = 8;
  const cellSize = size / grid;
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const corner = (r < 3 && c < 3) || (r < 3 && c >= grid - 3) || (r >= grid - 3 && c < 3);
      const filled = corner || seed[(r * grid + c) % seed.length];
      if (filled) {
        cells.push({ x: c * cellSize, y: r * cellSize, s: cellSize });
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 4, background: 'white' }}>
      {cells.map((cell, i) => (
        <rect key={i} x={cell.x} y={cell.y} width={cell.s} height={cell.s} fill="#060E1F" />
      ))}
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const [section, setSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [agendaDay, setAgendaDay] = useState(1);
  const [regForm, setRegForm] = useState({ nome: '', email: '', telefone: '', empresa: '', cargo: '', regional: '' });
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [faqOpen, setFaqOpen] = useState(-1);
  const [mapSelected, setMapSelected] = useState(null);
  const [visitedStands, setVisitedStands] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostText, setNewPostText] = useState('');
  const [logisticsTab, setLogisticsTab] = useState('aereo');
  const [hoveredNav, setHoveredNav] = useState(null);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = EVENT_DATE - now;
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const navigate = useCallback((s) => { setSection(s); setMenuOpen(false); window.scrollTo(0, 0); }, []);

  // ── Shared styles ──────────────────────────────────────────────────────────

  const pageWrap = {
    minHeight: '100vh',
    background: COLORS.gradient,
    color: COLORS.text,
    fontFamily: FONT,
    paddingBottom: 80,
  };

  const sectionTitle = {
    fontSize: 'clamp(22px, 5vw, 32px)',
    fontWeight: 800,
    marginBottom: 4,
    letterSpacing: '-0.01em',
  };

  const sectionSub = {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: MONO,
    letterSpacing: '0.05em',
    marginBottom: 28,
  };

  const card = {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '16px 18px',
    marginBottom: 12,
    transition: 'all 0.2s ease',
  };

  const btnPrimary = {
    background: COLORS.btnGradient,
    color: 'white',
    border: `1px solid ${COLORS.borderActive}`,
    padding: '14px 32px',
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 10,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    boxShadow: '0 0 30px rgba(43,92,230,0.25)',
    transition: 'all 0.2s ease',
    fontFamily: FONT,
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(6,14,31,0.7)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONT,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const inputError = { borderColor: '#E63946' };

  const labelStyle = {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: MONO,
    letterSpacing: '0.05em',
    marginBottom: 6,
    display: 'block',
  };

  const pad = { padding: '24px 20px' };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const catColor = (cat) => {
    const m = { main: '#2B5CE6', break: '#2A9D8F', workshop: '#E9C46A', fair: '#E76F51', social: '#F4A261', logistics: '#8899AA' };
    return m[cat] || COLORS.accent;
  };

  // ── Section Renderers ──────────────────────────────────────────────────────

  const renderHome = () => (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Hero glow */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43,92,230,0.10) 0%, transparent 70%)',
        top: '5%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
      }} />

      <div style={{ padding: '60px 20px 20px' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: COLORS.textMuted, letterSpacing: '0.15em', marginBottom: 20 }}>
          GRUPO CASAS BAHIA APRESENTA
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 72px)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
          CONVENÇÃO
        </h1>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 72px)', fontWeight: 900, margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>
          DE VENDAS
        </h1>
        <h2 style={{ fontSize: 'clamp(48px, 12vw, 110px)', fontWeight: 900, margin: '0 0 8px', color: COLORS.accent, lineHeight: 1 }}>
          2026
        </h2>
        <p style={{ fontSize: 14, color: COLORS.textLight, letterSpacing: '0.1em', margin: '0 0 8px' }}>
          28 — 29 SETEMBRO 2026
        </p>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: '0 0 40px' }}>
          Tauá Hotel & Convention · Atibaia, SP
        </p>
      </div>

      {/* Countdown */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40, flexWrap: 'wrap', padding: '0 20px',
      }}>
        {[
          { val: countdown.days, label: 'DIAS' },
          { val: countdown.hours, label: 'HORAS' },
          { val: countdown.minutes, label: 'MIN' },
          { val: countdown.seconds, label: 'SEG' },
        ].map((c, i) => (
          <div key={i} style={{
            ...card, width: 72, textAlign: 'center', padding: '16px 0',
            background: 'rgba(15,37,87,0.5)', backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent, fontFamily: MONO }}>{String(c.val).padStart(2, '0')}</div>
            <div style={{ fontSize: 9, color: COLORS.textMuted, fontFamily: MONO, letterSpacing: '0.1em', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '0 20px', marginBottom: 40, maxWidth: 420, margin: '0 auto 40px',
      }}>
        {[
          { val: '1.500', label: 'Participantes', icon: '👥' },
          { val: '2', label: 'Dias', icon: '📅' },
          { val: '30+', label: 'Palestras', icon: '🎤' },
          { val: '50+', label: 'Estandes', icon: '🏪' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, textAlign: 'center', padding: '18px 12px' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 20px', maxWidth: 420, margin: '0 auto' }}>
        <button onClick={() => navigate('cadastro')} style={{ ...btnPrimary, width: '100%', marginBottom: 12 }}>
          FAZER CADASTRO
        </button>
        <button onClick={() => navigate('agenda')} style={{
          ...btnPrimary, width: '100%', background: 'transparent',
          border: `1px solid ${COLORS.borderActive}`, boxShadow: 'none',
        }}>
          VER AGENDA
        </button>
      </div>

      {/* Bottom info bar */}
      <div style={{
        margin: '40px 20px 0', ...card, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap',
        fontFamily: MONO, fontSize: 10, padding: '12px 16px',
      }}>
        <span style={{ color: COLORS.textMuted }}>GRUPO CASAS BAHIA</span>
        <span style={{ color: COLORS.accent }}>DEMO BUILD v3.0</span>
        <span style={{ color: COLORS.textMuted }}>PLATAFORMA ACAYA</span>
      </div>
    </div>
  );

  // ── CADASTRO ───────────────────────────────────────────────────────────────

  const validateReg = () => {
    const e = {};
    if (!regForm.nome.trim()) e.nome = true;
    if (!regForm.email.trim() || !regForm.email.includes('@')) e.email = true;
    if (!regForm.telefone.trim()) e.telefone = true;
    if (!regForm.empresa.trim()) e.empresa = true;
    if (!regForm.cargo.trim()) e.cargo = true;
    if (!regForm.regional) e.regional = true;
    setRegErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegSubmit = () => {
    if (validateReg()) setRegSubmitted(true);
  };

  const renderCadastro = () => (
    <div style={pad}>
      <h2 style={sectionTitle}>Cadastro</h2>
      <div style={sectionSub}>INSCRIÇÃO // CONVENÇÃO 2026</div>

      {regSubmitted ? (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: COLORS.accent }}>Cadastro Realizado!</h3>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 4 }}>
            Bem-vindo(a), <strong style={{ color: COLORS.text }}>{regForm.nome}</strong>
          </p>
          <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 24 }}>
            Enviamos um e-mail de confirmação para <strong style={{ color: COLORS.accent }}>{regForm.email}</strong>
          </p>
          <div style={{
            ...card, background: 'rgba(42,157,143,0.15)', borderColor: 'rgba(42,157,143,0.3)', padding: '16px',
            fontFamily: MONO, fontSize: 12,
          }}>
            <div style={{ color: COLORS.textMuted, marginBottom: 8 }}>CÓDIGO DE CONFIRMAÇÃO</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#2A9D8F', letterSpacing: '0.15em' }}>
              CB-2026-{Math.floor(Math.random() * 9000 + 1000)}
            </div>
          </div>
          <button onClick={() => { setRegSubmitted(false); setRegForm({ nome: '', email: '', telefone: '', empresa: '', cargo: '', regional: '' }); }}
            style={{ ...btnPrimary, marginTop: 20, background: 'transparent', border: `1px solid ${COLORS.borderActive}`, boxShadow: 'none' }}>
            NOVO CADASTRO
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {[
            { key: 'nome', label: 'NOME COMPLETO', placeholder: 'Digite seu nome completo', type: 'text' },
            { key: 'email', label: 'E-MAIL', placeholder: 'seu@email.com', type: 'email' },
            { key: 'telefone', label: 'TELEFONE', placeholder: '(11) 99999-0000', type: 'tel' },
            { key: 'empresa', label: 'EMPRESA', placeholder: 'Nome da empresa', type: 'text' },
            { key: 'cargo', label: 'CARGO', placeholder: 'Seu cargo', type: 'text' },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={regForm[f.key]}
                onChange={(e) => { setRegForm({ ...regForm, [f.key]: e.target.value }); setRegErrors({ ...regErrors, [f.key]: false }); }}
                style={{ ...inputStyle, ...(regErrors[f.key] ? inputError : {}) }}
              />
              {regErrors[f.key] && <div style={{ color: '#E63946', fontSize: 11, fontFamily: MONO, marginTop: 4 }}>Campo obrigatório</div>}
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>REGIONAL</label>
            <select
              value={regForm.regional}
              onChange={(e) => { setRegForm({ ...regForm, regional: e.target.value }); setRegErrors({ ...regErrors, regional: false }); }}
              style={{ ...inputStyle, ...(regErrors.regional ? inputError : {}), appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Selecione sua regional</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {regErrors.regional && <div style={{ color: '#E63946', fontSize: 11, fontFamily: MONO, marginTop: 4 }}>Selecione uma regional</div>}
          </div>

          <button onClick={handleRegSubmit} style={{ ...btnPrimary, width: '100%' }}>
            CONFIRMAR INSCRIÇÃO
          </button>
        </div>
      )}
    </div>
  );

  // ── AGENDA ─────────────────────────────────────────────────────────────────

  const renderAgenda = () => {
    const items = agendaDay === 1 ? AGENDA_DAY1 : AGENDA_DAY2;
    return (
      <div style={pad}>
        <h2 style={sectionTitle}>Agenda</h2>
        <div style={sectionSub}>PROGRAMAÇÃO COMPLETA</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2].map((d) => (
            <button key={d} onClick={() => setAgendaDay(d)} style={{
              flex: 1, padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: FONT, transition: 'all 0.2s',
              background: agendaDay === d ? COLORS.btnGradient : 'transparent',
              color: agendaDay === d ? 'white' : COLORS.textMuted,
              border: `1px solid ${agendaDay === d ? COLORS.borderActive : COLORS.border}`,
              boxShadow: agendaDay === d ? '0 0 20px rgba(43,92,230,0.2)' : 'none',
            }}>
              DIA {d} — {d === 1 ? '28/09' : '29/09'}
            </button>
          ))}
        </div>

        {items.map((item, i) => (
          <div key={i} style={{
            ...card, display: 'flex', gap: 14, alignItems: 'flex-start',
            borderLeft: `3px solid ${catColor(item.cat)}`,
          }}>
            <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: MONO, color: catColor(item.cat), marginBottom: 4 }}>{item.time}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>📍 {item.location}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── LOGÍSTICA ──────────────────────────────────────────────────────────────

  const renderLogistica = () => {
    const tabs = [
      { key: 'aereo', label: '✈️ Aéreo', icon: '✈️' },
      { key: 'terrestre', label: '🚌 Terrestre', icon: '🚌' },
      { key: 'hotel', label: '🏨 Hotel', icon: '🏨' },
    ];
    return (
      <div style={pad}>
        <h2 style={sectionTitle}>Logística</h2>
        <div style={sectionSub}>TRANSPORTE E HOSPEDAGEM</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setLogisticsTab(t.key)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: FONT, transition: 'all 0.2s',
              background: logisticsTab === t.key ? COLORS.btnGradient : 'transparent',
              color: logisticsTab === t.key ? 'white' : COLORS.textMuted,
              border: `1px solid ${logisticsTab === t.key ? COLORS.borderActive : COLORS.border}`,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {logisticsTab === 'aereo' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>✈️ Transporte Aéreo</span>
              <span style={{
                background: 'rgba(42,157,143,0.2)', color: '#2A9D8F', fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20, fontFamily: MONO,
              }}>CONFIRMADO</span>
            </div>
            <div style={{ ...card, background: 'rgba(6,14,31,0.5)', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>IDA — 27 SET 2026</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>GRU</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>São Paulo</div>
                  <div style={{ fontSize: 13, color: COLORS.accent, fontFamily: MONO }}>14:30</div>
                </div>
                <div style={{ textAlign: 'center', color: COLORS.textMuted }}>
                  <div style={{ fontSize: 10, fontFamily: MONO }}>1h15min</div>
                  <div>✈️ ———————</div>
                  <div style={{ fontSize: 10, fontFamily: MONO }}>LATAM 3421</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>VCP</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>Campinas</div>
                  <div style={{ fontSize: 13, color: COLORS.accent, fontFamily: MONO }}>15:45</div>
                </div>
              </div>
            </div>
            <div style={{ ...card, background: 'rgba(6,14,31,0.5)' }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>VOLTA — 29 SET 2026</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>VCP</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>Campinas</div>
                  <div style={{ fontSize: 13, color: COLORS.accent, fontFamily: MONO }}>19:00</div>
                </div>
                <div style={{ textAlign: 'center', color: COLORS.textMuted }}>
                  <div style={{ fontSize: 10, fontFamily: MONO }}>1h15min</div>
                  <div>✈️ ———————</div>
                  <div style={{ fontSize: 10, fontFamily: MONO }}>LATAM 3422</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>GRU</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>São Paulo</div>
                  <div style={{ fontSize: 13, color: COLORS.accent, fontFamily: MONO }}>20:15</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {logisticsTab === 'terrestre' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>🚌 Transporte Terrestre</span>
              <span style={{
                background: 'rgba(230,201,74,0.2)', color: '#E9C46A', fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20, fontFamily: MONO,
              }}>PENDENTE</span>
            </div>
            <div style={{ ...card, background: 'rgba(6,14,31,0.5)', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>TRANSFER AEROPORTO → HOTEL</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Ônibus Executivo</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Saída: Aeroporto VCP — 16:00</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Chegada: Tauá Hotel — ~17:30</div>
            </div>
            <div style={{ ...card, background: 'rgba(6,14,31,0.5)' }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>TRANSFER HOTEL → AEROPORTO</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Ônibus Executivo</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Saída: Tauá Hotel — 17:00</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Chegada: Aeroporto VCP — ~18:30</div>
            </div>
          </div>
        )}

        {logisticsTab === 'hotel' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>🏨 Hospedagem</span>
              <span style={{
                background: 'rgba(42,157,143,0.2)', color: '#2A9D8F', fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20, fontFamily: MONO,
              }}>CONFIRMADO</span>
            </div>
            <div style={{ ...card, background: 'rgba(6,14,31,0.5)', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Tauá Hotel & Convention</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO }}>CHECK-IN</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>27/09 — 14h</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO }}>CHECK-OUT</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>29/09 — 12h</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO }}>QUARTO</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Standard Duplo</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO }}>RESERVA</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.accent }}>TAU-88421</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: MONO, padding: '8px 0' }}>
              ℹ️ Incluso: café da manhã, Wi-Fi, acesso à área de lazer.
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── VOUCHERS ───────────────────────────────────────────────────────────────

  const renderVouchers = () => {
    const vouchers = [
      { type: 'Aéreo', icon: '✈️', code: 'VCH-AER-7721', status: 'Ativo', details: 'GRU → VCP — 27/09 14:30 | VCP → GRU — 29/09 19:00', color: '#2B5CE6' },
      { type: 'Terrestre', icon: '🚌', code: 'VCH-TER-3349', status: 'Ativo', details: 'Transfer Aeroporto ↔ Tauá Hotel (ida e volta)', color: '#E76F51' },
      { type: 'Hospedagem', icon: '🏨', code: 'VCH-HOS-5512', status: 'Ativo', details: 'Tauá Hotel — 27/09 a 29/09 — Standard Duplo', color: '#2A9D8F' },
    ];
    return (
      <div style={pad}>
        <h2 style={sectionTitle}>Vouchers</h2>
        <div style={sectionSub}>SEUS VOUCHERS DIGITAIS</div>

        {vouchers.map((v, i) => (
          <div key={i} style={{
            ...card, borderLeft: `3px solid ${v.color}`, padding: '20px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{v.icon} Voucher {v.type}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{v.details}</div>
              </div>
              <span style={{
                background: 'rgba(42,157,143,0.2)', color: '#2A9D8F', fontSize: 10, fontWeight: 700,
                padding: '3px 8px', borderRadius: 20, fontFamily: MONO,
              }}>{v.status}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <QRPlaceholder size={72} />
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 4 }}>CÓDIGO DO VOUCHER</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.accent, fontFamily: MONO, letterSpacing: '0.08em' }}>{v.code}</div>
              </div>
            </div>

            <button style={{
              width: '100%', padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'transparent', color: COLORS.accent, cursor: 'pointer',
              border: `1px solid ${COLORS.border}`, fontFamily: MONO, transition: 'all 0.2s',
            }}>
              ↓ DOWNLOAD VOUCHER
            </button>
          </div>
        ))}
      </div>
    );
  };

  // ── MAPA DO EVENTO ─────────────────────────────────────────────────────────

  const renderMapa = () => (
    <div style={pad}>
      <h2 style={sectionTitle}>Mapa do Evento</h2>
      <div style={sectionSub}>TAUÁ HOTEL & CONVENTION — LAYOUT</div>

      <div style={{
        ...card, position: 'relative', paddingBottom: '70%', overflow: 'hidden',
        background: 'rgba(6,14,31,0.6)', padding: 0,
      }}>
        <div style={{ position: 'absolute', inset: 0, padding: 8 }}>
          {MAP_AREAS.map((a) => (
            <div
              key={a.id}
              onClick={() => setMapSelected(mapSelected === a.id ? null : a.id)}
              style={{
                position: 'absolute',
                left: `${a.x}%`, top: `${a.y}%`,
                width: `${a.w}%`, height: `${a.h}%`,
                background: mapSelected === a.id ? a.color : `${a.color}33`,
                border: `2px solid ${mapSelected === a.id ? a.color : `${a.color}66`}`,
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 4, boxSizing: 'border-box',
                opacity: mapSelected && mapSelected !== a.id ? 0.4 : 1,
              }}
            >
              <span style={{
                fontSize: a.w > 30 ? 11 : 9,
                fontWeight: 700, color: 'white', textAlign: 'center',
                fontFamily: MONO, lineHeight: 1.2, textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}>
                {a.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {mapSelected && (() => {
        const area = MAP_AREAS.find((a) => a.id === mapSelected);
        return (
          <div style={{
            ...card, marginTop: 12, borderLeft: `3px solid ${area.color}`,
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{area.name}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{area.desc}</div>
          </div>
        );
      })()}

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { color: '#2B5CE6', label: 'Plenária' },
          { color: '#457B9D', label: 'Salas' },
          { color: '#2A9D8F', label: 'Alimentação' },
          { color: '#E9C46A', label: 'Convivência' },
          { color: '#E76F51', label: 'Exposições' },
          { color: '#F4A261', label: 'Área Externa' },
          { color: '#CC0000', label: 'Recepção' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: COLORS.textMuted, fontFamily: MONO }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );

  // ── QR / IDENTIFICAÇÃO ─────────────────────────────────────────────────────

  const renderQR = () => {
    const brindes = [
      { name: 'Kit Boas-vindas', collected: true },
      { name: 'Camiseta Evento', collected: true },
      { name: 'Power Bank', collected: false },
      { name: 'Ecobag', collected: true },
      { name: 'Garrafa Térmica', collected: false },
    ];
    const badges = [
      { name: 'Early Bird', icon: '🐦', earned: true },
      { name: 'Networker', icon: '🤝', earned: true },
      { name: 'Explorador', icon: '🧭', earned: visitedStands.size >= 6 },
      { name: 'Completo', icon: '⭐', earned: visitedStands.size >= 12 },
    ];
    const collected = brindes.filter((b) => b.collected).length;
    return (
      <div style={pad}>
        <h2 style={sectionTitle}>Identificação</h2>
        <div style={sectionSub}>SEU CRACHÁ DIGITAL</div>

        {/* Badge */}
        <div style={{
          ...card, textAlign: 'center', padding: '28px 20px',
          background: 'linear-gradient(135deg, rgba(15,37,87,0.6) 0%, rgba(43,92,230,0.15) 100%)',
          borderColor: COLORS.borderActive,
        }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: COLORS.red, letterSpacing: '0.15em', marginBottom: 16 }}>
            GRUPO CASAS BAHIA — CONVENÇÃO DE VENDAS 2026
          </div>
          <QRPlaceholder size={120} />
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>João da Silva</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 2 }}>Gerente de Vendas</div>
          <div style={{ fontSize: 13, color: COLORS.accent, fontFamily: MONO }}>Casas Bahia — SP Capital</div>
          <div style={{
            marginTop: 16, fontSize: 11, fontFamily: MONO, color: COLORS.textMuted,
            background: 'rgba(6,14,31,0.5)', padding: '8px 16px', borderRadius: 6, display: 'inline-block',
          }}>
            ID: CB-2026-4821
          </div>
        </div>

        {/* Brindes */}
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🎁 Brindes Coletados</div>
          <div style={{
            height: 6, background: 'rgba(6,14,31,0.5)', borderRadius: 3, marginBottom: 12, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${(collected / brindes.length) * 100}%`,
              background: COLORS.btnGradient, borderRadius: 3, transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 12 }}>
            {collected}/{brindes.length} coletados
          </div>
          {brindes.map((b, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < brindes.length - 1 ? `1px solid ${COLORS.border}` : 'none',
            }}>
              <span style={{ fontSize: 14, color: b.collected ? COLORS.text : COLORS.textMuted }}>{b.name}</span>
              <span style={{ fontSize: 18 }}>{b.collected ? '✅' : '⬜'}</span>
            </div>
          ))}
        </div>

        {/* Badges/Achievements */}
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🏅 Conquistas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {badges.map((b, i) => (
              <div key={i} style={{
                ...card, textAlign: 'center', padding: '14px 8px', marginBottom: 0,
                opacity: b.earned ? 1 : 0.35,
                borderColor: b.earned ? COLORS.borderActive : COLORS.border,
              }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: MONO, marginTop: 2 }}>
                  {b.earned ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── MAPA DE ESTANDES ───────────────────────────────────────────────────────

  const renderEstandes = () => (
    <div style={pad}>
      <h2 style={sectionTitle}>Mapa de Estandes</h2>
      <div style={sectionSub}>ROTA DE VENDAS — FEIRA DE FORNECEDORES</div>

      <div style={{
        ...card, textAlign: 'center', padding: '14px 16px', marginBottom: 20,
        background: visitedStands.size === STANDS.length ? 'rgba(42,157,143,0.15)' : COLORS.bgCard,
        borderColor: visitedStands.size === STANDS.length ? 'rgba(42,157,143,0.4)' : COLORS.border,
      }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>
          VOCÊ VISITOU
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.accent }}>
          {visitedStands.size} <span style={{ fontSize: 16, color: COLORS.textMuted }}>de {STANDS.length}</span>
        </div>
        <div style={{
          height: 6, background: 'rgba(6,14,31,0.5)', borderRadius: 3, marginTop: 10, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${(visitedStands.size / STANDS.length) * 100}%`,
            background: visitedStands.size === STANDS.length
              ? 'linear-gradient(90deg, #2A9D8F, #2B5CE6)'
              : COLORS.btnGradient,
            borderRadius: 3, transition: 'width 0.4s ease',
          }} />
        </div>
        {visitedStands.size === STANDS.length && (
          <div style={{ color: '#2A9D8F', fontSize: 13, fontWeight: 700, marginTop: 10 }}>
            🎉 Parabéns! Você completou a Rota de Vendas!
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {STANDS.map((s) => {
          const visited = visitedStands.has(s.id);
          return (
            <div
              key={s.id}
              onClick={() => {
                const next = new Set(visitedStands);
                if (visited) next.delete(s.id); else next.add(s.id);
                setVisitedStands(next);
              }}
              style={{
                ...card, marginBottom: 0, cursor: 'pointer', textAlign: 'center', padding: '16px 10px',
                borderColor: visited ? 'rgba(42,157,143,0.4)' : COLORS.border,
                background: visited ? 'rgba(42,157,143,0.12)' : COLORS.bgCard,
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                fontSize: 11, fontFamily: MONO, fontWeight: 700, color: visited ? '#2A9D8F' : COLORS.accent,
                marginBottom: 6,
              }}>
                {s.num}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: MONO, marginBottom: 8 }}>{s.cat}</div>
              <div style={{
                fontSize: 10, fontFamily: MONO, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                display: 'inline-block',
                background: visited ? 'rgba(42,157,143,0.2)' : 'rgba(106,173,255,0.1)',
                color: visited ? '#2A9D8F' : COLORS.textMuted,
              }}>
                {visited ? '✅ VISITADO' : 'VISITAR'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── FEED / TIMELINE ────────────────────────────────────────────────────────

  const renderFeed = () => (
    <div style={pad}>
      <h2 style={sectionTitle}>Feed do Evento</h2>
      <div style={sectionSub}>TIMELINE // AO VIVO</div>

      {/* New Post Composer */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: COLORS.btnGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>EU</div>
          <div style={{ flex: 1 }}>
            <textarea
              placeholder="Compartilhe algo com o evento..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              style={{
                ...inputStyle, resize: 'none', height: 60, fontSize: 14,
                background: 'rgba(6,14,31,0.4)', padding: '10px 14px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button style={{
                background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 8,
                color: COLORS.textMuted, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: FONT,
              }}>📷 Foto</button>
              <button style={{ ...btnPrimary, padding: '6px 20px', fontSize: 12 }}>
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {FEED_POSTS.map((post) => {
        const liked = likedPosts.has(post.id);
        return (
          <div key={post.id} style={{ ...card, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: post.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>{post.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{post.user}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: MONO }}>{post.time}</div>
              </div>
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.55, marginBottom: post.photo ? 12 : 0, color: 'rgba(255,255,255,0.9)' }}>
              {post.text}
            </div>

            {post.photo && (
              <div style={{
                height: 160, borderRadius: 10, marginBottom: 12,
                background: `linear-gradient(135deg, ${post.photoColor} 0%, ${post.photoColor}99 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: MONO,
              }}>
                📷 Foto do Evento
              </div>
            )}

            <div style={{
              display: 'flex', gap: 16, paddingTop: 10,
              borderTop: `1px solid ${COLORS.border}`,
            }}>
              <button
                onClick={() => {
                  const next = new Set(likedPosts);
                  if (liked) next.delete(post.id); else next.add(post.id);
                  setLikedPosts(next);
                }}
                style={{
                  background: 'transparent', border: 'none', color: liked ? '#E63946' : COLORS.textMuted,
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: FONT, transition: 'color 0.2s',
                }}
              >
                {liked ? '❤️' : '🤍'} {post.likes + (liked ? 1 : 0)}
              </button>
              <span style={{ color: COLORS.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                💬 {post.comments}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── FAQ ────────────────────────────────────────────────────────────────────

  const renderFAQ = () => (
    <div style={pad}>
      <h2 style={sectionTitle}>Perguntas Frequentes</h2>
      <div style={sectionSub}>FAQ // DÚVIDAS COMUNS</div>

      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
          style={{
            ...card, cursor: 'pointer', marginBottom: 8,
            borderColor: faqOpen === i ? COLORS.borderActive : COLORS.border,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, flex: 1, paddingRight: 12 }}>{item.q}</span>
            <span style={{
              fontSize: 18, color: COLORS.accent, transition: 'transform 0.3s',
              transform: faqOpen === i ? 'rotate(45deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}>+</span>
          </div>
          {faqOpen === i && (
            <div style={{
              marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`,
              fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6,
            }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ── SECTION ROUTER ─────────────────────────────────────────────────────────

  const sections = {
    home: renderHome,
    cadastro: renderCadastro,
    agenda: renderAgenda,
    logistica: renderLogistica,
    vouchers: renderVouchers,
    mapa: renderMapa,
    qr: renderQR,
    estandes: renderEstandes,
    feed: renderFeed,
    faq: renderFAQ,
  };

  const sectionList = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'cadastro', label: 'Cadastro', icon: '📝' },
    { key: 'agenda', label: 'Agenda', icon: '📋' },
    { key: 'logistica', label: 'Logística', icon: '🚀' },
    { key: 'vouchers', label: 'Vouchers', icon: '🎫' },
    { key: 'mapa', label: 'Mapa do Evento', icon: '🗺️' },
    { key: 'qr', label: 'Identificação', icon: '🪪' },
    { key: 'estandes', label: 'Estandes', icon: '🏪' },
    { key: 'feed', label: 'Feed', icon: '💬' },
    { key: 'faq', label: 'FAQ', icon: '❓' },
  ];

  const bottomTabs = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'agenda', label: 'Agenda', icon: '📋' },
    { key: 'mapa', label: 'Mapa', icon: '🗺️' },
    { key: 'feed', label: 'Feed', icon: '💬' },
    { key: 'menu', label: 'Menu', icon: '☰' },
  ];

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div style={pageWrap}>
      {/* Red brand bar */}
      <div style={{ height: 4, background: COLORS.red, width: '100%', position: 'sticky', top: 0, zIndex: 100 }} />

      {/* Top nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`,
        background: 'rgba(6,14,31,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 4, zIndex: 99,
      }}>
        <div
          onClick={() => navigate('home')}
          style={{ fontFamily: MONO, fontSize: 11, color: COLORS.textMuted, cursor: 'pointer', letterSpacing: '0.05em' }}
        >
          SYS.PLATFORM // CONVENÇÃO 2026
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: COLORS.accent }}>
          DEMO v3.0
        </span>
      </nav>

      {/* Page Content */}
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {sections[section] ? sections[section]() : renderHome()}
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(6,14,31,0.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          padding: '20px', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: COLORS.textMuted }}>NAVEGAÇÃO</span>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 8,
                color: COLORS.accent, padding: '8px 16px', cursor: 'pointer', fontFamily: MONO, fontSize: 12,
              }}
            >✕ FECHAR</button>
          </div>

          {sectionList.map((s, i) => (
            <button
              key={s.key}
              onClick={() => navigate(s.key)}
              onMouseEnter={() => setHoveredNav(s.key)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: section === s.key ? 'rgba(43,92,230,0.15)' : hoveredNav === s.key ? 'rgba(43,92,230,0.08)' : 'transparent',
                border: `1px solid ${section === s.key ? COLORS.borderActive : 'transparent'}`,
                borderRadius: 12, padding: '16px 18px', marginBottom: 6,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.2s ease', fontFamily: FONT,
                color: COLORS.text,
              }}
            >
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: MONO, marginTop: 2 }}>
                  {['Página inicial', 'Inscrição no evento', 'Programação completa', 'Transporte e hotel', 'Vouchers digitais', 'Layout do hotel', 'Crachá e QR', 'Feira de fornecedores', 'Timeline ao vivo', 'Dúvidas frequentes'][i]}
                </div>
              </div>
              {section === s.key && <span style={{ marginLeft: 'auto', fontSize: 10, color: COLORS.accent, fontFamily: MONO }}>ATIVO</span>}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
        background: 'rgba(6,14,31,0.95)', backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '6px 0 env(safe-area-inset-bottom, 8px)',
      }}>
        {bottomTabs.map((t) => {
          const active = t.key === 'menu' ? menuOpen : section === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'menu') { setMenuOpen(!menuOpen); }
                else { navigate(t.key); }
              }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '6px 12px', gap: 2, minWidth: 56,
                color: active ? COLORS.accent : COLORS.textMuted,
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontFamily: MONO, fontWeight: active ? 700 : 400, letterSpacing: '0.05em' }}>
                {t.label}
              </span>
              {active && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%', background: COLORS.accent, marginTop: 1,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
