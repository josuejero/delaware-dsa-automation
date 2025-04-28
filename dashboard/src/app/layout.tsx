import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Delaware DSA Admin Dashboard',
  description: 'Administrative dashboard for Delaware DSA chapter operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
