"use client";
import Sidebar from "@/components/Sidebar";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="h-full">
        <Sidebar />
        <main className="app">{children}</main>
    </body>
  </html>
);

export default RootLayout;