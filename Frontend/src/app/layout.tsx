"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
      <body className={inter.className}>{children}</body>
      </StoreProvider>
      <ToastContainer />
    </html>
  );
}
