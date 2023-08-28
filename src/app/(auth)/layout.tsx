import '../globals.css';
import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { dark } from '@clerk/themes';

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default AuthRootLayout;
