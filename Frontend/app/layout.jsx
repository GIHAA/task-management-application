"use client";

import "@styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import Provider from "../components/Provider"

// export const metadata = {
//   title: "title",
//   description: "description",
// };

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="h-full">
      <Provider>
        <main className="app">{children}</main>
        <ToastContainer />
      </Provider>
    </body>
  </html>
);

export default RootLayout;
