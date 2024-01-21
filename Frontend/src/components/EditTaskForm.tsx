import TaskService from "@/api/taskService"
import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { toast } from "sonner"

import UserService from "../api/userService"
import { emailValidator } from "../helpers/emailValidator"
import { inputValidator } from "../helpers/inputValidator"
import { phoneNumebrValidator } from "../helpers/phoneNumebrValidator"

const EditUserForm = ({ setDisplayUpdateForm, fetchData, target }: any) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [priority, setPriority] = useState({ value: "", error: "" });
  const [status, setStatus] = useState({ value: "", error: "" });

  const getuser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getuser ? JSON.parse(getuser) : null;

  const onUpdateUser = async () => {
    const updatedFields: any = {
      id: target.id,
    }

    const NameError = inputValidator("First Name", name.value);
    const DescriptionError = inputValidator("Last Name", description.value);
    const PriorityError = inputValidator("Priority", priority.value);
    const StatusError = inputValidator("Status", status.value);


    if (
      NameError ||
      DescriptionError ||
      PriorityError ||
      StatusError
    ) {
      setName({ ...name, error: NameError });
      setDescription({ ...description, error: DescriptionError });
      setPriority({ ...priority, error: PriorityError });
      setStatus({ ...status, error: StatusError });
    
      return
    }

    const fieldsToCheck = [
      { input: name, targetKey: "name" },
      { input: description, targetKey: "description" },
      { input: priority, targetKey: "priority" },
      { input: status, targetKey: "status" }
    ]

    fieldsToCheck.forEach(({ input, targetKey }) => {
      if (input.value !== target[targetKey]) {
        updatedFields[targetKey] = input.value
      }
    })

    if (Object.keys(updatedFields).length > 1) {
      try {
        const res = await TaskService.updateTask(updatedFields , user.token)
        toast.success("User successfully updated")
        fetchData()
        setDisplayUpdateForm(false)
      } catch (err) {
        setDisplayUpdateForm(false)
        toast.error(`Error: ${err}`)
      }
    } else {
      setDisplayUpdateForm(false)
      toast.info("No changes were made.")
    }
  }


  useEffect(() => {

    setName({ ...name, value: target.name })
    setDescription({ ...description, value: target.description })
    setPriority({ ...priority, value: target.priority })
    setStatus({ ...status, value: target.status })
  }, [])

  return (
    <>
      <div className="backdrop-blur-sm md:ml-[230px] ml-[60px] bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
        <section className="bg-white dark:bg-gray-900 rounded-xl mt-[50px]">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-5 ">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Edit Task {target.id}
            </h2>
            
            <div>
            <div className="grid gap-4 grid-cols-2 sm:gap-5">
                <div className="w-[400px] col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name{" "}
                    {name.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {name.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name.value}
                    className={`bg-gray-50 border ${
                      name.error ? "outline-red-500 outline outline-1" : ""
                    } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                    placeholder="Type item name"
                    onChange={(e) =>
                      setName({ ...name, value: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description{" "}
                    {description.error ? (
                      <span className="text-red-500 text-[13px]">
                        {" "}
                        {description.error}
                      </span>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={description.value}
                    className={`bg-gray-50 border h-[150px] ${
                      description.error ? "outline-red-500 outline outline-1" : ""
                    } border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                    placeholder="Type item name"
                    onChange={(e) =>
                      setDescription({ ...description, value: e.target.value })
                    }
                  />
                </div>
             


              <div className="col-span-1" >
                  <label
                    htmlFor="tags"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Priority  {priority.error ? (<span className="text-red-500 text-[13px]">  {priority.error}</span>) : (<></>)}
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={priority.value}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setPriority({ ...priority, value: e.target.value })}
                  >
                    <option value="">-</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>


                <div className="col-span-1">
                  <label
                    htmlFor="tags"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status  {status.error ? (<span className="text-red-500 text-[13px]">  {status.error}</span>) : (<></>)}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status.value}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setStatus({ ...status, value: e.target.value })}
                  >
                    <option value="">-</option>
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="col-span-2 mb-7 mt-5 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

              <div className="mt-2">
                <button
                  className="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={onUpdateUser}
                >
                  Update User
                </button>

                <button
                  type="submit"
                  className="ml-4 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={() => {
                    setDisplayUpdateForm(false)
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

export default EditUserForm
