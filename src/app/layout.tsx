import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it was causing an error and not used
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { AppLayout } from '@/components/AppLayout';
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'QA Daily Report',
  description: 'Daily reporting for underground pipeline projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} antialiased`}>
        <AppProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
