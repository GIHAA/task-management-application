// Import necessary modules and dependencies
"use client";
import AuthService from "@/api/authService";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passWordValidator";
import bg from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import { phoneNumebrValidator } from "@/helpers/phoneNumebrValidator";
import { inputValidator } from "@/helpers/inputValidator";

export default function Register() {
  const router = useRouter();

  const [firstName, setfirstName] = useState({ value: "", error: "" });
  const [lastName, setlastName] = useState({ value: "", error: "" });
  const [email, setemail] = useState({ value: "", error: "" });
  const [phoneNumber, setphoneNumber] = useState({ value: "", error: "" });
  const [gender, setGender] = useState({ value: "", error: "" });
  const [dob, setdob] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const handleOnPhoneNumberChange = (
    value: string,
    country: { countryCode: string }
  ) => {
    const PhoneValidationError = phoneNumebrValidator(value, country);
    setphoneNumber({ value, error: PhoneValidationError });
  };

  const signUpUser = async () => {
    try {
      const firstNameError = inputValidator("First Name", firstName.value);
      const lastNameError = inputValidator("Last Name", lastName.value);
      const dobError = inputValidator("Dob", dob.value);
      const emailError = emailValidator(email.value);
      const phoneNumberError = inputValidator(
        "Phone Number ",
        phoneNumber.value
      );
      const genderError = inputValidator("Gender", gender.value);
      const passwordError = passwordValidator(password.value);

      if (
        emailError ||
        firstNameError ||
        lastNameError ||
        phoneNumber.error ||
        phoneNumberError ||
        dobError ||
        genderError ||
        passwordError
      ) {
        setfirstName({ ...firstName, error: firstNameError });
        setlastName({ ...lastName, error: lastNameError });
        setemail({ ...email, error: emailError });
        setdob({ ...dob, error: emailError });
        setphoneNumber({ ...phoneNumber, error: phoneNumberError });
        setGender({ ...gender, error: genderError });
        setPassword({ ...password, error: passwordError });
        throw new Error("Validation error");
      }

      const response = await AuthService.signUp({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        gender: gender.value,
        dob: dob.value,
        password: password.value,
      });

        const user = response.data.results[0];
 
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/home");
 
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
    toast.promise(signUpUser, {
      loading: "Loading...",
      success: (data) => {
        return `User logged in successfully`;
      },
      error: (error) => {
        return "User Register failed";
      },
    });
  };
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
              Create new account
            </h1>
            <div className="space-y-4 md:space-y-6">
              {firstName.error ? (
                <span className="text-red-500 text-[13px]">
                  {" "}
                  {firstName.error}
                </span>
              ) : (
                <></>
              )}
              {lastName.error ? (
                <span className="text-red-500 text-[13px]">
                  {" "}
                  {lastName.error}
                </span>
              ) : (
                <></>
              )}
              <div className="flex">
                <input
                  type="text"
                  name="itemName"
                  id="itemName"
                  className={`bg-gray-50 border ${
                    firstName.error ? "outline-red-500 outline outline-1" : ""
                  } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Enter first name"
                  onChange={(e) =>
                    setfirstName({ ...firstName, value: e.target.value })
                  }
                />

                <input
                  type="text"
                  name="itemName"
                  id="itemName"
                  className={`bg-gray-50 border ${
                    lastName.error ? "outline-red-500 outline outline-1" : ""
                  } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Enter Last name"
                  onChange={(e) =>
                    setlastName({ ...lastName, value: e.target.value })
                  }
                />
              </div>
              <div>
                {email.error ? (
                  <span className="text-red-500 text-[13px]">
                    {" "}
                    {email.error}
                  </span>
                ) : (
                  <></>
                )}
                <input
                  type="text"
                  name="itemName"
                  id="itemName"
                  className={`bg-gray-50 border ${
                    email.error ? "outline-red-500 outline outline-1" : ""
                  } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Enter Email"
                  onChange={(e) =>
                    setemail({ ...email, value: e.target.value })
                  }
                />
              </div>
              <div>
                {password.error ? (
                  <span className="text-red-500 text-[13px]">
                    {" "}
                    {password.error}
                  </span>
                ) : (
                  <></>
                )}
                <input
                  type="text"
                  name="itemName"
                  id="itemName"
                  className={`bg-gray-50 border ${
                    password.error ? "outline-red-500 outline outline-1" : ""
                  } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Enter Password"
                  onChange={(e) =>
                    setPassword({ ...password, value: e.target.value })
                  }
                />
              </div>
              <div className="w-full col-span-2 md:col-span-1 ">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {phoneNumber.error ? (
                    <span className="text-red-500 text-[13px]">
                      {" "}
                      {phoneNumber.error}
                    </span>
                  ) : (
                    <></>
                  )}
                </label>
                <div
                  className={`flex items-center ${
                    phoneNumber.error ? "outline-red-500 outline outline-1" : ""
                  } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                >
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phoneNumber.value}
                    inputStyle={{ width: "220px" }}
                    onChange={handleOnPhoneNumberChange}
                  />
                </div>
              </div>
              <div className="w-full col-span-2 md:col-span-1 ">
                <label
                  htmlFor="dateOfBirth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {dob.error ? (
                    <span className="text-red-500 text-[13px]">
                      Enter a date of birth
                    </span>
                  ) : (
                    <></>
                  )}
                </label>
                <DatePicker
                  id="dateOfBirth"
                  selected={dob.value ? new Date(dob.value) : null}
                  onChange={(date: any) => setdob({ ...dob, value: date })}
                  className={`bg-gray-50 border ${
                    dob.error ? "outline-red-500 outline outline-1" : ""
                  } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[235px] p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholderText="Select date of birth"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="tags"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {gender.error ? (
                    <span className="text-red-500 text-[13px]">
                      {" "}
                      {gender.error}
                    </span>
                  ) : (
                    <></>
                  )}
                </label>
                <select
                  id="tags"
                  name="tags"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) =>
                    setGender({ ...gender, value: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non-binary</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <p className="text-[14px] mt-[15px] text-gray-500">
                Already an account?
                <a href="/" className="ml-1">
                  <span className="text-secondary font-[20px]">Login now</span>
                </a>
              </p>
              <div className="flex justify-end">
                <button
                  className="block text-sm font-medium text-gray-900 dark:text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:border-primary-700 rounded-lg p-2.5"
                  onClick={signInWithToast}
                >
                  Sign up
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
