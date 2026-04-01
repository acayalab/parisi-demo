'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── Design System ────────────────────────────────────────────────────────────

const C = {
  bg: '#F2F4F8',
  card: '#FFFFFF',
  border: '#E2E6EF',
  borderStrong: '#BEC8DA',
  blue: '#003087',
  blueMid: '#0044B0',
  blueLight: '#1A6DFF',
  blueDim: 'rgba(0,48,135,0.07)',
  yellow: '#FFD000',
  yellowDark: '#E6BB00',
  yellowDim: 'rgba(255,208,0,0.15)',
  red: '#D42B28',
  redDim: 'rgba(212,43,40,0.08)',
  text: '#111827',
  textSub: '#4B5563',
  textMuted: '#9CA3AF',
  success: '#059669',
  successDim: 'rgba(5,150,105,0.1)',
  warning: '#D97706',
  warningDim: 'rgba(217,119,6,0.1)',
  shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
  shadowLg: '0 8px 24px rgba(0,0,0,0.10)',
};

const BODY = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "'Roboto Mono', 'Courier New', monospace";

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
  { id: 6, user: 'Equipe Organização', initials: 'EO', color: '#003087', time: '2h', text: '📢 Lembrete: Plenária às 9h em ponto amanhã. Boa noite a todos! 🌙', likes: 56, comments: 8, photo: false },
];

const FAQ_ITEMS = [
  { q: 'Qual a senha do Wi-Fi do evento?', a: 'Rede: CB_Convenção2026 | Senha: vendas2026! — Disponível em todas as áreas do hotel.' },
  { q: 'Qual o dress code do evento?', a: 'Dia 1 e 2: Smart Casual. Festa de Abertura: Casual/Esporte fino.' },
  { q: 'Há estacionamento no local?', a: 'Sim! O Tauá Hotel dispõe de estacionamento gratuito. Vagas limitadas — chegue cedo.' },
  { q: 'Qual o horário de check-in no hotel?', a: 'Check-in a partir das 14h no dia 27/09. Check-out até 12h do dia 29/09.' },
  { q: 'As refeições estão incluídas?', a: 'Sim! Café da manhã, almoço, coffee breaks e jantar inclusos para todos os participantes.' },
  { q: 'O que devo levar?', a: 'Documento com foto, confirmação de inscrição, roupas adequadas e itens pessoais.' },
  { q: 'Contato para emergências?', a: 'Central do Evento disponível via WhatsApp 24h durante o evento. Número será divulgado no kit de boas-vindas.' },
  { q: 'Como usar o app durante o evento?', a: 'Navegue pelo menu inferior. Use o QR Code nos estandes e acompanhe agenda e feed.' },
];

const MAP_AREAS = [
  { id: 'plenaria', name: 'Plenária Principal', x: 10, y: 10, w: 45, h: 25, color: '#003087', desc: 'Capacidade: 1.500 pessoas. Palco principal, telões laterais e sistema de som profissional.' },
  { id: 'sala1', name: 'Sala 1', x: 58, y: 10, w: 18, h: 12, color: '#1A6DFF', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala2', name: 'Sala 2', x: 78, y: 10, w: 18, h: 12, color: '#1A6DFF', desc: 'Sala para workshops — 120 lugares. Projetor e quadro branco.' },
  { id: 'sala3', name: 'Sala 3', x: 58, y: 25, w: 18, h: 12, color: '#1A6DFF', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'sala4', name: 'Sala 4', x: 78, y: 25, w: 18, h: 12, color: '#1A6DFF', desc: 'Sala para painéis temáticos — 100 lugares.' },
  { id: 'restaurante', name: 'Restaurante', x: 10, y: 40, w: 35, h: 18, color: '#059669', desc: 'Restaurante principal — Buffet completo, almoço e jantar inclusos.' },
  { id: 'convivencia', name: 'Convivência', x: 48, y: 40, w: 25, h: 18, color: '#D97706', desc: 'Espaço para coffee breaks, networking e descanso.' },
  { id: 'pavilhao', name: 'Pavilhão de Exposições', x: 10, y: 62, w: 55, h: 22, color: '#FFD000', desc: '50+ estandes de fornecedores. Rota de Vendas e feira de exposições.' },
  { id: 'externa', name: 'Área Externa', x: 68, y: 55, w: 28, h: 30, color: '#7C3AED', desc: 'Festa de abertura, atividades de integração e lazer.' },
  { id: 'recepcao', name: 'Recepção', x: 10, y: 88, w: 86, h: 10, color: '#D42B28', desc: 'Entrada principal — Credenciamento, distribuição de crachás e kits.' },
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 4, background: 'white', flexShrink: 0, border: '1px solid #E2E6EF' }}>
      {cells.map((cell, i) => <rect key={i} x={cell.x} y={cell.y} width={cs} height={cs} fill="#003087" />)}
    </svg>
  );
}

const Label = ({ children, color }) => (
  <div style={{ fontSize: 10, fontFamily: MONO, letterSpacing: '0.12em', textTransform: 'uppercase', color: color || C.textMuted, marginBottom: 8, fontWeight: 500 }}>
    {children}
  </div>
);

const SectionHead = ({ label, title }) => (
  <div style={{ marginBottom: 24 }}>
    <Label>{label}</Label>
    <h2 style={{ fontFamily: BODY, fontSize: 'clamp(22px, 6vw, 30px)', fontWeight: 700, margin: 0, color: C.text, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
      {title}
    </h2>
  </div>
);

const Chip = ({ children, variant = 'neutral' }) => {
  const v = {
    neutral: { bg: '#F2F4F8', color: C.textSub, border: C.border },
    success: { bg: C.successDim, color: C.success, border: 'rgba(5,150,105,0.25)' },
    warning: { bg: C.warningDim, color: C.warning, border: 'rgba(217,119,6,0.25)' },
    blue: { bg: C.blueDim, color: C.blue, border: 'rgba(0,48,135,0.2)' },
    yellow: { bg: C.yellowDim, color: '#9B7B00', border: 'rgba(255,208,0,0.4)' },
    red: { bg: C.redDim, color: C.red, border: 'rgba(212,43,40,0.2)' },
  }[variant] || {};
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontFamily: BODY, fontWeight: 600, letterSpacing: '0.02em', background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>
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
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    setIsIOS(ios);

    if (ios) {
      setTimeout(() => setShowInstall(true), 2500);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setTimeout(() => setShowInstall(true), 2500);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') { setShowInstall(false); setInstallPrompt(null); }
    }
  };

  const dismissInstall = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - new Date();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const navigate = useCallback((s) => { setSection(s); setMenuOpen(false); window.scrollTo(0, 0); }, []);

  const P = { padding: '24px 16px' };

  const card = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: '16px 18px',
    marginBottom: 12,
    boxShadow: C.shadow,
  };

  const inp = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px',
    background: '#FFFFFF', border: `1.5px solid ${C.border}`,
    borderRadius: 8, color: C.text, fontSize: 15, fontFamily: BODY, outline: 'none',
    transition: 'border-color 0.2s',
  };

  const btnBlue = {
    background: C.blue, color: '#FFFFFF', border: 'none',
    padding: '13px 24px', fontSize: 14, fontWeight: 700, fontFamily: BODY,
    borderRadius: 8, cursor: 'pointer', letterSpacing: '-0.01em',
  };

  const btnYellow = {
    background: C.yellow, color: C.blue, border: 'none',
    padding: '13px 24px', fontSize: 14, fontWeight: 700, fontFamily: BODY,
    borderRadius: 8, cursor: 'pointer', letterSpacing: '-0.01em',
  };

  const btnGhost = {
    background: 'transparent', color: C.blue,
    border: `1.5px solid ${C.blue}`, padding: '12px 24px',
    fontSize: 14, fontFamily: BODY, fontWeight: 600, borderRadius: 8, cursor: 'pointer',
  };

  const catDot = (cat) => ({ main: C.blue, break: C.success, workshop: C.warning, fair: '#D97706', social: '#7C3AED', logistics: C.textMuted }[cat] || C.blue);
  const catBg = (cat) => ({ main: C.blueDim, break: C.successDim, workshop: C.warningDim, fair: C.warningDim, social: 'rgba(124,58,237,0.08)', logistics: '#F2F4F8' }[cat] || C.blueDim);

  // ── HOME ─────────────────────────────────────────────────────────────────

  const renderHome = () => (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${C.blue} 0%, #0044B0 100%)`, padding: '48px 20px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,208,0,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, fontFamily: MONO, color: C.blue }}>CB</div>
          <span style={{ fontSize: 11, fontFamily: BODY, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>Grupo Casas Bahia</span>
        </div>

        <h1 style={{ fontFamily: BODY, fontWeight: 800, fontSize: 'clamp(28px, 8vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 8px', color: '#FFFFFF' }}>
          Convenção de<br /><span style={{ color: C.yellow }}>Vendas 2026</span>
        </h1>

        <p style={{ fontSize: 14, fontFamily: BODY, fontWeight: 400, color: 'rgba(255,255,255,0.75)', margin: '0 0 6px' }}>28 – 29 de Setembro de 2026</p>
        <p style={{ fontSize: 12, fontFamily: MONO, color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Tauá Hotel & Convention · Atibaia, SP
        </p>

        {/* Countdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxWidth: 360, margin: '0 auto' }}>
          {[{ val: countdown.days, label: 'Dias' }, { val: countdown.hours, label: 'Horas' }, { val: countdown.minutes, label: 'Min' }, { val: countdown.seconds, label: 'Seg' }].map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 8px', textAlign: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontFamily: BODY, fontSize: 28, fontWeight: 800, color: C.yellow, lineHeight: 1, marginBottom: 4 }}>
                {String(c.val).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 9, fontFamily: MONO, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[{ val: '1.500', label: 'Participantes' }, { val: '2', label: 'Dias' }, { val: '30+', label: 'Palestras' }, { val: '50+', label: 'Estandes' }].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 8px', textAlign: 'center', boxShadow: C.shadow }}>
              <div style={{ fontFamily: BODY, fontSize: 20, fontWeight: 800, color: C.blue, marginBottom: 3, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px', boxShadow: C.shadow }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📍</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text, marginBottom: 3 }}>Tauá Hotel & Convention</div>
              <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub }}>Atibaia, São Paulo · 1.500 participantes de todo o Brasil</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => navigate('cadastro')} style={{ ...btnYellow, width: '100%', padding: '15px' }}>
          Fazer Meu Cadastro
        </button>
        <button onClick={() => navigate('agenda')} style={{ ...btnGhost, width: '100%', padding: '14px' }}>
          Ver Agenda Completa
        </button>
      </div>

      <div style={{ margin: '20px 16px 0', padding: '14px 0', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontFamily: MONO, color: C.textMuted }}>Casas Bahia © 2026</span>
        <span style={{ fontSize: 11, fontFamily: MONO, color: C.textMuted }}>Tauá · Atibaia, SP</span>
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
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.successDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 20px' }}>✅</div>
          <h3 style={{ fontFamily: BODY, fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Cadastro Realizado!</h3>
          <p style={{ color: C.textSub, fontSize: 14, fontFamily: BODY, lineHeight: 1.6, marginBottom: 24 }}>
            Bem-vindo(a), <strong style={{ color: C.text }}>{regForm.nome}</strong>.<br />
            <span style={{ fontSize: 13, color: C.textMuted }}>Confirmação enviada para <span style={{ color: C.blue }}>{regForm.email}</span></span>
          </p>
          <div style={{ background: C.blueDim, border: `1px solid rgba(0,48,135,0.15)`, borderRadius: 10, padding: '16px', marginBottom: 24 }}>
            <Label color={C.textMuted}>Código de Confirmação</Label>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 500, color: C.blue, letterSpacing: '0.22em', marginTop: 4 }}>
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
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontFamily: BODY, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={regForm[f.key]}
                onChange={(e) => { setRegForm({ ...regForm, [f.key]: e.target.value }); setRegErrors({ ...regErrors, [f.key]: false }); }}
                style={{ ...inp, borderColor: regErrors[f.key] ? C.red : C.border }} />
              {regErrors[f.key] && <div style={{ color: C.red, fontSize: 12, fontFamily: BODY, marginTop: 4 }}>Campo obrigatório</div>}
            </div>
          ))}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontFamily: BODY, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Regional</label>
            <select value={regForm.regional}
              onChange={(e) => { setRegForm({ ...regForm, regional: e.target.value }); setRegErrors({ ...regErrors, regional: false }); }}
              style={{ ...inp, borderColor: regErrors.regional ? C.red : C.border, appearance: 'none', cursor: 'pointer', background: '#FFFFFF' }}>
              <option value="">Selecione sua regional</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {regErrors.regional && <div style={{ color: C.red, fontSize: 12, fontFamily: BODY, marginTop: 4 }}>Selecione uma regional</div>}
          </div>
          <button onClick={() => { if (validateReg()) setRegSubmitted(true); }} style={{ ...btnBlue, width: '100%', padding: '15px' }}>
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2].map((d) => (
            <button key={d} onClick={() => setAgendaDay(d)} style={{
              flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: BODY, transition: 'all 0.2s',
              background: agendaDay === d ? C.blue : C.card,
              color: agendaDay === d ? '#FFFFFF' : C.textSub,
              border: `1.5px solid ${agendaDay === d ? C.blue : C.border}`,
              boxShadow: agendaDay === d ? `0 2px 8px rgba(0,48,135,0.3)` : C.shadow,
            }}>Dia {d} · {d === 1 ? '28/09' : '29/09'}</button>
          ))}
        </div>
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 6, top: 10, bottom: 10, width: 2, background: `linear-gradient(to bottom, ${C.blue}, ${C.border})`, borderRadius: 1 }} />
          {items.map((item, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 10 }}>
              <div style={{ position: 'absolute', left: -16, top: 16, width: 8, height: 8, borderRadius: '50%', background: catDot(item.cat), border: '2px solid white', boxShadow: `0 0 0 2px ${catDot(item.cat)}33` }} />
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 14px', boxShadow: C.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: catBg(item.cat), marginBottom: 7 }}>
                      <span style={{ fontSize: 10, fontFamily: MONO, color: catDot(item.cat), letterSpacing: '0.06em', fontWeight: 500 }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: BODY, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, fontFamily: BODY, color: C.textMuted }}>📍 {item.location}</div>
                  </div>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
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
    const tabs = [{ key: 'aereo', label: '✈ Aéreo' }, { key: 'terrestre', label: '🚌 Terrestre' }, { key: 'hotel', label: '🏨 Hotel' }];
    return (
      <div style={P}>
        <SectionHead label="Transporte e Hospedagem" title="Logística" />
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: C.card, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setLogisticsTab(t.key)} style={{
              flex: 1, padding: '9px 6px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: BODY, transition: 'all 0.2s',
              background: logisticsTab === t.key ? C.blue : 'transparent',
              color: logisticsTab === t.key ? '#FFFFFF' : C.textSub, border: 'none',
              boxShadow: logisticsTab === t.key ? '0 1px 4px rgba(0,48,135,0.3)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {logisticsTab === 'aereo' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div><Label color={C.textMuted}>Transporte Aéreo</Label><div style={{ fontSize: 16, fontWeight: 700, fontFamily: BODY, color: C.text }}>Voo Ida e Volta</div></div>
              <Chip variant="success">Confirmado</Chip>
            </div>
            {[
              { label: 'Ida · 27 Set 2026', from: 'GRU', fromCity: 'São Paulo', dep: '14:30', to: 'VCP', toCity: 'Campinas', arr: '15:45', flight: 'LATAM 3421', dur: '1h 15min' },
              { label: 'Volta · 29 Set 2026', from: 'VCP', fromCity: 'Campinas', dep: '19:00', to: 'GRU', toCity: 'São Paulo', arr: '20:15', flight: 'LATAM 3422', dur: '1h 15min' },
            ].map((leg, i) => (
              <div key={i} style={{ background: '#F8F9FC', borderRadius: 10, padding: '14px', marginBottom: i === 0 ? 10 : 0, border: `1px solid ${C.border}` }}>
                <Label color={C.textMuted}>{leg.label}</Label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div>
                    <div style={{ fontFamily: BODY, fontSize: 26, fontWeight: 800, color: C.blue, lineHeight: 1 }}>{leg.from}</div>
                    <div style={{ fontSize: 11, fontFamily: BODY, color: C.textSub, marginTop: 2 }}>{leg.fromCity}</div>
                    <div style={{ fontSize: 13, fontFamily: MONO, color: C.text, marginTop: 4, fontWeight: 500 }}>{leg.dep}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, marginBottom: 4 }}>{leg.dur}</div>
                    <div style={{ height: 1.5, background: C.border, position: 'relative' }}>
                      <div style={{ position: 'absolute', right: -1, top: -3, width: 7, height: 7, borderTop: `2px solid ${C.borderStrong}`, borderRight: `2px solid ${C.borderStrong}`, transform: 'rotate(45deg)' }} />
                    </div>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.textMuted, marginTop: 4 }}>{leg.flight}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: BODY, fontSize: 26, fontWeight: 800, color: C.blue, lineHeight: 1 }}>{leg.to}</div>
                    <div style={{ fontSize: 11, fontFamily: BODY, color: C.textSub, marginTop: 2 }}>{leg.toCity}</div>
                    <div style={{ fontSize: 13, fontFamily: MONO, color: C.text, marginTop: 4, fontWeight: 500 }}>{leg.arr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {logisticsTab === 'terrestre' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div><Label color={C.textMuted}>Transporte Terrestre</Label><div style={{ fontSize: 16, fontWeight: 700, fontFamily: BODY, color: C.text }}>Transfer Executivo</div></div>
              <Chip variant="warning">Pendente</Chip>
            </div>
            {[
              { label: 'Ida · Aeroporto → Hotel', dep: 'Aeroporto VCP · 16:00', arr: 'Tauá Hotel · ~17:30' },
              { label: 'Volta · Hotel → Aeroporto', dep: 'Tauá Hotel · 17:00', arr: 'Aeroporto VCP · ~18:30' },
            ].map((r, i) => (
              <div key={i} style={{ background: '#F8F9FC', borderRadius: 10, padding: '14px', marginBottom: i === 0 ? 10 : 0, border: `1px solid ${C.border}` }}>
                <Label color={C.textMuted}>{r.label}</Label>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: BODY, color: C.text, margin: '6px 0 6px' }}>Ônibus Executivo</div>
                <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub }}>Saída: {r.dep}</div>
                <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub }}>Chegada: {r.arr}</div>
              </div>
            ))}
          </div>
        )}

        {logisticsTab === 'hotel' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div><Label color={C.textMuted}>Hospedagem</Label><div style={{ fontSize: 16, fontWeight: 700, fontFamily: BODY, color: C.text }}>Tauá Hotel & Convention</div></div>
              <Chip variant="success">Confirmado</Chip>
            </div>
            <div style={{ background: '#F8F9FC', borderRadius: 10, padding: '14px', marginBottom: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{ l: 'Check-in', v: '27/09 · 14h' }, { l: 'Check-out', v: '29/09 · 12h' }, { l: 'Quarto', v: 'Standard Duplo' }, { l: 'Reserva', v: 'TAU-88421', blue: true }].map((item, i) => (
                  <div key={i}>
                    <Label color={C.textMuted}>{item.l}</Label>
                    <div style={{ fontSize: 14, fontWeight: 600, fontFamily: BODY, color: item.blue ? C.blue : C.text, marginTop: 4 }}>{item.v}</div>
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
      { type: 'Aéreo', code: 'VCH-AER-7721', lines: ['GRU → VCP · 27/09 às 14:30', 'VCP → GRU · 29/09 às 19:00'], accent: C.blue, icon: '✈️' },
      { type: 'Terrestre', code: 'VCH-TER-3349', lines: ['Transfer Aeroporto ↔ Tauá Hotel', 'Ida e Volta Inclusos'], accent: C.warning, icon: '🚌' },
      { type: 'Hospedagem', code: 'VCH-HOS-5512', lines: ['Tauá Hotel · 27/09 a 29/09', 'Standard Duplo'], accent: C.success, icon: '🏨' },
    ];
    return (
      <div style={P}>
        <SectionHead label="Vouchers Digitais" title="Seus Vouchers" />
        {vouchers.map((v, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, overflow: 'hidden', boxShadow: C.shadowMd }}>
            <div style={{ padding: '14px 18px', background: v.accent, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{v.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontFamily: BODY, fontWeight: 700, color: v.accent === C.yellow ? C.blue : 'rgba(255,255,255,0.75)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v.type}</div>
                  <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 500, color: v.accent === C.yellow ? C.blue : '#FFFFFF', letterSpacing: '0.08em', marginTop: 1 }}>{v.code}</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 100, padding: '3px 10px' }}>
                <span style={{ fontSize: 11, fontFamily: BODY, fontWeight: 700, color: v.accent === C.yellow ? C.blue : '#FFFFFF' }}>ATIVO</span>
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <QRPlaceholder size={64} />
              <div>{v.lines.map((l, j) => <div key={j} style={{ fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.7 }}>{l}</div>)}</div>
            </div>
            <div style={{ borderTop: `1px dashed ${C.border}`, padding: '10px 18px' }}>
              <button style={{ background: 'none', border: 'none', color: C.blue, fontSize: 12, fontFamily: BODY, fontWeight: 600, cursor: 'pointer' }}>↓ Download Voucher</button>
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
      <div style={{ ...card, padding: 0, overflow: 'hidden', background: '#EDF0F7', paddingBottom: '72%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 10 }}>
          {MAP_AREAS.map((a) => (
            <div key={a.id} onClick={() => setMapSelected(mapSelected === a.id ? null : a.id)} style={{
              position: 'absolute', left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%`,
              background: mapSelected === a.id ? `${a.color}30` : `${a.color}18`,
              border: `1.5px solid ${mapSelected === a.id ? a.color : `${a.color}60`}`,
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', padding: 4, boxSizing: 'border-box',
              opacity: mapSelected && mapSelected !== a.id ? 0.3 : 1,
              boxShadow: mapSelected === a.id ? `0 2px 8px ${a.color}40` : 'none',
            }}>
              <span style={{ fontSize: a.w > 30 ? 9 : 7, fontWeight: 700, color: a.color, textAlign: 'center', fontFamily: BODY, lineHeight: 1.2 }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
      {mapSelected && (() => {
        const area = MAP_AREAS.find((a) => a.id === mapSelected);
        return (
          <div style={{ ...card, marginTop: 10, borderColor: `${area.color}40`, borderLeft: `3px solid ${area.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: area.color, flexShrink: 0 }} />
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text }}>{area.name}</div>
            </div>
            <div style={{ fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.65 }}>{area.desc}</div>
          </div>
        );
      })()}
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[{ color: C.blue, label: 'Plenária' }, { color: '#1A6DFF', label: 'Salas' }, { color: C.success, label: 'Alimentação' }, { color: C.warning, label: 'Convivência' }, { color: '#FFD000', label: 'Exposições' }, { color: '#7C3AED', label: 'Externa' }, { color: C.red, label: 'Recepção' }].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: 10, fontFamily: BODY, color: C.textMuted, fontWeight: 500 }}>{l.label}</span>
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
        <div style={{ background: C.blue, borderRadius: 14, padding: '28px 24px', textAlign: 'center', marginBottom: 14, boxShadow: C.shadowLg, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,208,0,0.12)' }} />
          <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Grupo Casas Bahia · Convenção de Vendas 2026</div>
          <div style={{ margin: '0 auto 16px', display: 'inline-block' }}><QRPlaceholder size={110} /></div>
          <div style={{ fontFamily: BODY, fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>João da Silva</div>
          <div style={{ fontSize: 13, fontFamily: BODY, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>Gerente de Vendas</div>
          <div style={{ fontSize: 12, fontFamily: MONO, color: C.yellow, letterSpacing: '0.06em', marginBottom: 16 }}>Casas Bahia · SP Capital</div>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '4px 14px' }}>
            <span style={{ fontSize: 12, fontFamily: MONO, fontWeight: 500, color: '#FFFFFF' }}>ID: CB-2026-4821</span>
          </div>
        </div>
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text }}>Brindes Coletados</div>
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.textSub, fontWeight: 500 }}>{collected}/{brindes.length}</span>
          </div>
          <div style={{ height: 6, background: '#F2F4F8', borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(collected / brindes.length) * 100}%`, background: C.blue, borderRadius: 3, transition: 'width 0.5s ease' }} />
          </div>
          {brindes.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < brindes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 13, fontFamily: BODY, color: b.collected ? C.text : C.textMuted, fontWeight: b.collected ? 500 : 400 }}>{b.name}</span>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: b.collected ? C.success : 'transparent', border: `2px solid ${b.collected ? C.success : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {b.collected && <span style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text, marginBottom: 12 }}>Conquistas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {badges.map((b, i) => (
              <div key={i} style={{ background: b.earned ? C.blueDim : '#F8F9FC', border: `1px solid ${b.earned ? 'rgba(0,48,135,0.2)' : C.border}`, borderRadius: 10, padding: '14px 10px', textAlign: 'center', opacity: b.earned ? 1 : 0.4 }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: BODY, color: b.earned ? C.blue : C.textMuted, marginBottom: 4 }}>{b.name}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: b.earned ? C.blue : C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{b.earned ? '✓ Desbloqueado' : 'Bloqueado'}</div>
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
      <div style={{ ...card, marginBottom: 16, textAlign: 'center', background: visitedStands.size === STANDS.length ? C.successDim : C.blueDim, borderColor: visitedStands.size === STANDS.length ? 'rgba(5,150,105,0.25)' : 'rgba(0,48,135,0.15)' }}>
        <div style={{ fontFamily: BODY, fontSize: 40, fontWeight: 800, color: visitedStands.size === STANDS.length ? C.success : C.blue, lineHeight: 1, letterSpacing: '-0.03em' }}>
          {visitedStands.size}<span style={{ fontSize: 18, color: C.textMuted, fontWeight: 400 }}> / {STANDS.length}</span>
        </div>
        <div style={{ fontSize: 11, fontFamily: MONO, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Estandes Visitados</div>
        <div style={{ height: 6, background: C.border, borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(visitedStands.size / STANDS.length) * 100}%`, background: visitedStands.size === STANDS.length ? C.success : C.blue, borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
        {visitedStands.size === STANDS.length && <div style={{ color: C.success, fontSize: 13, fontFamily: BODY, fontWeight: 600, marginTop: 10 }}>Rota de Vendas concluída! 🎉</div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {STANDS.map((s) => {
          const visited = visitedStands.has(s.id);
          return (
            <div key={s.id} onClick={() => { const n = new Set(visitedStands); visited ? n.delete(s.id) : n.add(s.id); setVisitedStands(n); }} style={{ background: visited ? C.successDim : C.card, border: `1.5px solid ${visited ? 'rgba(5,150,105,0.25)' : C.border}`, borderRadius: 10, padding: '14px 12px', cursor: 'pointer', transition: 'all 0.18s', textAlign: 'center', boxShadow: C.shadow }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: visited ? C.success : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text, margin: '2px 0' }}>{s.name}</div>
              <div style={{ fontSize: 11, fontFamily: BODY, color: C.textMuted, marginBottom: 10 }}>{s.cat}</div>
              <div style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 100, fontSize: 11, fontFamily: BODY, fontWeight: 700, background: visited ? C.success : C.blue, color: '#FFFFFF' }}>
                {visited ? '✓ Visitado' : 'Visitar'}
              </div>
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
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: MONO, color: '#FFFFFF', flexShrink: 0 }}>EU</div>
          <div style={{ flex: 1 }}>
            <textarea placeholder="Compartilhe algo com o evento..." value={newPostText} onChange={(e) => setNewPostText(e.target.value)} style={{ ...inp, resize: 'none', height: 64, fontSize: 14, padding: '10px 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button style={{ ...btnGhost, padding: '7px 14px', fontSize: 12, borderRadius: 7 }}>📷 Foto</button>
              <button style={{ ...btnBlue, padding: '7px 18px', fontSize: 12, borderRadius: 7 }}>Publicar</button>
            </div>
          </div>
        </div>
      </div>
      {FEED_POSTS.map((post) => {
        const liked = likedPosts.has(post.id);
        return (
          <div key={post.id} style={{ ...card, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: post.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: MONO, color: 'white', flexShrink: 0 }}>{post.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: BODY, color: C.text }}>{post.user}</div>
                <div style={{ fontSize: 11, fontFamily: MONO, color: C.textMuted }}>{post.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontFamily: BODY, lineHeight: 1.65, color: C.textSub, marginBottom: post.photo ? 10 : 0 }}>{post.text}</div>
            {post.photo && <div style={{ height: 120, borderRadius: 8, marginBottom: 10, background: `linear-gradient(135deg, ${post.photoColor}, ${post.photoColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, fontFamily: BODY, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>Foto do Evento</span></div>}
            <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => { const n = new Set(likedPosts); liked ? n.delete(post.id) : n.add(post.id); setLikedPosts(n); }} style={{ background: 'none', border: 'none', color: liked ? C.red : C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: BODY, fontWeight: liked ? 700 : 400, display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s' }}>
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
        <div key={i} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} style={{ background: C.card, border: `1px solid ${faqOpen === i ? C.blue : C.border}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', marginBottom: 8, boxShadow: faqOpen === i ? `0 0 0 3px ${C.blueDim}` : C.shadow, transition: 'all 0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontFamily: BODY, fontWeight: 500, color: C.text, flex: 1, paddingRight: 14, lineHeight: 1.45 }}>{item.q}</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: faqOpen === i ? C.blue : '#F2F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <span style={{ fontSize: 16, color: faqOpen === i ? '#FFFFFF' : C.textMuted, lineHeight: 1, transform: faqOpen === i ? 'rotate(45deg)' : 'none', display: 'block', transition: 'transform 0.25s' }}>+</span>
            </div>
          </div>
          {faqOpen === i && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, fontSize: 13, fontFamily: BODY, color: C.textSub, lineHeight: 1.75 }}>{item.a}</div>}
        </div>
      ))}
    </div>
  );

  // ── Router ────────────────────────────────────────────────────────────────

  const sections = { home: renderHome, cadastro: renderCadastro, agenda: renderAgenda, logistica: renderLogistica, vouchers: renderVouchers, mapa: renderMapa, qr: renderQR, estandes: renderEstandes, feed: renderFeed, faq: renderFAQ };

  const sectionList = [
    { key: 'home', label: 'Início', sub: 'Página inicial', icon: '🏠' },
    { key: 'cadastro', label: 'Cadastro', sub: 'Inscrição no evento', icon: '📝' },
    { key: 'agenda', label: 'Agenda', sub: 'Programação completa', icon: '📅' },
    { key: 'logistica', label: 'Logística', sub: 'Transporte e hotel', icon: '🗺️' },
    { key: 'vouchers', label: 'Vouchers', sub: 'Vouchers digitais', icon: '🎫' },
    { key: 'mapa', label: 'Mapa do Evento', sub: 'Layout do hotel', icon: '📍' },
    { key: 'qr', label: 'Identificação', sub: 'Crachá e QR Code', icon: '🪪' },
    { key: 'estandes', label: 'Estandes', sub: 'Feira de fornecedores', icon: '🏪' },
    { key: 'feed', label: 'Feed', sub: 'Timeline ao vivo', icon: '📢' },
    { key: 'faq', label: 'FAQ', sub: 'Dúvidas frequentes', icon: '❓' },
  ];

  const bottomTabs = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'agenda', label: 'Agenda', icon: '📅' },
    { key: 'mapa', label: 'Mapa', icon: '📍' },
    { key: 'feed', label: 'Feed', icon: '📢' },
    { key: 'menu', label: 'Menu', icon: '☰' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: BODY, paddingBottom: 80 }}>

      {/* Top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueLight} 60%, ${C.yellow} 100%)` }} />

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#FFFFFF', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 4, zIndex: 99, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, fontFamily: MONO, color: C.yellow, letterSpacing: '0.02em' }}>CB</div>
          <div>
            <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>Convenção de Vendas</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: C.textMuted, letterSpacing: '0.1em' }}>2026 · ATIBAIA</div>
          </div>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: MONO, color: C.textMuted, letterSpacing: '0.1em' }}>28–29 SET</span>
        </div>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {sections[section] ? sections[section]() : renderHome()}
      </div>

      {/* Menu overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderRadius: '20px 20px 0 0', padding: '20px 16px 100px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: BODY, color: C.text, marginBottom: 16, letterSpacing: '-0.02em' }}>Menu</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {sectionList.map((s) => (
                <button key={s.key} onClick={() => navigate(s.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: section === s.key ? C.blueDim : '#F8F9FC', border: `1.5px solid ${section === s.key ? C.blue : C.border}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: section === s.key ? 700 : 500, fontFamily: BODY, color: section === s.key ? C.blue : C.text }}>{s.label}</div>
                    <div style={{ fontSize: 10, fontFamily: BODY, color: C.textMuted }}>{s.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      {showInstall && (
        <>
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes sheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
          `}</style>
          <div onClick={dismissInstall} style={{ position: 'fixed', inset: 0, zIndex: 290, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', animation: 'fadeIn 0.25s ease' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300, background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '0 0 env(safe-area-inset-bottom, 24px)', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)', animation: 'sheetUp 0.35s cubic-bezier(0.32,0.72,0,1)', maxWidth: 520, margin: '0 auto' }}>

            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E2E6EF', margin: '12px auto 0' }} />

            {/* Header azul */}
            <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, #0044B0 100%)`, margin: '16px 16px 0', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,208,0,0.15)' }} />
              {/* Ícone simulado */}
              <div style={{ width: 60, height: 60, borderRadius: 14, background: C.blue, border: '3px solid rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: C.yellow, lineHeight: 1 }}>CB</div>
                <div style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>2026</div>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, fontFamily: BODY, color: '#FFFFFF', letterSpacing: '-0.02em' }}>Instalar o App</div>
                <div style={{ fontSize: 13, fontFamily: BODY, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>Convenção CB 2026</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {['Gratuito', 'Offline', 'Rápido'].map((tag) => (
                    <span key={tag} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '2px 9px', fontSize: 10, fontFamily: BODY, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div style={{ padding: '20px 16px 16px' }}>
              <div style={{ fontSize: 12, fontFamily: MONO, fontWeight: 500, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Por que instalar?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '⚡', title: 'Acesso instantâneo', sub: 'Abra direto da tela inicial sem precisar de navegador' },
                  { icon: '📶', title: 'Funciona offline', sub: 'Agenda e informações disponíveis mesmo sem internet' },
                  { icon: '🔔', title: 'Notificações do evento', sub: 'Receba avisos importantes da organização em tempo real' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: C.blueDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{b.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: BODY, color: C.text }}>{b.title}</div>
                      <div style={{ fontSize: 12, fontFamily: BODY, color: C.textMuted, marginTop: 1, lineHeight: 1.4 }}>{b.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Passos iOS */}
            {isIOS && (
              <div style={{ margin: '0 16px 16px', background: '#FFF8E1', border: '1px solid rgba(255,208,0,0.4)', borderRadius: 12, padding: '14px' }}>
                <div style={{ fontSize: 12, fontFamily: BODY, fontWeight: 700, color: '#7A5C00', marginBottom: 10 }}>Como instalar no iPhone / iPad:</div>
                {[
                  { step: '1', text: 'Toque no ícone de Compartilhar', icon: '⎦' },
                  { step: '2', text: 'Role para baixo e toque em', icon: '📲', bold: '"Adicionar à Tela de Início"' },
                  { step: '3', text: 'Confirme tocando em "Adicionar"', icon: '✓' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < 2 ? 8 : 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, fontFamily: MONO, color: C.blue, flexShrink: 0 }}>{s.step}</div>
                    <div style={{ fontSize: 12, fontFamily: BODY, color: '#5C4A00' }}>
                      {s.text} <span style={{ fontSize: 14 }}>{s.icon}</span>
                      {s.bold && <strong style={{ color: '#3D3000' }}> {s.bold}</strong>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botões */}
            <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!isIOS && (
                <button onClick={handleInstall} style={{ ...btnYellow, width: '100%', padding: '15px', fontSize: 15, borderRadius: 12, boxShadow: `0 4px 16px ${C.yellowDim}` }}>
                  📲 Instalar Agora — É Grátis
                </button>
              )}
              <button onClick={dismissInstall} style={{ background: 'transparent', border: 'none', padding: '10px', fontSize: 13, fontFamily: BODY, fontWeight: 600, color: C.textMuted, cursor: 'pointer' }}>
                Agora não
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom tab bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, background: '#FFFFFF', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        {bottomTabs.map((t) => {
          const active = t.key === 'menu' ? menuOpen : section === t.key;
          return (
            <button key={t.key} onClick={() => t.key === 'menu' ? setMenuOpen(!menuOpen) : navigate(t.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '10px 0 12px', flex: 1, borderTop: `2.5px solid ${active ? C.blue : 'transparent'}`, transition: 'all 0.15s' }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontFamily: BODY, fontWeight: active ? 700 : 500, color: active ? C.blue : C.textMuted, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
