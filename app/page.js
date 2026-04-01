'use client';
import { useState } from 'react';

export default function Home() {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060E1F 0%, #0F2557 50%, #0D1E45 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ height: 4, background: '#CC0000', width: '100%' }} />
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', borderBottom: '1px solid rgba(30,52,96,0.5)',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8899AA' }}>
          SYS.PLATFORM // CONVENÇÃO DE VENDAS 2026
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6AADFF' }}>
          DEMO BUILD v2.0
        </span>
      </nav>

      {!showPdf ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '20px',
          textAlign: 'center', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(43,92,230,0.12) 0%, transparent 70%)',
            top: '20%', left: '50%', transform: 'translateX(-50%)',
          }} />
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 80px)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', position: 'relative' }}>CONVENÇÃO</h1>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 80px)', fontWeight: 900, margin: '0 0 16px 0', lineHeight: 1, letterSpacing: '-0.02em', position: 'relative' }}>DE VENDAS</h1>
          <h2 style={{ fontSize: 'clamp(48px, 10vw, 110px)', fontWeight: 900, margin: '0 0 24px 0', color: '#6AADFF', lineHeight: 1, position: 'relative' }}>2026</h2>
          <p style={{ fontSize: 16, color: '#A8D4FF', letterSpacing: '0.15em', marginBottom: 48, position: 'relative' }}>
            HOTSITE + PWA &nbsp;·&nbsp; PLATAFORMA DIGITAL DO EVENTO
          </p>
          <button onClick={() => setShowPdf(true)} style={{
            background: 'linear-gradient(135deg, #2B5CE6 0%, #1B3A8C 100%)', color: 'white',
            border: '1px solid rgba(106,173,255,0.3)', padding: '16px 48px', fontSize: 16,
            fontWeight: 700, borderRadius: 8, cursor: 'pointer', letterSpacing: '0.1em',
            boxShadow: '0 0 40px rgba(43,92,230,0.3)',
          }}>VER PROPOSTA COMPLETA</button>
          <a href="/Demo_Convencao_2026.pdf" download style={{
            marginTop: 16, fontSize: 13, color: '#8899AA', textDecoration: 'none', fontFamily: 'monospace',
          }}>↓ DOWNLOAD PDF</a>
          <div style={{
            position: 'absolute', bottom: 24, left: 32, right: 32,
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,52,96,0.5)',
            borderRadius: 8, padding: '12px 20px', fontFamily: 'monospace', fontSize: 11,
          }}>
            <span style={{ color: '#8899AA' }}>GRUPO CASAS BAHIA</span>
            <span style={{ color: '#6AADFF' }}>1.500 PARTICIPANTES</span>
            <span style={{ color: '#8899AA' }}>TAUÁ HOTEL & CONVENTION ATIBAIA</span>
            <span style={{ color: '#6AADFF' }}>28-29 SET 2026</span>
          </div>
        </div>
      ) : (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 32px', borderBottom: '1px solid rgba(30,52,96,0.5)',
          }}>
            <button onClick={() => setShowPdf(false)} style={{
              background: 'transparent', color: '#6AADFF', border: '1px solid rgba(106,173,255,0.3)',
              padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
            }}>← VOLTAR</button>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8899AA' }}>PROPOSTA TÉCNICA E COMERCIAL</span>
            <a href="/Demo_Convencao_2026.pdf" download style={{
              background: '#2B5CE6', color: 'white', border: 'none', padding: '8px 20px',
              borderRadius: 6, fontSize: 12, fontFamily: 'monospace', textDecoration: 'none',
            }}>↓ DOWNLOAD</a>
          </div>
          <iframe src="/Demo_Convencao_2026.pdf" style={{ flex: 1, border: 'none', width: '100%' }} title="Proposta" />
        </div>
      )}
    </div>
  );
}
