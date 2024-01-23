// Import necessary modules and dependencies
"use client";
import AuthService from "@/api/authService";
import healthService from "@/api/heathService";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passWordValidator";
import bg from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const signInUser = async () => {
    try {
      const emailError = emailValidator(email.value);
      const passwordError = passwordValidator(password.value);

      if (emailError || passwordError) {
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwordError });
        throw new Error("Validation error");
      }

      const response = await AuthService.signIn({
        email: email.value,
        password: password.value,
      });

      if (response.status === 200) {
        const user = response.data.results[0];
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/home");
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.results.message) ||
        error.response.data.results[0].message ||
        error.message ||
        error.toString();

      throw new Error(message);
    }
  };

  const signInWithToast = () => {
    toast.promise(signInUser, {
      loading: "Loading...",
      success: (data) => {
        return `User logged in successfully`;
      },
      error: (error) => {
        return "Authentication failed! Try again.";
      },
    });
  };

  useEffect(() => {
    healthService.healthCheck();
  }, []);

  
  return (
    <div
      className="overlay bg-cover bg-gray-50 dark:bg-gray-900"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        ></a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>{" "}
                {email.error ? (
                  <span className="text-red-500 text-[13px]">
                    {" "}
                    {email.error}
                  </span>
                ) : (
                  <></>
                )}
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) =>
                    setEmail({ value: e.target.value, error: "" })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                {password.error ? (
                  <span className="text-red-500 text-[13px]">
                    {" "}
                    {password.error}
                  </span>
                ) : (
                  <></>
                )}
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>
                    setPassword({ value: e.target.value, error: "" })
                  }
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500"
                />
              </div>
              <p className="text-[14px] mt-[15px] text-gray-500">
                Don't have an account?
                <a href="/register" className="ml-1">
                  <span className="text-secondary font-[20px]">Register now</span>
                </a>
              </p>
  
              <div className="flex justify-end">
                <button
                  className="block text-sm font-medium text-gray-900 dark:text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:border-primary-700 rounded-lg p-2.5"
                  onClick={signInWithToast}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster closeButton richColors position="top-right" />
    </div>
  );
  

}
