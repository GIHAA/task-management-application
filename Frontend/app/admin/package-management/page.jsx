"use client";
import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import { toast } from "react-toastify";
import packageServices from "@app/api/packageServices";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const doc = new jsPDF();
import SearchIcon from '../../../components/ui/search.jsx'

// const exportPDF = (tableData) => {
//   // doc.addImage(logo, "PNG", 0, 0, 210, 60);
//   doc.setFontSize(12);
//   doc.text("Package Report", 15, 60);
//   doc.text("Date: " + new Date().toLocaleString(), 15, 70);

//   // It can parse html:
//   // <table id="my-table"><!-- ... --></table>
//   autoTable(doc, { html: "#my-table" });
//   const data = tableData.map((item) => [item.name, item.price, item.period]);
//   // Or use javascript directly:
//   autoTable(doc, {
//     head: [["Package Name", "Price", "Period"]],
//     body: data,
//     styles: {
//       cellWidth: "wrap",
//     },
//     startY: 80,
//   });

//   doc.save("Package.pdf");
// };


const exportPDF = (tableData) => {
  toast.info("Genarating Report");
  const name = `Package_Report ${new Date().toLocaleString()}}`;
  const pdf_title = "Package Report";
  const pdf_address = "info@sneakerhub.com";
  const pdf_phone = "+94 11 234 5678";
  const pdf_email = "Address: No 221/B, Peradeniya Road, Kandy";

  const doc = new jsPDF("landscape", "px", "a4", false);
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const title = `${pdf_title}`;
  doc.setFont("helvetica");
  doc.setTextColor("#000000");

  // Add title and date
  doc.setFontSize(24);
  doc.text(title, 20, 30);
  doc.setFontSize(12);
  doc.setTextColor("#999999");
  doc.text(`Generated on ${date}`, 20, 40);
  // doc.addImage(logo, "JPG", 20, 60, 70, 40);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000000");
  doc.text("Sneaker Hub", 100, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#999999");
  doc.text(`Tel: ${pdf_phone}}`, 100, 80);
  doc.text(`Email: ${pdf_email}`, 100, 90);
  doc.text(`Address: ${pdf_address}`, 100, 100);
  doc.line(20, 110, 600, 110);

  // Add table with data
  doc.setTextColor("#999999");
  doc.setFontSize(12);
  doc.setTextColor("#000000");
  const data = tableData.map((item) => [item.name, item.price, item.period]);
  doc.autoTable({
    startY: 130,
    head: [["Package Name", "Price", "Period"]],
    body: data,
    theme: "grid",
  });

  doc.save(`${name}.pdf`);
};


const Package = () => {
  const [displayPost, setdisplaypost] = useState(false);
  const [displayUpdate, setdisplayUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormdata] = useState({});
  const [sellers, setSellers] = useState([]);
  const [targetId, setTargetId] = useState(0);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState("");

  const toggleDropdown = (itemId) => {
    setShowDropdown(!showDropdown);
    setSelectedItemId(itemId);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onUpdateChange = (e) =>
    setUpdateFormdata({ ...updateFormData, [e.target.name]: e.target.value });

  const fetchData = async () => {
    try {
      const response = await packageServices.getAllPackages();
      if (response.status === 200) {
        setData(response.data.data.packages);
        setSearchedResults(response.data.data.packages);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      toast.warn(
        <div>
          <p class="text-red-700 ml-8" style={{ fontSize: '1.2rem', padding: '1rem' }}>
            Do you want to delete item?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              style={{ marginRight: '1rem', fontSize: '1.2rem', padding: '0.5rem 1rem' }}
              onClick={() => {
                packageServices.deletePackages(itemId);
                toast.success('Package deleted successfully');
                setData((prevItems) =>
                  prevItems.filter((data) => data.id !== itemId)
                );
                setSearchedResults((prevItems) =>
                  prevItems.filter((data) => data.id !== itemId)
                );
              }}
            >
              Yes
            </button>
            <button
              style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
              onClick={() => toast.dismiss()}
            >
              No
            </button>
          </div>
        </div>,
        { autoClose: false }
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = async () => {
    const newFormData = {
      ...formData,
      price: parseInt(formData.price, 10),
      period: parseInt(formData.period, 10),
      image: "0",
    };

    // Error Handling 

    const {
      name,
      period,
      price,
      description,
    } = newFormData;

    if (isNaN(price) || isNaN(period)) {
      toast.error(
        "Invalid data. Please make sure price, quantity, and age are numbers."
      );
      return;
    }

    if (typeof name !== "string" || name.trim() === "") {
      toast.error("Invalid data. Please enter a name.");
      return;
    }

    if (typeof description !== "string" || description.trim() === "") {
      toast.error("Invalid data. Please enter a name.");
      return;
    }

    try {
      const response = await packageServices.addPackages(newFormData);
      setFormData({});

      if (response.status === 201) {
        fetchData();
        toast.success("Package successfully added");
        setdisplaypost(false);
      }
    } catch (error) {
      toast.error("Package adding failed");
    }
  };

  const handleUpdate = async (itemId) => {

    // Error Handling for Updating 

    const { name , price , period } = updateFormData;

    if (typeof name !== "string" || name.trim() === "") {
      toast.error("Invalid data. Please enter package name.");
      return;
    }
    if (!price || isNaN(price)) {
      toast.error("Invalid data. Please enter a price.");
      return;
    }
    if (!period || isNaN(period)) {
      toast.error("Invalid data. Please enter a period.");
      return;
    }

    const newFormData = {
      ...updateFormData,
      price: parseInt(updateFormData.price, 10),
      period: parseInt(updateFormData.period, 10),
    };

    toast.success(updateFormData);
    try {
      const response = await packageServices.updatePackages(
        itemId,
        newFormData
      );
      toast.success("Package successfully updated");
      setdisplayUpdate(false);
      fetchData();
    } catch (error) {
      toast.error(`Package updating failed ${error}`);
    }
  };

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return data.filter(
      (one) => regex.test(one.name) || regex.test(one.description)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <>
      <Admin />

      <div class=" md:ml-64 h-auto ">
        <div class=" rounded-lg  dark:border-gray-600 h-screen ">
          <section class="bg-gray-50 dark:bg-gray-900 h-screen p-3 sm:p-5">
            <div class=" mx-auto max-w-screen-xl px-4 lg:px-2  pt-[50px]">
            <div className="flex justify-between">
                <div className=" w-[500px] mr-2 bg-white rounded-lg shadow dark:bg-gray-800  md:p-6">
                  <div className=" flex justify-between">
                    <div>
                      <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                        {data.length}
                      </h5>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Total Packages
                      </p>
                    </div>
                    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                      {Math.floor(Math.random() * (10 - 1))}%
                      <svg
                        className="w-3 h-3 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13V1m0 0L1 5m4-4 4 4"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
                </div>
                <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                  <div className="flex my-1">
                  </div>
                  <div className="flex my-1">
                  </div>
                </div>
              </div>

              <div class="bg-white mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                
{/* Search Bar 1st */}

                  <div class="w-full md:w-1/2 ">
                    <form class="flex items-center">
                      <label for="simple-search" class="sr-only">
                        Search
                      </label>
                      <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon/>
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search"
                          onChange={handleSearchChange}
                          required=""
                        />
                      </div>
                    </form>

                  </div>

{/* Search Bar 2nd */}

                  <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    
{/* Add Package Button */}

                    <button
                      type="button"
                      class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                        setdisplaypost(true);
                      }}
                    >
                      Add Package
                    </button>

{/* Export as PDF */}

                    <button
                      className="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                        exportPDF(data);
                      }}
                    >
                      Export as PDF
                    </button>


                  </div>
                </div>
                <div class="max-h-[500px] h-screen overflow-y-auto">


{/*               
████████╗░█████╗░██████╗░██╗░░░░░███████╗
╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝
░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░
░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░
░░░██║░░░██║░░██║██████╦╝███████╗███████╗
░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝ */}


                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-4 py-3">
                          Package Name
                        </th>
                        <th scope="col" class="px-4 py-3">
                          Period (Months)
                        </th>
                        {/* <th scope="col" class="px-4 py-3">
                          Seller
                        </th> */}
                        {/* <th scope="col" class="px-4 py-3">
                          rating
                        </th> */}
                        <th scope="col" class="px-4 py-3">
                          Price ($)
                        </th>
                        {/* <th scope="col" class="px-4 py-3">
                          Quantity
                        </th> */}
                        <th scope="col" class="px-4 py-3">
                          Active
                        </th>
                        <th scope="col" class="px-4 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedResults.map((item) => (
                        <tr key={item.id} class="border-b dark:border-gray-700">
                          <th
                            scope="row"
                            class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {item.name}
                          </th>
                          <td class="px-4 py-3">{item.period}</td>
                          <td class="px-4 py-3">{item.price}</td>
                          <td class="px-4 py-3">
                            {item.isActive ? "Yes" : "No"}
                          </td>
                          <td class="px-4 py-3 flex items-center justify-end relative">
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
                            {showDropdown && selectedItemId === item.id && (
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
                                        setdisplayUpdate(true);
                                        setTargetId(item.id);
                                        toggleDropdown(item.id);
                                        setUpdateFormdata(item)
                                      }}
                                      on
                                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                      Edit
                                    </a>
                                  </li>

                                  <li>
                                    <a
                                      href="#"
                                      onClick={() => handleDelete(item.id)}
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
                      ))}
                    </tbody>
                  </table>


                </div>
              </div>
            </div>
          </section>
        </div>
      </div>


{/* 
██╗░░░██╗██████╗░██████╗░░█████╗░████████╗███████╗  ███╗░░░███╗░█████╗░██████╗░███████╗██╗░░░░░
██║░░░██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝  ████╗░████║██╔══██╗██╔══██╗██╔════╝██║░░░░░
██║░░░██║██████╔╝██║░░██║███████║░░░██║░░░█████╗░░  ██╔████╔██║██║░░██║██║░░██║█████╗░░██║░░░░░
██║░░░██║██╔═══╝░██║░░██║██╔══██║░░░██║░░░██╔══╝░░  ██║╚██╔╝██║██║░░██║██║░░██║██╔══╝░░██║░░░░░
╚██████╔╝██║░░░░░██████╔╝██║░░██║░░░██║░░░███████╗  ██║░╚═╝░██║╚█████╔╝██████╔╝███████╗███████╗
░╚═════╝░╚═╝░░░░░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝  ╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚══════╝╚══════╝ 
*/}


      {displayUpdate && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Update Package
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Package Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type Package Name"
                      required=""
                      value={updateFormData.name}
                      onChange={onUpdateChange}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required=""
                      value={updateFormData.price}
                      onChange={onUpdateChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="period"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Period (Months)
                    </label>
                    <input
                      type="number"
                      name="period"
                      id="period"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      value={updateFormData.period}
                      onChange={onUpdateChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center dark:text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() => {
                      handleUpdate(targetId);
                    }}
                  >
                    Update Package
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center dark:text-white text-black bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() => {
                      setdisplayUpdate(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}


{/* 
░█████╗░██████╗░██████╗░  ███╗░░░███╗░█████╗░██████╗░███████╗██╗░░░░░
██╔══██╗██╔══██╗██╔══██╗  ████╗░████║██╔══██╗██╔══██╗██╔════╝██║░░░░░
███████║██║░░██║██║░░██║  ██╔████╔██║██║░░██║██║░░██║█████╗░░██║░░░░░
██╔══██║██║░░██║██║░░██║  ██║╚██╔╝██║██║░░██║██║░░██║██╔══╝░░██║░░░░░
██║░░██║██████╔╝██████╔╝  ██║░╚═╝░██║╚█████╔╝██████╔╝███████╗███████╗
╚═╝░░╚═╝╚═════╝░╚═════╝░  ╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚══════╝╚══════╝ */}


      {displayPost && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Add a New Package
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Package Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type Package Name"
                      required=""
                      onChange={onChange}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required=""
                      onChange={onChange}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="period"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Period (Months)
                    </label>
                    <input
                      type="number"
                      name="period"
                      id="period"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Period"
                      required=""
                      onChange={onChange}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Description"
                      required=""
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white  bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                    onClick={handleAdd}
                  >
                    Add Package
                  </button>
                  <packagePDF tableData={data} />
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black dark:text-white text-black bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() => {
                      setdisplaypost(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Package;
