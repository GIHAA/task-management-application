import { passwordValidator } from "@/helpers/passWordValidator"
import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import PhoneInput  from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { toast } from "sonner";

import UserService from "../api/userService"
import { emailValidator } from "../helpers/emailValidator"
import { inputValidator } from "../helpers/inputValidator"
import { phoneNumebrValidator } from "../helpers/phoneNumebrValidator"

const CreateUserForm = ({setDisplayCreateFrom , fetchData } : any) => {
  const [firstName, setfirstName] = useState({ value: "", error: "" })
  const [lastName, setlastName] = useState({ value: "", error: "" })
  const [email, setemail] = useState({ value: "", error: "" })
  const [phoneNumber, setphoneNumber] = useState({ value: "", error: "" })
  const [gender, setGender] = useState({ value: "", error: "" })
  const [dob, setdob] = useState({ value: "" , error: "" })
  const [role, setRole] = useState({ value: "" , error: "" })
  const [password, setPassword] = useState({ value: "" , error: "" })

  const getuser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getuser ? JSON.parse(getuser) : null;

  const onAddUser = () => {

    const firstNameError = inputValidator( "First Name" , firstName.value)
    const lastNameError = inputValidator( "Last Name" , lastName.value)
    const dobError = inputValidator( "Dob", dob.value)
    const emailError = emailValidator( email.value)
    const phoneNumberError = inputValidator( "Phone Number ", phoneNumber.value)
    const genderError = inputValidator( "Gender" , gender.value)
    const roleError = inputValidator( "Role" , role.value)
    const passwordError = passwordValidator( password.value)


    if (roleError || emailError || firstNameError || lastNameError || phoneNumber.error || phoneNumberError || dobError || genderError || passwordError) {
      setfirstName({ ...firstName, error: firstNameError })
      setlastName({ ...lastName, error: lastNameError })
      setemail({ ...email, error: emailError })
      setdob({ ...dob, error: emailError })
      setphoneNumber({ ...phoneNumber, error: phoneNumberError || phoneNumber.error  })
      setGender({ ...gender, error : genderError})
      setRole({ ...role, error : roleError})
      setPassword({ ...password, error : passwordError})
      return
    }
   

    UserService.createUser({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      gender: gender.value,
      dob: dob.value,
      role: role.value,
      password: password.value
    }, user.token).then((res) => {
      toast.success("User added successfully")
      fetchData()
      setDisplayCreateFrom(false)
    }).catch((err) => {
      if (err.code == 'ERR_BAD_REQUEST') {
        toast.error(`User with ${email.value} already exists`)
        return
      }
      toast.error("Error : " + err.message )
    })

  }

  const handleOnPhoneNumberChange = (value : string, country : { countryCode: string  }) => {
    const PhoneValidationError = phoneNumebrValidator(value, country);
    setphoneNumber({ value, error: PhoneValidationError });
  };


  return (
    <>
      <div className="backdrop-blur-sm md:ml-[230px] ml-[60px] bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
        <section className="bg-white dark:bg-gray-900 rounded-xl mt-[50px]">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-5 ">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Add New User
            </h2>
            <div>
              <div className="grid gap-4 sm:grid-cols-2  grid-cols-1 sm:gap-5">
                <div className="md:col-span-1 col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name{" "}
                    {firstName.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {firstName.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
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
                </div>

                <div className="md:col-span-1 col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name{" "}
                    {lastName.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {lastName.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    id="itemName"
                    className={`bg-gray-50 border ${
                      lastName.error ? "outline-red-500 outline outline-1" : ""
                    } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                    placeholder="Enter last name"
                    onChange={(e) => setlastName({ ...lastName, value: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email{" "}
                    {email.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {email.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    id="itemName"
                    className={`bg-gray-50 border ${
                      email.error ? "outline-red-500 outline outline-1" : ""
                    } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                    placeholder="Enter email "
                    onChange={(e) => setemail({ ...email, value: e.target.value })}
                  />
                </div>


                <div className="md:col-span-2 col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password{" "}
                    {password.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {password.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="password"
                    name="itemName"
                    id="itemName"
                    className={`bg-gray-50 border ${
                      password.error ? "outline-red-500 outline outline-1" : ""
                    } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                    placeholder="*************"
                    onChange={(e) => setPassword({ ...password, value: e.target.value })}
                  />
                </div>

                <div className="col-span-2 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

                <div className="w-full col-span-2 md:col-span-1 ">
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number  {phoneNumber.error ? (<span className="text-red-500 text-[13px]">  {phoneNumber.error}</span>) : (<></>)}
                  </label>
                  <div className={`flex items-center ${
                      phoneNumber.error ? "outline-red-500 outline outline-1" : ""
                    } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}>
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
                    Date of birth  {dob.error ? (<span className="text-red-500 text-[13px]">Enter a date of birth</span>) : (<></>)}
                  </label>
                  <DatePicker
                    id="dateOfBirth"
                    selected={dob.value ? new Date(dob.value) : null}
                    onChange={ (date : any) =>  setdob({ ...dob, value:date })}
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
                    Gender  {gender.error ? (<span className="text-red-500 text-[13px]">  {gender.error}</span>) : (<></>)}
                  </label>
                  <select
                    id="tags"
                    name="tags"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setGender({ ...gender, value: e.target.value })}
                  >
                    <option value="">-</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="tags"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    User type  {role.error ? (<span className="text-red-500 text-[13px]">  {role.error}</span>) : (<></>)}
                  </label>
                  <select
                    id="tags"
                    name="tags"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setRole({ ...role, value: e.target.value })}
                  >
                    <option value="">-</option>
                    <option value="ADMIN">Admin</option>
                    <option value="REGULAR_USER">Regular User</option>

                  </select>
                </div>
              </div>

              <div className="col-span-2 mb-7 mt-5 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

              <div className="mt-2">
                <button
                  className="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={onAddUser}
                >
                  Add User
                </button>

                <button
                  type="submit"
                  className="ml-4 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={() => {
                    setDisplayCreateFrom(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default CreateUserForm
