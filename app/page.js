'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Design System ────────────────────────────────────────────────────────────

const C = {
  bg: '#0C0C14',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.1)',
  blue: '#5B8EEF',
  blueLight: '#84AEFF',
  blueDim: 'rgba(91,142,239,0.1)',
  red: '#C5281A',
  text: '#F0EAE0',
  textSub: '#8A8898',
  textMuted: '#4E4E60',
  success: '#3ECF94',
  successDim: 'rgba(62,207,148,0.1)',
  warning: '#F5A623',
  warningDim: 'rgba(245,166,35,0.1)',
};

const DISPLAY = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const BODY = '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const MONO = '"JetBrains Mono", "Fira Code", Consolas, monospace';

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENT_DATE = new Date('2026-09-28T09:00:00-03:00');
const REGIONS = ['SP Capital', 'SP Interior', 'RJ', 'MG', 'Sul', 'Norte', 'Nordeste', 'Centro-Oeste'];

const AGENDA_DAY1 = [
  { time: '08h – 09h', title: 'Credenciamento', location: 'Hall Principal', icon: '🎫', cat: 'logistics' },
  { time: '09h – 10h', title: 'Abertura Oficial', location: 'Plenária Principal', icon: '🎤', cat: 'main' },
  { time: '10h – 11h30', title: 'Palestra "Estratégias 2027"', location: 'Plenária Principal', icon: '📊', cat: 'main' },
  { time: '11h30 – 12h', title: 'Coffee Break', location: 'Área de Convivência', icon: '☕', cat: 'break' },
  { time: '12h – 13h30', title: 'Almoço', location: 'Restaurante', icon: '🍽️', cat: 'break' },
  { time: '14h – 16h', title: 'Workshops Simultâneos', location: 'Salas 1–4', icon: '💡', cat: 'workshop' },
  { time: '16h – 18h', title: 'Rota de Vendas — Feira de Fornecedores', location: 'Pavilhão de Exposições', icon: '🏪', cat: 'fair' },
  { time: '20h – 00h', title: 'Festa de Abertura', location: 'Área Externa', icon: '🎉', cat: 'social' },
];

const AGENDA_DAY2 = [
  { time: '09h – 10h30', title: 'Palestra Motivacional', location: 'Plenária Principal', icon: '🔥', cat: 'main' },
  { time: '10h30 – 11h', title: 'Coffee Break', location: 'Área de Convivência', icon: '☕', cat: 'break' },
  { time: '11h – 12h30', title: 'Painéis Temáticos', location: 'Salas 1–3', icon: '🗣️', cat: 'workshop' },
  { time: '12h30 – 14h', title: 'Almoço', location: 'Restaurante', icon: '🍽️', cat: 'break' },
  { time: '14h – 15h30', title: 'Premiações e Reconhecimentos', location: 'Plenária Principal', icon: '🏆', cat: 'main' },
  { time: '15h30 – 16h30', title: 'Encerramento', location: 'Plenária Principal', icon: '👏', cat: 'main' },
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
  { id: 1, user: 'Mariana Silva', initials: 'MS', color: '#C04B55', time: 'Agora', text: 'Acabei de chegar no Tauá! O credenciamento está super rápido. Impressionada com a estrutura! 🏨✨', likes: 24, comments: 5, photo: false },
  { id: 2, user: 'Carlos Mendes', initials: 'CM', color: '#3D6E8A', time: '5 min', text: 'Workshop de negociação foi incrível! Muitas dicas práticas. #ConvençãoCB2026', likes: 18, comments: 3, photo: true, photoColor: '#1A2E44' },
  { id: 3, user: 'Ana Beatriz', initials: 'AB', color: '#2A8F80', time: '15 min', text: 'Alguém mais animado para a festa de abertura hoje à noite? 🎉🎶', likes: 42, comments: 12, photo: false },
  { id: 4, user: 'Roberto Alves', initials: 'RA', color: '#B08A3A', time: '30 min', text: 'A palestra sobre Estratégias 2027 abriu minha mente. O futuro do varejo é agora! 👏', likes: 31, comments: 7, photo: true, photoColor: '#1E3040' },
  { id: 5, user: 'Juliana Costa', initials: 'JC', color: '#C4733A', time: '1h', text: 'Já visitei 8 estandes! Quem vai bater meu recorde? 😄', likes: 15, comments: 4, photo: false },
  { id: 6, user: 'Equipe Organização', initials: 'EO', color: '#C5281A', time: '2h', text: '📢 Lembrete: Plenária às 9h em ponto amanhã. Boa noite a todos! 🌙', likes: 56, comments: 8, photo: false },
];

const FAQ_ITEMS = [
  { q: 'Qual a senha do Wi-Fi do evento?', a: 'Rede: CB_Convenção2026 | Senha: vendas2026! — Disponível em todas as áreas do hotel.' },
  { q: 'Qual o dress code do evento?', a: 'Dia 1 e 2: Smart Casual. Festa de Abertura: Casual/Esporte fino.' },
  { q: 'Há estacionamento no local?', a: 'Sim! O Tauá Hotel dispõe de estacionamento gratuito. Vagas limitadas — chegue cedo.' },
  { q: 'Qual o horário de check-in no hotel?', a: 'Check-in a partir das 14h no dia 27/09. Check-out até 12h do dia 29/09.' },
  { q: 'As refeições estão incluídas?', a: 'Sim! Café da manhã, almoço, coffee breaks e jantar inclusos para todos os participantes.' },
  { q: 'O que devo levar?', a: 'Documento com foto, confirmação de inscrição, roupas adequadas e itens pessoais.' },
  { q: 'Contato para emergências?', a: 'Central do Evento: (11) 99999-0000 (WhatsApp). Disponível 24h durante o evento.' },
  { q: 'Como usar o app durante o evento?', a: 'Navegue pelo menu inferior. Use o QR Code nos estandes e acompanhe agenda e feed.' },
];

const MAP_AREAS = [
  { id: 'plenaria', name: 'Plenária Principal', x: 10, y: 10, w: 45, h: 25, color: '#5B8EEF', desc: 'Capacidade: 1.500 pessoas. Palco principal, telões laterais e sistema de som profissional.' },
  { id: 'sala1', name: 'Sala 1', x: 58, y: 10, w: 18, h: 12, color: '#7BA3FF', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala2', name: 'Sala 2', x: 78, y: 10, w: 18, h: 12, color: '#7BA3FF', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala3', name: 'Sala 3', x: 58, y: 25, w: 18, h: 12, color: '#7BA3FF', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'sala4', name: 'Sala 4', x: 78, y: 25, w: 18, h: 12, color: '#7BA3FF', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'restaurante', name: 'Restaurante', x: 10, y: 40, w: 35, h: 18, color: '#3ECF94', desc: 'Restaurante principal — Buffet completo, almoço e jantar inclusos.' },
  { id: 'convivencia', name: 'Convivência', x: 48, y: 40, w: 25, h: 18, color: '#C9A84C', desc: 'Espaço para coffee breaks, networking e descanso.' },
  { id: 'pavilhao', name: 'Pavilhão de Exposições', x: 10, y: 62, w: 55, h: 22, color: '#F5A623', desc: '50+ estandes de fornecedores. Rota de Vendas e feira de exposições.' },
  { id: 'externa', name: 'Área Externa', x: 68, y: 55, w: 28, h: 30, color: '#8B7FD4', desc: 'Festa de abertura, atividades de integração e lazer.' },
  { id: 'recepcao', name: 'Recepção', x: 10, y: 88, w: 86, h: 10, color: '#C5281A', desc: 'Entrada principal — Credenciamento, distribuição de crachás e kits.' },
];

// ─── Atoms ────────────────────────────────────────────────────────────────────

function QRPlaceholder({ size = 80 }) {
  const cells = [];
  const seed = [1,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1];
  const grid = 8; const cs = size / grid;
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const corner = (r < 3 && c < 3) || (r < 3 && c >= grid - 3) || (r >= grid - 3 && c < 3);
      if (corner || seed[(r * grid + c) % seed.length]) cells.push({ x: c * cs, y: r * cs });
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 4, background: 'white', flexShrink: 0 }}>
      {cells.map((cell, i) => <rect key={i} x={cell.x} y={cell.y} width={cs} height={cs} fill="#0C0C14" />)}
    </svg>
  );
}

const Eyebrow = ({ children, color }) => (
  <div style={{ fontSize: 10, fontFamily: MONO, letterSpacing: '0.14em', textTransform: 'uppercase', color: color || C.textMuted, marginBottom: 10 }}>
    {children}
  </div>
);

const SectionHead = ({ label, title }) => (
  <div style={{ marginBottom: 28 }}>
    <Eyebrow>{label}</Eyebrow>
    <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(28px, 7vw, 40px)', fontWeight: 400, margin: 0, color: C.text, letterSpacing: '-0.015em', lineHeight: 1.05 }}>
      {title}
    </h2>
  </div>
);

const Chip = ({ children, variant = 'neutral' }) => {
  const v = {
    neutral: { bg: 'rgba(255,255,255,0.06)', color: C.textSub, border: C.border },
    success: { bg: C.successDim, color: C.success, border: 'rgba(62,207,148,0.2)' },
    warning: { bg: C.warningDim, color: C.warning, border: 'rgba(245,166,35,0.2)' },
    gold: { bg: C.goldDim, color: C.gold, border: 'rgba(201,168,76,0.25)' },
    blue: { bg: C.blueDim, color: C.blueLight, border: 'rgba(91,142,239,0.2)' },
  }[variant] || {};
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 10, fontFamily: MONO, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>
      {children}
    </span>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const navigate = useCallback((s) => { setSection(s); setMenuOpen(false); window.scrollTo(0, 0); }, []);

  const P = { padding: '28px 20px' };

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12 };

  const inp = {
    width: '100%', boxSizing: 'border-box', padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
    borderRadius: 12, color: C.text, fontSize: 15, fontFamily: BODY, outline: 'none', transition: 'border-color 0.2s',
  };

  const btnGold = { background: C.gold, color: '#0C0C14', border: 'none', padding: '14px 28px', fontSize: 12, fontWeight: 700, fontFamily: MONO, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 12, cursor: 'pointer' };
  const btnGhost = { background: 'transparent', color: C.textSub, border: `1px solid ${C.border}`, padding: '13px 28px', fontSize: 14, fontFamily: BODY, borderRadius: 12, cursor: 'pointer' };

  const catDot = (cat) => ({ main: C.blue, break: C.success, workshop: C.gold, fair: C.warning, social: '#9B7FD4', logistics: C.textMuted }[cat] || C.blue);

  // ── HOME ─────────────────────────────────────────────────────────────────

  const renderHome = () => (
    <div>
      <div style={{ padding: '60px 20px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Eyebrow color={C.textSub}>Grupo Casas Bahia Apresenta</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(44px, 11vw, 90px)', lineHeight: 0.93, letterSpacing: '-0.025em', margin: '0 0 6px', color: C.text }}>
          Convenção<br /><em style={{ fontStyle: 'italic', color: C.gold }}>de Vendas</em>
        </h1>
        <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(72px, 20vw, 148px)', fontWeight: 600, lineHeight: 0.8, color: C.text, opacity: 0.09, letterSpacing: '-0.04em', margin: '0 0 20px', userSelect: 'none' }}>
          2026
        </div>
        <p style={{ fontSize: 14, fontFamily: BODY, color: C.textSub, margin: '0 0 5px' }}>28 – 29 de Setembro de 2026</p>
        <p style={{ fontSize: 10, fontFamily: MONO, color: C.textMuted, margin: '0 0 44px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Tauá Hotel & Convention · Atibaia, SP
        </p>
      </div>

      <div style={{ padding: '0 20px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[{ val: countdown.days, label: 'Dias' }, { val: countdown.hours, label: 'Horas' }, { val: countdown.minutes, label: 'Min' }, { val: countdown.seconds, label: 'Seg' }].map((c, i) => (
            <div key={i} style={{ ...card, marginBottom: 0, textAlign: 'center', padding: '18px 8px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 500, color: C.gold, lineHeight: 1, marginBottom: 6 }}>
                {String(c.val).padStart(2, '0')}
              </div>
              <Eyebrow color={C.textMuted}>{c.label}</Eyebrow>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <div style={{ borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {[{ val: '1.500', label: 'Participantes' }, { val: '2', label: 'Dias' }, { val: '30+', label: 'Palestras' }, { val: '50+', label: 'Estandes' }].map((s, i) => (
            <div key={i} style={{ padding: '20px 16px', textAlign: 'center', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.card : 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 500, color: C.text, marginBottom: 5 }}>{s.val}</div>
              <Eyebrow color={C.textMuted}>{s.label}</Eyebrow>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        <button onClick={() => navigate('cadastro')} style={{ ...btnGold, width: '100%', padding: '16px' }}>Fazer Cadastro</button>
        <button onClick={() => navigate('agenda')} style={{ ...btnGhost, width: '100%', padding: '15px' }}>Ver Agenda Completa</button>
      </div>

      <div style={{ margin: '0 20px', padding: '14px 0', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <Eyebrow color={C.textMuted}>Casas Bahia © 2026</Eyebrow>
        <Eyebrow color={C.textMuted}>Demo v3.0</Eyebrow>
      </div>
    </div>
  );

  // ── CADASTRO ─────────────────────────────────────────────────────────────

  const validateReg = () => {
    const e = {};
    if (!regForm.nome.trim()) e.nome = true;
    if (!regForm.email.trim() || !regForm.email.includes('@')) e.email = true;
    if (!regForm.telefone.trim()) e.telefone = true;
    if (!regForm.empresa.trim()) e.empresa = true;
    if (!regForm.cargo.trim()) e.cargo = true;
    if (!regForm.regional) e.regional = true;
    setRegErrors(e); return Object.keys(e).length === 0;
  };

  const renderCadastro = () => (
    <div style={P}>
      <SectionHead label="Inscrição · Convenção 2026" title="Cadastro" />
      {regSubmitted ? (
        <div style={{ ...card, textAlign: 'center', padding: '52px 24px' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 52, color: C.gold, lineHeight: 1, marginBottom: 20 }}>✦</div>
          <h3 style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>Cadastro Realizado</h3>
          <p style={{ color: C.textSub, fontSize: 14, fontFamily: BODY, lineHeight: 1.5, marginBottom: 28 }}>
            Bem-vindo(a), <strong style={{ color: C.text }}>{regForm.nome}</strong>.<br />
            <span style={{ fontSize: 13, color: C.textMuted }}>Confirmação enviada para <span style={{ color: C.blueLight }}>{regForm.email}</span></span>
          </p>
          <div style={{ ...card, background: C.goldDim, borderColor: 'rgba(201,168,76,0.2)', padding: '18px', marginBottom: 24 }}>
            <Eyebrow color={C.textMuted}>Código de Confirmação</Eyebrow>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 500, color: C.gold, letterSpacing: '0.22em', marginTop: 4 }}>
              CB-2026-{Math.floor(Math.random() * 9000 + 1000)}
            </div>
          </div>
          <button onClick={() => { setRegSubmitted(false); setRegForm({ nome: '', email: '', telefone: '', empresa: '', cargo: '', regional: '' }); }} style={btnGhost}>
            Novo Cadastro
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {[
            { key: 'nome', label: 'Nome Completo', placeholder: 'Seu nome completo', type: 'text' },
            { key: 'email', label: 'E-mail', placeholder: 'seu@email.com', type: 'email' },
            { key: 'telefone', label: 'Telefone', placeholder: '(11) 99999-0000', type: 'tel' },
            { key: 'empresa', label: 'Empresa', placeholder: 'Nome da empresa', type: 'text' },
            { key: 'cargo', label: 'Cargo', placeholder: 'Seu cargo', type: 'text' },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontFamily: MONO, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 7 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={regForm[f.key]}
                onChange={(e) => { setRegForm({ ...regForm, [f.key]: e.target.value }); setRegErrors({ ...regErrors, [f.key]: false }); }}
                style={{ ...inp, borderColor: regErrors[f.key] ? '#C05050' : C.border }} />
              {regErrors[f.key] && <div style={{ color: '#C05050', fontSize: 11, fontFamily: BODY, marginTop: 4 }}>Campo obrigatório</div>}
            </div>
          ))}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 10, fontFamily: MONO, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 7 }}>Regional</label>
            <select value={regForm.regional}
              onChange={(e) => { setRegForm({ ...regForm, regional: e.target.value }); setRegErrors({ ...regErrors, regional: false }); }}
              style={{ ...inp, borderColor: regErrors.regional ? '#C05050' : C.border, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Selecione sua regional</option>
              {REGIONS.map((r) => <option key={r} value={r} style={{ background: '#1a1a26' }}>{r}</option>)}
            </select>
            {regErrors.regional && <div style={{ color: '#C05050', fontSize: 11, fontFamily: BODY, marginTop: 4 }}>Selecione uma regional</div>}
          </div>
          <button onClick={() => { if (validateReg()) setRegSubmitted(true); }} style={{ ...btnGold, width: '100%', padding: '16px' }}>
            Confirmar Inscrição
          </button>
        </div>
      )}
    </div>
  );

  // ── AGENDA ───────────────────────────────────────────────────────────────

  const renderAgenda = () => {
    const items = agendaDay === 1 ? AGENDA_DAY1 : AGENDA_DAY2;
    return (
      <div style={P}>
        <SectionHead label="Programação Completa" title="Agenda" />
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2].map((d) => (
            <button key={d} onClick={() => setAgendaDay(d)} style={{
              flex: 1, padding: '11px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              fontFamily: MONO, textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all 0.2s',
              background: agendaDay === d ? C.gold : 'transparent',
              color: agendaDay === d ? '#0C0C14' : C.textSub,
              border: `1px solid ${agendaDay === d ? C.gold : C.border}`,
            }}>Dia {d} · {d === 1 ? '28/09' : '29/09'}</button>
          ))}
        </div>
        <div style={{ position: 'relative', paddingLeft: 22 }}>
          <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 1, background: `linear-gradient(to bottom, transparent, ${C.border} 8%, ${C.border} 92%, transparent)` }} />
          {items.map((item, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 10 }}>
              <div style={{ position: 'absolute', left: -18, top: 17, width: 6, height: 6, borderRadius: '50%', background: catDot(item.cat) }} />
              <div style={{ ...card, marginBottom: 0, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: catDot(item.cat), letterSpacing: '0.08em', marginBottom: 5 }}>{item.time}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, fontFamily: BODY, color: C.text, marginBottom: 5, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, fontFamily: BODY, color: C.textMuted }}>📍 {item.location}</div>
                  </div>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── LOGÍSTICA ────────────────────────────────────────────────────────────

  const renderLogistica = () => {
    const tabs = [{ key: 'aereo', label: 'Aéreo' }, { key: 'terrestre', label: 'Terrestre' }, { key: 'hotel', label: 'Hotel' }];
    return (
      <div style={P}>
        <SectionHead label="Transporte e Hospedagem" title="Logística" />
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: `1px solid ${C.border}` }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setLogisticsTab(t.key)} style={{
              flex: 1, padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: BODY, transition: 'all 0.2s',
              background: logisticsTab === t.key ? C.gold : 'transparent',
              color: logisticsTab === t.key ? '#0C0C14' : C.textSub, border: 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {logisticsTab === 'aereo' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><Eyebrow>Transporte Aéreo</Eyebrow><div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.text }}>Voo Ida e Volta</div></div>
              <Chip variant="success">Confirmado</Chip>
            </div>
            {[
              { label: 'Ida · 27 Set 2026', from: 'GRU', fromCity: 'São Paulo', dep: '14:30', to: 'VCP', toCity: 'Campinas', arr: '15:45', flight: 'LATAM 3421', dur: '1h 15min' },
              { label: 'Volta · 29 Set 2026', from: 'VCP', fromCity: 'Campinas', dep: '19:00', to: 'GRU', toCity: 'São Paulo', arr: '20:15', flight: 'LATAM 3422', dur: '1h 15min' },
            ].map((leg, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', marginBottom: i === 0 ? 10 : 0 }}>
                <Eyebrow color={C.textMuted}>{leg.label}</Eyebrow>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: C.text, lineHeight: 1 }}>{leg.from}</div>
                    <div style={{ fontSize: 11, fontFamily: BODY, color: C.textSub, marginTop: 2 }}>{leg.fromCity}</div>
                    <div style={{ fontSize: 13, fontFamily: MONO, color: C.gold, marginTop: 4 }}>{leg.dep}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, marginBottom: 5 }}>{leg.dur}</div>
                    <div style={{ height: 1, background: C.border, position: 'relative' }}>
                      <div style={{ position: 'absolute', right: -1, top: -3, width: 7, height: 7, borderTop: `1px solid ${C.textMuted}`, borderRight: `1px solid ${C.textMuted}`, transform: 'rotate(45deg)' }} />
                    </div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, marginTop: 5 }}>{leg.flight}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: C.text, lineHeight: 1 }}>{leg.to}</div>
                    <div style={{ fontSize: 11, fontFamily: BODY, color: C.textSub, marginTop: 2 }}>{leg.toCity}</div>
                    <div style={{ fontSize: 13, fontFamily: MONO, color: C.gold, marginTop: 4 }}>{leg.arr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {logisticsTab === 'terrestre' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><Eyebrow>Transporte Terrestre</Eyebrow><div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.text }}>Transfer Executivo</div></div>
              <Chip variant="warning">Pendente</Chip>
            </div>
            {[
              { label: 'Ida · Aeroporto → Hotel', dep: 'Aeroporto VCP · 16:00', arr: 'Tauá Hotel · ~17:30' },
              { label: 'Volta · Hotel → Aeroporto', dep: 'Tauá Hotel · 17:00', arr: 'Aeroporto VCP · ~18:30' },
            ].map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', marginBottom: i === 0 ? 10 : 0 }}>
                <Eyebrow color={C.textMuted}>{r.label}</Eyebrow>
                <div style={{ fontSize: 15, fontWeight: 500, fontFamily: BODY, color: C.text, margin: '6px 0 8px' }}>Ônibus Executivo</div>
                <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub }}>Saída: {r.dep}</div>
                <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub }}>Chegada: {r.arr}</div>
              </div>
            ))}
          </div>
        )}

        {logisticsTab === 'hotel' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><Eyebrow>Hospedagem</Eyebrow><div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.text }}>Tauá Hotel & Convention</div></div>
              <Chip variant="success">Confirmado</Chip>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {[{ l: 'Check-in', v: '27/09 · 14h' }, { l: 'Check-out', v: '29/09 · 12h' }, { l: 'Quarto', v: 'Standard Duplo' }, { l: 'Reserva', v: 'TAU-88421', gold: true }].map((item, i) => (
                  <div key={i}>
                    <Eyebrow color={C.textMuted}>{item.l}</Eyebrow>
                    <div style={{ fontSize: 14, fontWeight: 500, fontFamily: BODY, color: item.gold ? C.gold : C.text, marginTop: 4 }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, fontFamily: BODY, color: C.textMuted }}>Incluso: café da manhã, Wi-Fi, acesso à área de lazer.</div>
          </div>
        )}
      </div>
    );
  };

  // ── VOUCHERS ─────────────────────────────────────────────────────────────

  const renderVouchers = () => {
    const vouchers = [
      { type: 'Aéreo', code: 'VCH-AER-7721', lines: ['GRU → VCP · 27/09 às 14:30', 'VCP → GRU · 29/09 às 19:00'], accent: C.blue },
      { type: 'Terrestre', code: 'VCH-TER-3349', lines: ['Transfer Aeroporto ↔ Tauá Hotel', 'Ida e Volta Inclusos'], accent: C.warning },
      { type: 'Hospedagem', code: 'VCH-HOS-5512', lines: ['Tauá Hotel · 27/09 a 29/09', 'Standard Duplo'], accent: C.success },
    ];
    return (
      <div style={P}>
        <SectionHead label="Vouchers Digitais" title="Seus Vouchers" />
        {vouchers.map((v, i) => (
          <div key={i} style={{ ...card, marginBottom: 16, overflow: 'hidden', padding: 0, borderColor: `${v.accent}25` }}>
            <div style={{ padding: '16px 20px', background: `linear-gradient(135deg, ${v.accent}15 0%, transparent 70%)`, borderBottom: `1px dashed rgba(255,255,255,0.08)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Eyebrow color={v.accent}>{v.type}</Eyebrow>
                <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 500, color: C.text, letterSpacing: '0.12em', marginTop: 4 }}>{v.code}</div>
              </div>
              <Chip variant="success">Ativo</Chip>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <QRPlaceholder size={60} />
              <div>{v.lines.map((l, j) => <div key={j} style={{ fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.7 }}>{l}</div>)}</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 20px' }}>
              <button style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 10, fontFamily: MONO, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>↓ Download Voucher</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── MAPA ─────────────────────────────────────────────────────────────────

  const renderMapa = () => (
    <div style={P}>
      <SectionHead label="Tauá Hotel & Convention" title="Mapa do Evento" />
      <div style={{ ...card, padding: 0, overflow: 'hidden', background: '#0A0A12', paddingBottom: '72%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 10 }}>
          {MAP_AREAS.map((a) => (
            <div key={a.id} onClick={() => setMapSelected(mapSelected === a.id ? null : a.id)} style={{
              position: 'absolute', left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%`,
              background: mapSelected === a.id ? `${a.color}38` : `${a.color}18`,
              border: `1px solid ${mapSelected === a.id ? a.color : `${a.color}44`}`,
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.25s', padding: 4, boxSizing: 'border-box',
              opacity: mapSelected && mapSelected !== a.id ? 0.25 : 1,
            }}>
              <span style={{ fontSize: a.w > 30 ? 9 : 7, fontWeight: 600, color: 'white', textAlign: 'center', fontFamily: BODY, lineHeight: 1.2 }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
      {mapSelected && (() => {
        const area = MAP_AREAS.find((a) => a.id === mapSelected);
        return (
          <div style={{ ...card, marginTop: 12, borderColor: `${area.color}2A` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: area.color }} />
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: BODY, color: C.text }}>{area.name}</div>
            </div>
            <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.65 }}>{area.desc}</div>
          </div>
        );
      })()}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {[{ color: C.blue, label: 'Plenária' }, { color: '#7BA3FF', label: 'Salas' }, { color: C.success, label: 'Alimentação' }, { color: C.gold, label: 'Convivência' }, { color: C.warning, label: 'Exposições' }, { color: '#8B7FD4', label: 'Externa' }, { color: C.red, label: 'Recepção' }].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── QR ───────────────────────────────────────────────────────────────────

  const renderQR = () => {
    const brindes = [{ name: 'Kit Boas-vindas', collected: true }, { name: 'Camiseta Evento', collected: true }, { name: 'Power Bank', collected: false }, { name: 'Ecobag', collected: true }, { name: 'Garrafa Térmica', collected: false }];
    const badges = [{ name: 'Early Bird', earned: true }, { name: 'Networker', earned: true }, { name: 'Explorador', earned: visitedStands.size >= 6 }, { name: 'Completo', earned: visitedStands.size >= 12 }];
    const collected = brindes.filter((b) => b.collected).length;
    return (
      <div style={P}>
        <SectionHead label="Crachá Digital" title="Identificação" />
        <div style={{ ...card, textAlign: 'center', padding: '36px 24px', background: 'linear-gradient(150deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.03) 70%)', borderColor: 'rgba(201,168,76,0.18)', marginBottom: 16 }}>
          <Eyebrow color={C.red}>Grupo Casas Bahia · Convenção de Vendas 2026</Eyebrow>
          <div style={{ margin: '16px 0' }}><QRPlaceholder size={108} /></div>
          <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 400, color: C.text, marginBottom: 5 }}>João da Silva</div>
          <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub, marginBottom: 3 }}>Gerente de Vendas</div>
          <div style={{ fontSize: 11, fontFamily: MONO, color: C.gold, letterSpacing: '0.08em', marginBottom: 18 }}>Casas Bahia · SP Capital</div>
          <Chip variant="gold">ID: CB-2026-4821</Chip>
        </div>
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: BODY, color: C.text }}>Brindes Coletados</div>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted }}>{collected}/{brindes.length}</span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(collected / brindes.length) * 100}%`, background: C.gold, borderRadius: 1, transition: 'width 0.5s ease' }} />
          </div>
          {brindes.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < brindes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 13, fontFamily: BODY, color: b.collected ? C.text : C.textMuted }}>{b.name}</span>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: b.collected ? C.success : 'transparent', border: `1px solid ${b.collected ? C.success : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {b.collected && <span style={{ fontSize: 8, color: '#0C0C14', fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 500, fontFamily: BODY, color: C.text, marginBottom: 14 }}>Conquistas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {badges.map((b, i) => (
              <div key={i} style={{ background: b.earned ? C.goldDim : 'rgba(255,255,255,0.02)', border: `1px solid ${b.earned ? 'rgba(201,168,76,0.2)' : C.border}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', opacity: b.earned ? 1 : 0.35 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 500, color: b.earned ? C.gold : C.textSub, marginBottom: 4 }}>{b.name}</div>
                <Eyebrow color={b.earned ? C.gold : C.textMuted}>{b.earned ? 'Desbloqueado' : 'Bloqueado'}</Eyebrow>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── ESTANDES ─────────────────────────────────────────────────────────────

  const renderEstandes = () => (
    <div style={P}>
      <SectionHead label="Rota de Vendas · Feira de Fornecedores" title="Mapa de Estandes" />
      <div style={{ ...card, marginBottom: 20, textAlign: 'center', background: visitedStands.size === STANDS.length ? C.successDim : C.card, borderColor: visitedStands.size === STANDS.length ? 'rgba(62,207,148,0.22)' : C.border }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 500, color: visitedStands.size === STANDS.length ? C.success : C.text, lineHeight: 1 }}>
          {visitedStands.size}<span style={{ fontSize: 20, color: C.textMuted }}> / {STANDS.length}</span>
        </div>
        <Eyebrow color={C.textMuted}>Estandes Visitados</Eyebrow>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(visitedStands.size / STANDS.length) * 100}%`, background: visitedStands.size === STANDS.length ? C.success : C.gold, borderRadius: 1, transition: 'width 0.4s ease' }} />
        </div>
        {visitedStands.size === STANDS.length && <div style={{ color: C.success, fontSize: 13, fontFamily: BODY, fontWeight: 500, marginTop: 12 }}>Rota de Vendas concluída! 🎉</div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {STANDS.map((s) => {
          const visited = visitedStands.has(s.id);
          return (
            <div key={s.id} onClick={() => { const n = new Set(visitedStands); visited ? n.delete(s.id) : n.add(s.id); setVisitedStands(n); }} style={{ background: visited ? C.successDim : C.card, border: `1px solid ${visited ? 'rgba(62,207,148,0.22)' : C.border}`, borderRadius: 14, padding: '14px 12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
              <Eyebrow color={visited ? C.success : C.textMuted}>{s.num}</Eyebrow>
              <div style={{ fontSize: 14, fontWeight: 500, fontFamily: BODY, color: C.text, margin: '4px 0' }}>{s.name}</div>
              <div style={{ fontSize: 10, fontFamily: BODY, color: C.textMuted, marginBottom: 10 }}>{s.cat}</div>
              <Chip variant={visited ? 'success' : 'neutral'}>{visited ? 'Visitado' : 'Visitar'}</Chip>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── FEED ─────────────────────────────────────────────────────────────────

  const renderFeed = () => (
    <div style={P}>
      <SectionHead label="Timeline · Ao Vivo" title="Feed do Evento" />
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, ${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, fontFamily: MONO, color: '#0C0C14', flexShrink: 0 }}>EU</div>
          <div style={{ flex: 1 }}>
            <textarea placeholder="Compartilhe algo com o evento..." value={newPostText} onChange={(e) => setNewPostText(e.target.value)} style={{ ...inp, resize: 'none', height: 60, fontSize: 14, padding: '10px 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button style={{ ...btnGhost, padding: '7px 14px', fontSize: 12 }}>📷 Foto</button>
              <button style={{ ...btnGold, padding: '7px 18px', fontSize: 11 }}>Publicar</button>
            </div>
          </div>
        </div>
      </div>
      {FEED_POSTS.map((post) => {
        const liked = likedPosts.has(post.id);
        return (
          <div key={post.id} style={{ ...card, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: post.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, fontFamily: MONO, color: 'white', flexShrink: 0 }}>{post.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, fontFamily: BODY, color: C.text }}>{post.user}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.textMuted, letterSpacing: '0.06em' }}>{post.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontFamily: BODY, lineHeight: 1.65, color: C.textSub, marginBottom: post.photo ? 12 : 0 }}>{post.text}</div>
            {post.photo && <div style={{ height: 130, borderRadius: 10, marginBottom: 12, background: `linear-gradient(135deg, ${post.photoColor}, ${post.photoColor}77)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, fontFamily: MONO, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Foto do Evento</span></div>}
            <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => { const n = new Set(likedPosts); liked ? n.delete(post.id) : n.add(post.id); setLikedPosts(n); }} style={{ background: 'none', border: 'none', color: liked ? '#C05060' : C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: BODY, display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s' }}>
                {liked ? '♥' : '♡'} {post.likes + (liked ? 1 : 0)}
              </button>
              <span style={{ color: C.textMuted, fontSize: 13, fontFamily: BODY, display: 'flex', alignItems: 'center', gap: 5 }}>💬 {post.comments}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── FAQ ───────────────────────────────────────────────────────────────────

  const renderFAQ = () => (
    <div style={P}>
      <SectionHead label="Dúvidas Frequentes" title="FAQ" />
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} style={{ ...card, cursor: 'pointer', marginBottom: 8, borderColor: faqOpen === i ? 'rgba(201,168,76,0.22)' : C.border, background: faqOpen === i ? C.goldDim : C.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontFamily: BODY, color: C.text, flex: 1, paddingRight: 16, lineHeight: 1.4 }}>{item.q}</span>
            <span style={{ fontSize: 18, color: C.gold, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
          </div>
          {faqOpen === i && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid rgba(201,168,76,0.12)`, fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.75 }}>{item.a}</div>}
        </div>
      ))}
    </div>
  );

  // ── Router ────────────────────────────────────────────────────────────────

  const sections = { home: renderHome, cadastro: renderCadastro, agenda: renderAgenda, logistica: renderLogistica, vouchers: renderVouchers, mapa: renderMapa, qr: renderQR, estandes: renderEstandes, feed: renderFeed, faq: renderFAQ };

  const sectionList = [
    { key: 'home', label: 'Início', sub: 'Página inicial' },
    { key: 'cadastro', label: 'Cadastro', sub: 'Inscrição no evento' },
    { key: 'agenda', label: 'Agenda', sub: 'Programação completa' },
    { key: 'logistica', label: 'Logística', sub: 'Transporte e hotel' },
    { key: 'vouchers', label: 'Vouchers', sub: 'Vouchers digitais' },
    { key: 'mapa', label: 'Mapa do Evento', sub: 'Layout do hotel' },
    { key: 'qr', label: 'Identificação', sub: 'Crachá e QR Code' },
    { key: 'estandes', label: 'Estandes', sub: 'Feira de fornecedores' },
    { key: 'feed', label: 'Feed', sub: 'Timeline ao vivo' },
    { key: 'faq', label: 'FAQ', sub: 'Dúvidas frequentes' },
  ];

  const bottomTabs = [
    { key: 'home', label: 'Início' },
    { key: 'agenda', label: 'Agenda' },
    { key: 'mapa', label: 'Mapa' },
    { key: 'feed', label: 'Feed' },
    { key: 'menu', label: 'Menu' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: BODY, paddingBottom: 80 }}>
      <div style={{ height: 3, background: C.red, position: 'sticky', top: 0, zIndex: 100 }} />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(12,12,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 3, zIndex: 99 }}>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, fontFamily: MONO, color: 'white', letterSpacing: '0.02em' }}>CB</div>
          <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Convenção 2026</span>
        </button>
        <Eyebrow color={C.textMuted}>Demo</Eyebrow>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {sections[section] ? sections[section]() : renderHome()}
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(12,12,20,0.98)', backdropFilter: 'blur(28px)', display: 'flex', flexDirection: 'column', padding: '24px 20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 300, color: C.text }}>Menu</div>
            <button onClick={() => setMenuOpen(false)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.textSub, padding: '8px 16px', cursor: 'pointer', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fechar</button>
          </div>
          {sectionList.map((s) => (
            <button key={s.key} onClick={() => navigate(s.key)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: section === s.key ? C.goldDim : 'transparent', border: `1px solid ${section === s.key ? 'rgba(201,168,76,0.18)' : 'transparent'}`, borderRadius: 14, padding: '15px 18px', marginBottom: 6, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: section === s.key ? 500 : 400, fontFamily: BODY, color: section === s.key ? C.gold : C.text, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.textMuted, letterSpacing: '0.06em' }}>{s.sub}</div>
              </div>
              {section === s.key && <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold }} />}
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, background: 'rgba(12,12,20,0.96)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 env(safe-area-inset-bottom, 12px)' }}>
        {bottomTabs.map((t) => {
          const active = t.key === 'menu' ? menuOpen : section === t.key;
          return (
            <button key={t.key} onClick={() => t.key === 'menu' ? setMenuOpen(!menuOpen) : navigate(t.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '2px 14px', color: active ? C.gold : C.textMuted, transition: 'color 0.2s' }}>
              <span style={{ fontSize: 9, fontFamily: MONO, fontWeight: active ? 600 : 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.label}</span>
              <div style={{ width: active ? 16 : 0, height: 1, background: C.gold, borderRadius: 1, transition: 'width 0.3s ease' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
