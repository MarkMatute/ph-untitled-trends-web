import '../globals.css';
import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

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
        <body className={`${inter.className} bg-dark2`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}

export default AuthRootLayout;
