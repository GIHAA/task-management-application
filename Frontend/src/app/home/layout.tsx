"use client";
//import 'react-toastify/dist/ReactToastify.css';
//import {ToastContainer} from 'react-toastify';
import Sidebar from "@/components/Sidebar";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="h-full">
        <Sidebar />
        <main className="app">{children}</main>
        {/* <ToastContainer /> */}
    </body>
  </html>
);

export default RootLayout;