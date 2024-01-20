"use client";

import { useSession } from "next-auth/react";

import Admin from "@components/Admin";
import { useState } from "react";

const Home = () => {
  // const { data: session } = useSession();
  const [temp, settemp] = useState("USER");

  return (
    <>
      <Admin />

      <div class="p-4 md:ml-64 h-auto pt-20">
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4">
          product-managment
        </div>
      </div>
    </>
  );
};

export default Home;
