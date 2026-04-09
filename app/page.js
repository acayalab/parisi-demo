'use client';

import Image from 'next/image';
import { startTransition, useEffect, useId, useState } from 'react';
import styles from './page.module.css';

const EVENT_DATE = new Date('2026-09-28T09:00:00-03:00');

const sections = [
  { key: 'home', label: 'Visão geral', group: 'primary', blurb: 'Status do participante, atalhos e leitura do evento.' },
  { key: 'agenda', label: 'Agenda', group: 'primary', blurb: 'Programação executiva do encontro.' },
  { key: 'logistica', label: 'Logística', group: 'primary', blurb: 'Aéreo, transfer e hospedagem.' },
  { key: 'qr', label: 'Credencial', group: 'primary', blurb: 'Identificação digital e benefícios.' },
  { key: 'cadastro', label: 'Cadastro', group: 'secondary', blurb: 'Confirmação de presença.' },
  { key: 'vouchers', label: 'Vouchers', group: 'secondary', blurb: 'Documentos digitais da viagem.' },
  { key: 'mapa', label: 'Mapa', group: 'secondary', blurb: 'Leitura do espaço e fluxos.' },
  { key: 'estandes', label: 'Fornecedores', group: 'secondary', blurb: 'Rota da feira e progresso da visitação.' },
  { key: 'feed', label: 'Atualizações', group: 'secondary', blurb: 'Comunicados e publicações do evento.' },
  { key: 'faq', label: 'FAQ', group: 'secondary', blurb: 'Dúvidas recorrentes.' },
];

const regions = ['SP Capital', 'SP Interior', 'RJ', 'MG', 'Sul', 'Norte', 'Nordeste', 'Centro-Oeste'];

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function getCountdownState() {
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function QRPlaceholder({ size = 92 }) {
  const cells = [];
  const seed = [1,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1];
  const grid = 8;
  const cellSize = size / grid;
  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < grid; col += 1) {
      const corner = (row < 3 && col < 3) || (row < 3 && col >= grid - 3) || (row >= grid - 3 && col < 3);
      if (corner || seed[(row * grid + col) % seed.length]) cells.push({ x: col * cellSize, y: row * cellSize });
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect width={size} height={size} rx="16" fill="#ffffff" />
      {cells.map((cell, index) => <rect key={index} x={cell.x} y={cell.y} width={cellSize} height={cellSize} fill="#0a1f8f" />)}
    </svg>
  );
}

function BrandSignature({ compact = false }) {
  return (
    <div className={cx(styles.brand, compact && styles.brandCompact)}>
      <div className={styles.brandFrame}>
        <Image src="/casas-bahia-logo-transparent.png" alt="Casas Bahia" width={compact ? 112 : 144} height={compact ? 30 : 38} />
      </div>
      <div className={styles.brandCopy}>
        <span>Convenção de Vendas 2026</span>
        <strong>Tauá Hotel & Convention · Atibaia</strong>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, description, note, actions }) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionCopy}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? <p className={styles.sectionDescription}>{description}</p> : null}
        {note ? <div className={styles.sectionNote}>{note}</div> : null}
      </div>
      {actions ? <div className={styles.buttonRow}>{actions}</div> : null}
    </div>
  );
}

function Panel({ className, children }) {
  return <div className={cx(styles.panel, className)}>{children}</div>;
}

function Field({ label, error, as = 'input', options = [], className, ...props }) {
  const id = useId();
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id}>{label}</label>
      {as === 'input' ? <input id={id} {...props} /> : null}
      {as === 'textarea' ? <textarea id={id} {...props} /> : null}
      {as === 'select' ? (
        <select id={id} {...props}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : null}
      {error ? <div className={styles.fieldError}>{error}</div> : null}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <>
      <button className={styles.backdrop} aria-label="Fechar" onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHead}>
          <div>
            <div className={styles.eyebrow}>Ação do aplicativo</div>
            <h3 className={styles.modalTitle}>{title}</h3>
            {subtitle ? <p className={styles.modalText}>{subtitle}</p> : null}
          </div>
          <button className={styles.modalClose} type="button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </>
  );
}

const agendaDay1 = [
  { time: '08h – 09h', title: 'Credenciamento', location: 'Hall principal', category: 'Operação' },
  { time: '09h – 10h', title: 'Abertura oficial', location: 'Plenária principal', category: 'Plenária' },
  { time: '10h – 11h30', title: 'Palestra: Estratégias 2027', location: 'Plenária principal', category: 'Plenária' },
  { time: '11h30 – 12h', title: 'Coffee break', location: 'Área de convivência', category: 'Intervalo' },
  { time: '12h – 13h30', title: 'Almoço', location: 'Restaurante', category: 'Intervalo' },
  { time: '14h – 16h', title: 'Workshops simultâneos', location: 'Salas 1–4', category: 'Workshops' },
  { time: '16h – 18h', title: 'Rota de vendas e feira de fornecedores', location: 'Pavilhão de exposições', category: 'Fornecedores' },
  { time: '20h – 00h', title: 'Recepção de abertura', location: 'Área externa', category: 'Relacionamento' },
];

const agendaDay2 = [
  { time: '09h – 10h30', title: 'Palestra motivacional', location: 'Plenária principal', category: 'Plenária' },
  { time: '10h30 – 11h', title: 'Coffee break', location: 'Área de convivência', category: 'Intervalo' },
  { time: '11h – 12h30', title: 'Painéis temáticos', location: 'Salas 1–3', category: 'Workshops' },
  { time: '12h30 – 14h', title: 'Almoço', location: 'Restaurante', category: 'Intervalo' },
  { time: '14h – 15h30', title: 'Premiações e reconhecimentos', location: 'Plenária principal', category: 'Plenária' },
  { time: '15h30 – 16h30', title: 'Encerramento', location: 'Plenária principal', category: 'Plenária' },
];

const logistics = {
  aereo: {
    status: 'Confirmado',
    title: 'Voo ida e volta',
    summary: 'Bilhetes emitidos para o trecho São Paulo ↔ Campinas.',
    cards: [
      { label: 'Ida · 27 set 2026', from: 'GRU', fromCity: 'São Paulo', depart: '14:30', to: 'VCP', toCity: 'Campinas', arrive: '15:45', code: 'LATAM 3421', duration: '1h 15min' },
      { label: 'Volta · 29 set 2026', from: 'VCP', fromCity: 'Campinas', depart: '19:00', to: 'GRU', toCity: 'São Paulo', arrive: '20:15', code: 'LATAM 3422', duration: '1h 15min' },
    ],
  },
  transfer: {
    status: 'Em confirmação',
    title: 'Transfer executivo',
    summary: 'Operação dedicada entre aeroporto e hotel.',
    cards: [
      { label: 'Ida · aeroporto → hotel', detailA: 'Saída: Aeroporto VCP · 16:00', detailB: 'Chegada prevista: Tauá Hotel · 17:30' },
      { label: 'Volta · hotel → aeroporto', detailA: 'Saída: Tauá Hotel · 17:00', detailB: 'Chegada prevista: Aeroporto VCP · 18:30' },
    ],
  },
  hotel: {
    status: 'Confirmado',
    title: 'Hospedagem oficial',
    summary: 'Reserva ativa no Tauá Hotel & Convention.',
    cards: [
      { label: 'Check-in', value: '27/09 · 14h' },
      { label: 'Check-out', value: '29/09 · 12h' },
      { label: 'Quarto', value: 'Standard duplo' },
      { label: 'Reserva', value: 'TAU-88421' },
    ],
    footnote: 'Incluso: café da manhã, Wi-Fi e acesso à área de lazer.',
  },
};

const vouchers = [
  { type: 'Aéreo', code: 'VCH-AER-7721', lines: ['GRU → VCP · 27/09 às 14:30', 'VCP → GRU · 29/09 às 19:00'], tone: 'blue' },
  { type: 'Terrestre', code: 'VCH-TER-3349', lines: ['Transfer aeroporto ↔ Tauá Hotel', 'Ida e volta inclusos'], tone: 'gold' },
  { type: 'Hospedagem', code: 'VCH-HOS-5512', lines: ['Tauá Hotel · 27/09 a 29/09', 'Standard duplo'], tone: 'green' },
];

const stands = [
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

const initialPosts = [
  { id: 1, user: 'Mariana Silva', initials: 'MS', role: 'Time comercial', time: 'Agora', text: 'Credenciamento concluído em poucos minutos. Recepção organizada e fluxo de entrada estável.', color: '#c25059', likes: 24, comments: 5 },
  { id: 2, user: 'Carlos Mendes', initials: 'CM', role: 'Equipe regional', time: '5 min', text: 'Workshop de negociação com abordagem prática e material de apoio claro.', color: '#3d6e8a', likes: 18, comments: 3 },
  { id: 3, user: 'Ana Beatriz', initials: 'AB', role: 'SP Capital', time: '15 min', text: 'A mensagem sobre direcionadores de 2027 trouxe clareza e bom nível de síntese.', color: '#2a8f80', likes: 42, comments: 12 },
  { id: 4, user: 'Equipe Organização', initials: 'EO', role: 'Operação do evento', time: '30 min', text: 'Plenária reabre às 14h em ponto. Antecipe o deslocamento após o almoço.', color: '#0a1f8f', likes: 56, comments: 8 },
];

const faqItems = [
  { q: 'Qual a senha do Wi-Fi do evento?', a: 'Rede: CB_Convencao2026 | Senha: vendas2026! Disponível nas áreas comuns do hotel.' },
  { q: 'Qual o dress code do evento?', a: 'Dia 1 e 2: smart casual. Recepção de abertura: casual / esporte fino.' },
  { q: 'Há estacionamento no local?', a: 'Sim. O Tauá Hotel dispõe de estacionamento gratuito. A ocupação varia ao longo do dia.' },
  { q: 'Qual o horário de check-in?', a: 'Check-in a partir das 14h do dia 27/09. Check-out até 12h do dia 29/09.' },
  { q: 'As refeições estão incluídas?', a: 'Sim. Café da manhã, almoço, coffee breaks e jantar fazem parte da operação do evento.' },
  { q: 'Contato para emergências?', a: 'A central do evento opera por WhatsApp durante todo o encontro. O número está no kit do participante.' },
];

const mapAreas = [
  { id: 'plenaria', area: 'plenary', name: 'Plenária principal', tag: 'Plenária', desc: 'Auditório principal com palco central, telões laterais e capacidade para 1.500 pessoas.' },
  { id: 'sala1', area: 'room1', name: 'Sala 1', tag: 'Workshop', desc: 'Sala dedicada a workshops táticos e sessões de treinamento.' },
  { id: 'sala2', area: 'room2', name: 'Sala 2', tag: 'Workshop', desc: 'Sala de apoio para painéis simultâneos.' },
  { id: 'sala3', area: 'room3', name: 'Sala 3', tag: 'Workshop', desc: 'Espaço para sessões temáticas de produto e operação.' },
  { id: 'sala4', area: 'room4', name: 'Sala 4', tag: 'Workshop', desc: 'Sala flexível para briefings e ativações de apoio.' },
  { id: 'restaurante', area: 'restaurant', name: 'Restaurante', tag: 'Alimentação', desc: 'Buffet principal para almoço, jantar e hospitalidade.' },
  { id: 'convivencia', area: 'lounge', name: 'Convivência', tag: 'Networking', desc: 'Ponto de encontro com coffee break, mesas de apoio e circulação livre.' },
  { id: 'pavilhao', area: 'expo', name: 'Pavilhão de exposições', tag: 'Fornecedores', desc: 'Área dos estandes, demonstrações e rota comercial.' },
  { id: 'externa', area: 'outdoor', name: 'Área externa', tag: 'Relacionamento', desc: 'Espaço para recepção, ativações e integração.' },
  { id: 'recepcao', area: 'entry', name: 'Recepção', tag: 'Operação', desc: 'Entrada principal com credenciamento, kits e orientação de fluxo.' },
];

const badges = [
  { title: 'Early arrival', threshold: 0 },
  { title: 'Networker', threshold: 0 },
  { title: 'Explorador', threshold: 6 },
  { title: 'Circuito completo', threshold: 12 },
];

export default function Home() {
  const [section, setSection] = useState('home');
  const [agendaDay, setAgendaDay] = useState(1);
  const [logisticsTab, setLogisticsTab] = useState('aereo');
  const [mapSelected, setMapSelected] = useState('plenaria');
  const [faqOpen, setFaqOpen] = useState(-1);
  const [visitedStands, setVisitedStands] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostText, setNewPostText] = useState('');
  const [feedPosts, setFeedPosts] = useState(initialPosts);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [countdown, setCountdown] = useState(getCountdownState);
  const [regForm, setRegForm] = useState({ nome: '', email: '', telefone: '', empresa: '', cargo: '', regional: '' });
  const [regErrors, setRegErrors] = useState({});
  const [regSubmitted, setRegSubmitted] = useState(false);

  useEffect(() => {
    const tick = () => setCountdown(getCountdownState());
    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const iosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    setIsIOS(iosDevice);
    if (iosDevice) setInstallAvailable(true);
    const handler = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setInstallAvailable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const currentSection = sections.find((item) => item.key === section);
  const agenda = agendaDay === 1 ? agendaDay1 : agendaDay2;
  const activeLogistics = logistics[logisticsTab];
  const area = mapAreas.find((item) => item.id === mapSelected) || mapAreas[0];
  const progress = Math.round((visitedStands.size / stands.length) * 100);
  const regCode = `CB-2026-${String((regForm.nome.length + regForm.email.length + 4821) % 9000 + 1000).padStart(4, '0')}`;

  const navigate = (next) => {
    startTransition(() => setSection(next));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStand = (id) => {
    setVisitedStands((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id) => {
    setLikedPosts((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const publishPost = () => {
    const text = newPostText.trim();
    if (!text) return;
    setFeedPosts((current) => [{ id: Date.now(), user: 'Você', initials: 'VO', role: 'Participante', time: 'Agora', text, color: '#1439d8', likes: 0, comments: 0 }, ...current]);
    setNewPostText('');
  };

  const validateRegistration = () => {
    const nextErrors = {};
    if (!regForm.nome.trim()) nextErrors.nome = 'Informe o nome completo.';
    if (!regForm.email.trim()) nextErrors.email = 'Informe o e-mail.';
    else if (!/\S+@\S+\.\S+/.test(regForm.email)) nextErrors.email = 'Use um e-mail válido.';
    if (!regForm.telefone.trim()) nextErrors.telefone = 'Informe o telefone.';
    if (!regForm.empresa.trim()) nextErrors.empresa = 'Informe a empresa.';
    if (!regForm.cargo.trim()) nextErrors.cargo = 'Informe o cargo.';
    if (!regForm.regional.trim()) nextErrors.regional = 'Selecione a regional.';
    setRegErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitRegistration = (event) => {
    event.preventDefault();
    if (validateRegistration()) setRegSubmitted(true);
  };

  const handleInstall = async () => {
    if (isIOS || !installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallOpen(false);
      setInstallAvailable(false);
      setInstallPrompt(null);
    }
  };

  const renderHome = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Leitura executiva" title="O app precisa responder primeiro ao participante" description="A visão geral concentra próxima ação, situação logística, credencial e utilidades críticas com leitura imediata." />
      <div className={styles.summaryGrid}>
        <Panel className={styles.panelAccent}>
          <div className={styles.stack}>
            <div className={styles.eyebrow}>Próximo momento</div>
            <h3 className={styles.largeTitle}>Abertura oficial</h3>
            <p className={styles.sectionDescription}>09h – 10h · Plenária principal</p>
            <div className={styles.cardList}>
              {[
                ['Credencial digital', 'Entrada liberada e identificação pronta.'],
                ['Logística do participante', 'Aéreo confirmado e transfer em acompanhamento.'],
                ['Rota de fornecedores', `${visitedStands.size} de ${stands.length} visitas já registradas.`],
              ].map(([title, text]) => (
                <div key={title} className={styles.infoCard}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel className={styles.panelSoft}>
          <div className={styles.stack}>
            <div className={styles.eyebrow}>Ações prioritárias</div>
            <div className={styles.buttonRow}>
              <button className={styles.buttonGhost} type="button" onClick={() => navigate('qr')}>Abrir credencial</button>
              <button className={styles.buttonGhost} type="button" onClick={() => navigate('agenda')}>Ver agenda</button>
              <button className={styles.buttonGhost} type="button" onClick={() => navigate('logistica')}>Revisar logística</button>
            </div>
            <div className={styles.progressBlock}>
              <div className={styles.progressHead}><strong>Rota comercial</strong><span>{progress}% concluído</span></div>
              <div className={styles.progressBar}><span style={{ width: `${progress}%` }} /></div>
            </div>
            {(installAvailable || isIOS) ? (
              <div className={styles.infoCard}>
                <strong>Instalação opcional</strong>
                <span>Sem pop-up agressivo. O app só oferece instalação quando fizer sentido para a operação.</span>
                <button className={styles.buttonQuiet} type="button" onClick={() => setInstallOpen(true)}>Ver instruções</button>
              </div>
            ) : null}
          </div>
        </Panel>
      </div>
      <div className={styles.metricGrid}>
        {[
          ['1.500', 'Participantes'],
          ['2', 'Dias de evento'],
          ['30+', 'Conteúdos'],
          ['50+', 'Fornecedores'],
        ].map(([value, label]) => (
          <div key={label} className={styles.metricCard}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgenda = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Programação" title="Agenda do encontro" description="Hora, categoria, local e leitura direta do que acontece." actions={
        <div className={styles.segment}>{[1, 2].map((day) => <button key={day} type="button" className={cx(styles.segmentButton, agendaDay === day && styles.segmentButtonActive)} onClick={() => setAgendaDay(day)}>Dia {day} · {day === 1 ? '28/09' : '29/09'}</button>)}</div>
      } />
      <div className={styles.timeline}>
        {agenda.map((item) => (
          <div key={`${item.time}-${item.title}`} className={styles.timelineItem}>
            <div className={styles.timelineMeta}>
              <div className={styles.timelineTime}>{item.time}</div>
              <div className={styles.timelineCategory}>{item.category}</div>
            </div>
            <div className={styles.timelineCopy}>
              <strong>{item.title}</strong>
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogistica = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Transporte e hospedagem" title="Logística do participante" description="Informação operacional reorganizada para funcionar em celular e navegador." actions={
        <div className={styles.segment}>{Object.keys(logistics).map((key) => <button key={key} type="button" className={cx(styles.segmentButton, logisticsTab === key && styles.segmentButtonActive)} onClick={() => setLogisticsTab(key)}>{key === 'aereo' ? 'Aéreo' : key === 'transfer' ? 'Transfer' : 'Hospedagem'}</button>)}</div>
      } />
      <Panel>
        <div className={styles.stack}>
          <div className={styles.headerRow}>
            <div>
              <div className={styles.eyebrow}>{activeLogistics.title}</div>
              <h3 className={styles.largeTitle}>{activeLogistics.summary}</h3>
            </div>
            <div className={styles.statusBadge}>{activeLogistics.status}</div>
          </div>
          {logisticsTab === 'aereo' ? (
            <div className={styles.gridTwo}>
              {activeLogistics.cards.map((card) => (
                <div key={card.label} className={styles.routeCard}>
                  <div className={styles.eyebrow}>{card.label}</div>
                  <div className={styles.route}>
                    <div><strong>{card.from}</strong><span>{card.fromCity}</span><span>{card.depart}</span></div>
                    <div className={styles.routeAxis}><span>{card.duration}</span><div className={styles.routeLine} /><span>{card.code}</span></div>
                    <div className={styles.routeTo}><strong>{card.to}</strong><span>{card.toCity}</span><span>{card.arrive}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {logisticsTab === 'transfer' ? (
            <div className={styles.gridTwo}>
              {activeLogistics.cards.map((card) => <div key={card.label} className={styles.infoCard}><strong>{card.label}</strong><span>{card.detailA}</span><span>{card.detailB}</span></div>)}
            </div>
          ) : null}
          {logisticsTab === 'hotel' ? (
            <>
              <div className={styles.gridTwo}>
                {activeLogistics.cards.map((card) => <div key={card.label} className={styles.infoCard}><strong>{card.label}</strong><span>{card.value}</span></div>)}
              </div>
              <span className={styles.sectionDescription}>{activeLogistics.footnote}</span>
            </>
          ) : null}
        </div>
      </Panel>
    </div>
  );

  const renderVouchers = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Documentos digitais" title="Vouchers centralizados" description="Cada voucher foi tratado como documento operacional, não como card decorativo." />
      <div className={styles.ticketGrid}>
        {vouchers.map((voucher) => (
          <div key={voucher.code} className={cx(styles.ticket, styles[`ticket${voucher.tone[0].toUpperCase()}${voucher.tone.slice(1)}`])}>
            <div className={styles.ticketHead}><span>{voucher.type}</span><strong>{voucher.code}</strong></div>
            <div className={styles.ticketBody}>
              <QRPlaceholder />
              <div className={styles.ticketLines}>
                {voucher.lines.map((line) => <span key={line}>{line}</span>)}
                <a className={styles.buttonQuiet} href="/Demo_Convencao_2026.pdf" target="_blank" rel="noreferrer">Baixar comprovante</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMapa = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Fluxo do espaço" title="Mapa do evento" description="O layout virou um board legível em qualquer largura de tela." />
      <Panel>
        <div className={styles.mapLayout}>
          {mapAreas.map((item) => (
            <button key={item.id} type="button" className={cx(styles.mapButton, mapSelected === item.id && styles.mapButtonActive)} style={{ gridArea: item.area }} onClick={() => setMapSelected(item.id)}>
              <span>{item.tag}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
        <div className={styles.infoCard}>
          <strong>{area.name}</strong>
          <span>{area.desc}</span>
        </div>
      </Panel>
    </div>
  );

  const renderQR = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Identificação" title="Credencial do participante" description="A credencial virou peça central da experiência, com informações claras e leitura institucional." />
      <div className={styles.identity}>
        <div className={styles.badgeCard}>
          <div className={styles.badgeHead}><BrandSignature /><QRPlaceholder size={104} /></div>
          <h3 className={styles.badgeName}>João da Silva</h3>
          <div className={styles.badgeMeta}><span>Gerente de vendas</span><span>Casas Bahia · SP Capital</span></div>
          <div className={styles.badgeId}>ID CB-2026-4821</div>
        </div>
        <div className={styles.stack}>
          <Panel>
            <div className={styles.stack}>
              <div className={styles.eyebrow}>Benefícios liberados</div>
              {['Kit de boas-vindas', 'Camiseta do evento', 'Ecobag', 'Power bank', 'Garrafa térmica'].map((item, index) => (
                <div key={item} className={styles.rowItem}>
                  <div><strong>{item}</strong><span>{index < 3 ? 'Disponível para retirada' : 'Liberação após nova ativação'}</span></div>
                  <div className={styles.statusBadge}>{index < 3 ? 'Liberado' : 'Aguardando'}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <div className={styles.badgeGrid}>
              {badges.map((badge) => {
                const earned = badge.threshold === 0 || visitedStands.size >= badge.threshold;
                return <div key={badge.title} className={cx(styles.badgeToken, !earned && styles.badgeTokenMuted)}><strong>{badge.title}</strong><span>{earned ? 'Ativo' : `Liberado a partir de ${badge.threshold} visitas`}</span></div>;
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );

  const renderEstandes = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Feira de fornecedores" title="Circuito de visitação" description="Progresso, fornecedor e categoria com estado claro." note={`${visitedStands.size} de ${stands.length} fornecedores visitados · ${progress}% do circuito`} />
      <Panel>
        <div className={styles.progressBar}><span style={{ width: `${progress}%` }} /></div>
        <div className={styles.standGrid}>
          {stands.map((stand) => {
            const visited = visitedStands.has(stand.id);
            return (
              <button key={stand.id} type="button" className={cx(styles.standCard, visited && styles.standCardVisited)} onClick={() => toggleStand(stand.id)}>
                <span>{stand.num}</span>
                <strong>{stand.name}</strong>
                <small>{stand.cat}</small>
                <div className={styles.statusBadge}>{visited ? 'Visitado' : 'Marcar visita'}</div>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );

  const renderFeed = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Atualizações do evento" title="Comunicados e publicações" description="O feed passou a funcionar como mural do encontro, sem estética de rede social genérica." />
      <div className={styles.feedGrid}>
        <Panel>
          <div className={styles.stack}>
            <div className={styles.eyebrow}>Nova publicação</div>
            <Field label="Compartilhar atualização" as="textarea" rows={5} placeholder="Escreva um comunicado, observação operacional ou destaque do evento." value={newPostText} onChange={(event) => setNewPostText(event.target.value)} />
            <div className={styles.buttonRow}><button className={styles.buttonGhost} type="button" onClick={publishPost}>Publicar atualização</button></div>
          </div>
        </Panel>
        <div className={styles.feedList}>
          {feedPosts.map((post) => {
            const liked = likedPosts.has(post.id);
            return (
              <div key={post.id} className={styles.feedCard}>
                <div className={styles.feedHead}>
                  <div className={styles.avatar} style={{ background: post.color }}>{post.initials}</div>
                  <div><strong>{post.user}</strong><span>{post.role} · {post.time}</span></div>
                </div>
                <p>{post.text}</p>
                <div className={styles.buttonRow}><button className={styles.buttonQuiet} type="button" onClick={() => toggleLike(post.id)}>{liked ? 'Remover apoio' : 'Apoiar'} · {post.likes + (liked ? 1 : 0)}</button><span className={styles.muted}>{post.comments} comentários</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Suporte rápido" title="Perguntas recorrentes" description="Accordion com prioridade de leitura e sem ruído visual excessivo." />
      <div className={styles.faqList}>
        {faqItems.map((item, index) => (
          <div key={item.q} className={styles.faqItem}>
            <button type="button" className={styles.faqQuestion} onClick={() => setFaqOpen((current) => current === index ? -1 : index)} aria-expanded={faqOpen === index}>
              <strong>{item.q}</strong>
              <span className={styles.statusBadge}>{faqOpen === index ? 'Fechar' : 'Abrir'}</span>
            </button>
            {faqOpen === index ? <div className={styles.faqAnswer}>{item.a}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCadastro = () => (
    <div className={styles.frame}>
      <SectionHead eyebrow="Confirmação de presença" title="Cadastro do participante" description="Formulário simplificado, com semântica correta e comportamento consistente em qualquer viewport." />
      <Panel>
        {regSubmitted ? (
          <div className={styles.confirm}>
            <div className={styles.confirmIcon}>✓</div>
            <strong className={styles.largeTitle}>Cadastro confirmado</strong>
            <p className={styles.sectionDescription}>{regForm.nome} foi registrado com sucesso. A confirmação foi enviada para {regForm.email}.</p>
            <div className={styles.infoCard}><strong>Código de confirmação</strong><span>{regCode}</span></div>
            <div className={styles.buttonRow}><button className={styles.buttonGhost} type="button" onClick={() => setRegSubmitted(false)}>Novo cadastro</button></div>
          </div>
        ) : (
          <form className={styles.formGrid} onSubmit={submitRegistration}>
            <Field label="Nome completo" autoComplete="name" placeholder="Seu nome completo" value={regForm.nome} onChange={(event) => setRegForm((current) => ({ ...current, nome: event.target.value }))} error={regErrors.nome} />
            <Field label="E-mail" type="email" autoComplete="email" placeholder="voce@empresa.com" value={regForm.email} onChange={(event) => setRegForm((current) => ({ ...current, email: event.target.value }))} error={regErrors.email} />
            <Field label="Telefone" type="tel" autoComplete="tel" placeholder="(11) 99999-0000" value={regForm.telefone} onChange={(event) => setRegForm((current) => ({ ...current, telefone: event.target.value }))} error={regErrors.telefone} />
            <Field label="Empresa" autoComplete="organization" placeholder="Nome da empresa" value={regForm.empresa} onChange={(event) => setRegForm((current) => ({ ...current, empresa: event.target.value }))} error={regErrors.empresa} />
            <Field label="Cargo" autoComplete="organization-title" placeholder="Seu cargo" value={regForm.cargo} onChange={(event) => setRegForm((current) => ({ ...current, cargo: event.target.value }))} error={regErrors.cargo} />
            <Field label="Regional" as="select" value={regForm.regional} onChange={(event) => setRegForm((current) => ({ ...current, regional: event.target.value }))} options={[{ value: '', label: 'Selecione sua regional' }, ...regions.map((region) => ({ value: region, label: region }))]} error={regErrors.regional} />
            <div className={cx(styles.field, styles.full)}><div className={styles.buttonRow}><button className={styles.buttonGhost} type="submit">Confirmar inscrição</button></div></div>
          </form>
        )}
      </Panel>
    </div>
  );

  const renderers = { home: renderHome, agenda: renderAgenda, logistica: renderLogistica, vouchers: renderVouchers, mapa: renderMapa, qr: renderQR, estandes: renderEstandes, feed: renderFeed, faq: renderFAQ, cadastro: renderCadastro };

  return (
    <div className={styles.app}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.topline}>
            <BrandSignature compact />
            <div className={styles.mobileSwitch}>
              <div><div className={styles.eyebrow}>Seção atual</div><strong>{currentSection.label}</strong></div>
              <button type="button" onClick={() => setMobileMenuOpen(true)}>Explorar seções</button>
            </div>
          </div>
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}><span />Plataforma oficial do evento</div>
              <h1 className={styles.heroTitle}>Convenção de vendas em padrão executivo</h1>
              <p className={styles.heroText}>O foco saiu do mock promocional e foi para o que importa na operação: leitura imediata, navegação limpa, responsividade real e presença institucional compatível com um cliente de grande porte.</p>
              <div className={styles.heroMeta}><span>28–29 de setembro de 2026</span><span>Tauá Hotel & Convention · Atibaia, SP</span></div>
              <div className={styles.buttonRow}><button className={styles.buttonPrimary} type="button" onClick={() => navigate('qr')}>Abrir credencial</button><button className={styles.buttonSecondary} type="button" onClick={() => navigate('agenda')}>Ver programação</button></div>
            </div>
            <aside className={styles.heroPanel}>
              <div className={styles.stack}><div className={styles.panelLabel}>Painel do participante</div><h2 className={styles.heroPanelTitle}>Tudo o que precisa estar visível já na primeira leitura</h2></div>
              <div className={styles.statusList}>
                <div className={styles.statusRow}><div><strong>Credencial digital</strong><span>Entrada liberada e identificação pronta.</span></div><div className={styles.statusChip}>Ativa</div></div>
                <div className={styles.statusRow}><div><strong>Logística</strong><span>Aéreo confirmado e transfer em monitoramento.</span></div><div className={styles.statusChip}>Revisar</div></div>
                <div className={styles.statusRow}><div><strong>Fornecedores visitados</strong><span>{visitedStands.size} de {stands.length} já registrados.</span></div><div className={styles.statusChip}>{progress}%</div></div>
              </div>
              <div className={styles.countdown}>{[['Dias', countdown.days], ['Horas', countdown.hours], ['Min', countdown.minutes], ['Seg', countdown.seconds]].map(([label, value]) => <div key={label} className={styles.countdownCell}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
            </aside>
          </div>
          <nav className={styles.nav}>{sections.map((item) => <button key={item.key} type="button" className={cx(styles.navPill, section === item.key && styles.navPillActive)} onClick={() => navigate(item.key)}>{item.label}</button>)}</nav>
        </header>
        <main className={styles.main}>{renderers[section]()}</main>
      </div>
      {mobileMenuOpen ? (
        <Modal title="Explorar seções" subtitle="A navegação foi reequilibrada para priorizar o que é crítico. As demais áreas continuam disponíveis em um painel único." onClose={() => setMobileMenuOpen(false)}>
          {['primary', 'secondary'].map((group) => (
            <div key={group} className={styles.stack}>
              <div className={styles.eyebrow}>{group === 'primary' ? 'Prioridade' : 'Complementares'}</div>
              {sections.filter((item) => item.group === group).map((item) => <button key={item.key} type="button" className={styles.menuItem} onClick={() => navigate(item.key)}><div><strong>{item.label}</strong><span>{item.blurb}</span></div><div className={styles.statusBadge}>{section === item.key ? 'Atual' : 'Abrir'}</div></button>)}
            </div>
          ))}
        </Modal>
      ) : null}
      {installOpen ? (
        <Modal title="Instalar aplicativo" subtitle="A instalação virou ação opcional e contextual, sem interferir na navegação principal." onClose={() => setInstallOpen(false)}>
          {isIOS ? (
            <ul className={styles.modalList}>
              <li>1. Abra o menu de compartilhamento do Safari.</li>
              <li>2. Selecione “Adicionar à Tela de Início”.</li>
              <li>3. Confirme para ter acesso rápido ao app durante o evento.</li>
            </ul>
          ) : (
            <div className={styles.buttonRow}><button className={styles.buttonGhost} type="button" onClick={handleInstall}>Instalar agora</button></div>
          )}
        </Modal>
      ) : null}
    </div>
  );
}
