import './globals.css';
import 'video.js/dist/video-js.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar';
import CommandPromptProvider from '@/components/CommandPromptProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'vcXvp',
  description: 'AI-powered voice-controlled video player built with Next.js',
  icons: {
    icon: [
      { url: '/Favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/Favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/Favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/Favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/Favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/Favicon/apple-touch-icon.png',
  },
  manifest: '/Favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <CommandPromptProvider>
          <Navbar />
          {children}
          <Analytics />
        </CommandPromptProvider>
      </body>
    </html>
  );
}
