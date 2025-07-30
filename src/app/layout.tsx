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
