import './globals.css';

export const metadata = {
  title: 'HARNESS Engineering',
  description: 'Repository-first governance scaffold for safe Cursor agents.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
