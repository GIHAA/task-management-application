import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import TaskService from "../api/taskService";
import { inputValidator } from "../helpers/inputValidator";

const CreateTaskForm = ({ setDisplayCreateFrom, fetchData }: any) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [priority, setPriority] = useState({ value: "", error: "" });
  const [status, setStatus] = useState({ value: "", error: "" });


  const getuser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getuser ? JSON.parse(getuser) : null;

  const onAddTask = () => {
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
      return;
    }

    TaskService.createTask(
      {
        name: name.value,
        description: description.value,
        priority: priority.value,
        status: status.value,
      },
      user.token
    )
      .then((res) => {
        toast.success("Task added successfully");
        fetchData();
        setDisplayCreateFrom(false);
      })
      .catch((err) => {
        toast.error("Error : " + err.message);
      });
  };


  return (
    <>
      <div className="backdrop-blur-sm md:ml-[230px] ml-[60px] bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
        <section className="bg-white dark:bg-gray-900 rounded-xl mt-[50px]">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-5 ">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Add New Task
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
                    name="itemName"
                    id="itemName"
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
                    name="itemName"
                    id="itemName"
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
                    id="tags"
                    name="tags"
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
                    id="tags"
                    name="tags"
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
                  onClick={onAddTask}
                >
                  Add Task
                </button>

                <button
                  type="submit"
                  className="ml-4 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={() => {
                    setDisplayCreateFrom(false);
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
  );
};

export default CreateTaskForm;
