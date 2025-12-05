import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Self Mastery OS | Your Life Operating System',
  description: 'Track, measure, and optimize every dimension of your life. Built for high performers who want to level up.',
  keywords: ['self mastery', 'life tracking', 'productivity', 'habits', 'goals'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
