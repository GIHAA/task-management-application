import React, { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className="h-full">
      
      <main className="app">{children}</main>
    </body>
  </html>
);

export default RootLayout;
