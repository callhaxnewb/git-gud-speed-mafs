import type {Metadata} from 'next';
import { Comic_Neue } from 'next/font/google';
import './globals.css'; // Global styles

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-comic-neue',
});

export const metadata: Metadata = {
  title: 'GIT GUD Speed Maths',
  description: 'A spaced-repetition math practice app optimized for mobile.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${comicNeue.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
