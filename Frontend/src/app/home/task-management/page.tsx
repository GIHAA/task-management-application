"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Placeholder from "@/components/PlaceHolder";

import Sidebar from "@/components/Sidebar";
import { PdfGenerator } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import TaskService from "@/api/taskService";
import EditTaskForm from "@/components/EditTaskForm";
import CreateTaskForm from "@/components/CreateTaskForm";
import ShowTask from "@/components/ShowTask";

export default function Page() {
  const [displayCreateFrom, setDisplayCreateFrom] = useState(false);
  const [displayUpdateFrom, setDisplayUpdateForm] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [data, setData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [updateFormData, setUpdateFormdata] = useState({});
  const [target, setTarget] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchType, setSearchType] = useState("NAME" as string);

  const getuser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getuser ? JSON.parse(getuser) : null;

  const toggleDropdown = (itemId: any) => {
    setShowDropdown(!showDropdown);
    setSelectedItemId(itemId);
  };
  


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await TaskService.getAllTasks(
        currentPage - 1,
        pageSize,
        user.token
      );

      if (response.status === 200) {
        const responseData = response.data.results[0];
        setData(responseData.content);
        setTotalPages(responseData.totalPages);
        setTotalElements(responseData.totalElements);
        setLoading(false);
      } else {
        console.error("Error fetching data:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);



  const handleDelete = async (task: any) => {
    toast(`Are sure you want to remove ${task.name}`, {
      action: {
        label: "Remove",
        onClick: async () => {
          const response = await TaskService.deleteTask(task.id, user.token);

          if (response.status === 204) {
            toast.success(`${task.name} removed successfully`);
            setData((prevItems) =>
              prevItems.filter((data: any) => data.id !== task.id)
            );
          } else {
            toast.error("Removing failed");
          }
        },
      },
    });
  };

  const handleSearchChange = (event: any) => {
    setLoading(true);
    const searchValue = event.target.value;
    TaskService.searchTasks(searchType, searchValue, user.token)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data.results[0].content);
        } else {
          setLoading(false);
          console.error("Error fetching data:", response.statusText);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className=" md:ml-64 h-auto ml-[75px] ">
        <div className=" rounded-lg  dark:border-gray-600 h-screen ">
          <section className="bg-gray-50 dark:bg-gray-900 sm:h-auto md:h-auto lg:h-auto xl:h-screen  p-3 sm:p-5">
           
            <div className=" mx-auto max-w-screen-xl px-4 lg:px-2  pt-[50px]">
              <div className="bg-white mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <p className="ml-4 mt-4 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Admin Task Management
              </p>

                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
   
   
                  <div className="w-full md:w-1/2 ">
                    <form className="flex items-center">
                      <label className="sr-only">Search</label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search"
                          onChange={handleSearchChange}
                        />
                      </div>

                      <select
                        id="tags"
                        name="tags"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  ml-2 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        onChange={(e) => {
                          setSearchType(e.target.value);
                        }}
                      >
                        <option value="NAME">Search by Name</option>
                        <option value="Description">
                          Search by Description
                        </option>
                        <option value="BOTH">Search by Both</option>
                      </select>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                        setDisplayCreateFrom(true);
                      }}
                    >
                      <svg
                        className="h-3.5 w-3.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      Add Task
                    </button>
                  </div>
                </div>
                {loading ? (
                  <>
                    <div className="flex justify-center items-center h-[420px] ">
                      <Placeholder />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="max-h-[490px] h-screen overflow-y-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-4 py-3">
                              Id
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Name
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Description
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Added by
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Created at
                            </th>
                            <th scope="col" className="px-4 py-3">
                              priority
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item: any) => {
                            return (
                              <>
                                <tr
                                  key={item.id}
                                  className="border-b dark:border-gray-700"
                                  onClick={() => {}}
                                >
                                  <th
                                    scope="row"
                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    {item.id}
                                  </th>
                                  <td className="px-4 py-3">{item.name}</td>
                                  <td className="px-4 py-3">
                                    {item.description.length > 30
                                      ? `${item.description.substring(
                                          0,
                                          30
                                        )}...`
                                      : item.description}
                                  </td>

                                  <td className="px-4 py-3">
                                    {item.owner
                                      ? `${item.owner.firstName} ${item.owner.lastName}`
                                      : "Unavailable"}
                                  </td>

                                  <td className="px-4 py-3">
                                    {new Date(item.created_at).toLocaleString()}
                                  </td>
                                  <td
                                    className={`px-4 py-3 ${
                                      item.priority === "HIGH"
                                        ? "text-red-500"
                                        : item.priority === "MEDIUM"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                    }`}
                                  >
                                    {item.priority}
                                  </td>
                                  <td className="px-4 py-3">{item.status}</td>

                                  <td className="px-4 py-3 flex items-center justify-end relative">
                                    <button
                                      id={`dropdown-button-${item.id}`}
                                      onClick={() => toggleDropdown(item.id)}
                                      className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                      type="button"
                                    >
                                      <svg
                                        className="w-5 h-5 rotate-90"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                      </svg>
                                    </button>
                                    {showDropdown &&
                                      selectedItemId === item.id && (
                                        <div
                                          className="absolute z-10 w-40 bg-white rounded-lg shadow-lg divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600"
                                          style={{ top: 10, right: 40 }}
                                        >
                                          <ul
                                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby={`dropdown-button-${item.id}`}
                                          >
                                            <li>
                                              <a
                                                href="#"
                                                onClick={() => {
                                                  setShowTask(true);
                                                  setTarget(item);
                                                  toggleDropdown(item.id);
                                                }}
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                              >
                                                Show
                                              </a>
                                            </li>

                                            <li>
                                              <a
                                                href="#"
                                                onClick={() => {
                                                  setDisplayUpdateForm(true);
                                                  setTarget(item);
                                                  toggleDropdown(item.id);
                                                  setUpdateFormdata(item);
                                                }}
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                              >
                                                Edit
                                              </a>
                                            </li>

                                            <li>
                                              <a
                                                href="#"
                                                onClick={() =>
                                                  handleDelete(item)
                                                }
                                                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                              >
                                                Delete
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <nav className="flex justify-between items-center space-x-3 p-4">
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Showing &nbsp;
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {(currentPage - 1) * pageSize + 1} -{" "}
                          {Math.min(currentPage * pageSize, totalElements)}
                        </span>
                        &nbsp; of &nbsp;
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {totalElements}
                        </span>
                      </span>
                      <ul className="flex items-center space-x-3">
                        <li>
                          <button
                            className={`text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white focus:outline-none ${
                              currentPage === 1 ? "cursor-not-allowed" : ""
                            }`}
                            onClick={() => {
                              setCurrentPage(currentPage - 1);
                            }}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: Math.min(totalPages, 5) },
                          (_, index) => (
                            <li key={index}>
                              <button
                                className={`text-sm font-medium ${
                                  currentPage === index + 1
                                    ? "text-primary-600 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white"
                                }`}
                                onClick={() => {
                                  setCurrentPage(index + 1);
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li>
                          <button
                            className={`text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white focus:outline-none ${
                              currentPage === totalPages
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              setCurrentPage(currentPage + 1);
                            }}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {showTask && (
        <ShowTask
        setShowTask={setShowTask}
          fetchData={fetchData}
          target={target}
        />
      )}


      {displayUpdateFrom && (
        <EditTaskForm
          setDisplayUpdateForm={setDisplayUpdateForm}
          fetchData={fetchData}
          target={target}
        />
      )}

      {displayCreateFrom && (
        <CreateTaskForm
          setDisplayCreateFrom={setDisplayCreateFrom}
          fetchData={fetchData}
        />
      )}
    </>
  );
}
