import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'xCloud Dashboard',
  description:
    '🎨 xCloud Dashboard - Web interface for managing deployments, analytics and team collaboration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
