"use client";
import AuthService from "@/api/authService";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passWordValidator";

import bg from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from "react";



export default function Home() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  // const onChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const onSignIn = async () => {
    try {
      const emailError = emailValidator(email.value);
      const passwoedError = passwordValidator(password.value);

      if (emailError || passwoedError) {
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwoedError });
        return;
      }

      // const response = await AuthService.signIn({
      //   email: email.value,
      //   password: password.value,
      // });
      dispatch(login({ email: email.value , password: password.value}))

       
    } catch (error : any) {
      const message =
      (error.response &&
        error.response.data &&
        error.response.data.results.message) || error.response.data.results[0].message ||
      error.message ||
      error.toString();

      console.log(error.response.data.results[0].message);
      setEmail({ ...email, error: message });
    }
  };

  const router = useRouter()
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      //navigate("/");
      router.push('/home', { scroll: false })
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message , router , dispatch]);


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
  );
}
