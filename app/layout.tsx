import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'حلو ومالح - Sweet & Salty Restaurant',
  description: 'Order delicious food from Sweet & Salty Restaurant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
