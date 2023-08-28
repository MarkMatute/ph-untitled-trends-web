import '../globals.css';
import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Topbar from '../../components/shared/Topbar';
import Bottombar from '../../components/shared/Bottombar';
import Leftsidebar from '../../components/shared/Leftsidebar';
import Rightsidebar from '../../components/shared/Rightsidebar';

export const metadata: Metadata = {
  title: 'PH Untitled Trends',
  description: 'A threads clone for PH',
};

type AuthRootLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({
  subsets: ['latin'],
});

function AuthRootLayout(props: AuthRootLayoutProps) {
  const { children } = props;
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-2`}>
          <Topbar />

          <main className="flex flex-row">
            <Leftsidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <Rightsidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}

export default AuthRootLayout;
