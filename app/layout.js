import './globals.css';

export const metadata = {
  title: 'CTRL PLAY | Carômetro dos Alunos',
  description: 'Sistema de gestão e acompanhamento dos alunos da CTRL PLAY.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
