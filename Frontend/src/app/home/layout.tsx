import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className="h-full">
      <main className="app">{children}</main>
      <Toaster richColors position="top-right"  />
    </body>
  </html>
);

export default RootLayout;
