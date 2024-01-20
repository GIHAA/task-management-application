"use client";


import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import userServices from "./api/userServices";
import bg from "./assets/bg.jpg";
// import { authUser } from "./utils/jwt.js";

import jwt_decode from "jwt-decode";

const authUser = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    return jwt_decode(token);
  }
  return null;
};

const Home = () => {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { data: session } = useSession();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSignIn = async () => {
    try {
      const response = await userServices.signIn(formData);

      if (response.status === 200) {

        const token = response.data.data.token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("authRole", JSON.stringify(authUser()?.role));
        const role = JSON.parse(localStorage.getItem("authRole"));
        toast.success("Login successful");
        
        // Redirect to the admin page programmatically
        if(role === "SUPER_ADMIN"){ window.location.href = "/admin/Inventory-management";}
        if(role === "USER") window.location.href = "/home";


      } else {
        toast.error(`Error fetching data: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  return (
    <>

      <div
        className="overlay bg-cover bg-gray-50 dark:bg-gray-900"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={onChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500"
                  />

                </div>
                <button
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  onClick={onSignIn}
                >
                  Sign in
                </button>
                {/* {session ? (
                  // Display the "Admin" link when there is a valid session
                  <a href="/admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin</a>
                ) : null}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a href="/signup" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sign up</a>
                </p> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
