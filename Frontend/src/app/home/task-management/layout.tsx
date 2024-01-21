"use client";

import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="h-full">
        <main className="app">{children}</main>
        <ToastContainer />
    </body>
  </html>
);

export default RootLayout;