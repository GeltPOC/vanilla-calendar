import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calendario Interactivo',
  description: 'Calendario interactivo con eventos y persistencia local',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}