"use client";

import Sidebar from "@/components/Sidebar";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="h-full">
        <main className="app">{children}</main>
    </body>
  </html>
);

export default RootLayout;