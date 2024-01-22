import TaskService from "@/api/taskService";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";

import UserService from "../api/userService";
import { emailValidator } from "../helpers/emailValidator";
import { inputValidator } from "../helpers/inputValidator";
import { phoneNumebrValidator } from "../helpers/phoneNumebrValidator";

const ShowTask = ({ setShowTask, fetchData, target }: any) => {
  return (
    <>
      <div className="backdrop-blur-sm md:ml-[230px] ml-[60px] bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
        <section className="bg-white dark:bg-gray-900 rounded-xl mt-[50px]">
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-5 ">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Task Id : {target.id}
            </h2>

            <div>
              <div className="grid gap-4 grid-cols-2 sm:gap-5">
                <div className="w-[400px] col-span-2">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    Name : <span className="font-normal"> {target.name} </span>
                  </label>
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    Description : <span className="font-normal"> {target.description}</span>
                  </label>
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    Task added by :{" "} <span className="font-normal">
                    {target.owner
                      ? `${target.owner.firstName} ${target.owner.lastName}`
                      : "Unavailable"}</span>
                  </label>
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    Created at : <span className="font-normal">{target.created_at}</span>
                  </label>
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    priority : <span               className={`px-4 py-3 ${
                                      target.priority === "HIGH"
                                        ? "text-red-500"
                                        : target.priority === "MEDIUM"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                    }`}>{target.priority}</span>
                  </label>

                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-m font-semibold text-gray-900 dark:text-white"
                  >
                    Status : <span className="font-normal">{target.status}</span>
                  </label>


                </div>
              </div>
              <div className="col-span-2 mb-7 mt-5 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="ml-4 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={() => {
                    setShowTask(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ShowTask;
