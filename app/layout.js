export const metadata = {
  title: 'Convenção de Vendas 2026 — Demo',
  description: 'Hotsite + PWA — Grupo Casas Bahia',
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#060E1F' }}>{children}</body>
    </html>
  );
}
