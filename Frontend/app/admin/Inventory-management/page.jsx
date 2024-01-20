"use client";
import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import { toast } from "react-toastify";
import itemServices from "@app/api/inventoryServices";
import sellersServices from "@app/api/sellerServices";
import "jspdf-autotable";
import jsPDF from "jspdf";
import emailServices from "@app/api/emailServices";
import Placeholder from "@components/PlaceHolder";

const Inventory = () => {
  // const { data: session } = useSession();
  const [uid, setuid] = useState(1);
  const [displayPost, setdisplaypost] = useState(false);
  const [displayUpdate, setdisplayUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormdata] = useState({});
  const [emailData, setEmailData] = useState({});
  const [sellers, setSellers] = useState([]);
  const [targetId, setTargetId] = useState(0);
  const [tragetItem, setTragetItem] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectseller, setselectseller] = useState();
  const [leadTime, setLeadTime] = useState(2);
  const [safetyFactor, setSafetyFactor] = useState(1.5);
  const [displayReorder, setDisplayReorder] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const toggleDropdown = (itemId) => {
    setShowDropdown(!showDropdown);
    setSelectedItemId(itemId);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onUpdateChange = (e) =>
    setUpdateFormdata({ ...updateFormData, [e.target.name]: e.target.value });

  const onEmailChange = (e) =>
    setEmailData({ ...emailData, [e.target.name]: e.target.value });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await itemServices.getAllItems();
      if (response.status === 200) {
        setData(response.data.data.items);
        setSearchedResults(response.data.data.items);
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

  const fetchSellers = async () => {
    try {
      const response = await sellersServices.getAllSellers();
      if (response.status === 200) {
        setSellers(response.data.data.sellers);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSellers();
    setLoading(false);
  }, []);

  const handleShow = (itemId) => {
    console.log(`Show item with ID: ${itemId}`);
  };

  const onImageUpload = async (event) => {
    const response = await itemServices.uploadImage(event);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };

      reader.readAsDataURL(file);
    }
    setFormData({
      ...formData,
      imageUrl: `https://my-se-bucket-12.s3.ap-south-1.amazonaws.com/${response.data.data.url}`,
    });
  };

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
                itemServices.deleteItems(itemId);
                toast.success('Item deleted successfully');
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
      quantity: parseInt(formData.quantity, 10),
      age: parseInt(formData.age, 10),
      sellerId: parseInt(formData.sellerId, 10),
      rating: 0,
    };

    const {
      price,
      quantity,
      age,
      itemName,
      brand,
      outdoor,
      gender,
      size,
      material,
      tags,
      color,
      sellerId,
      category,
      imageUrl,
    } = newFormData;

    if (typeof imageUrl !== "string" || imageUrl.trim() === "") {
      toast.error("Please enter product Image.");
      return;
    }

    if (isNaN(price) || isNaN(quantity) || isNaN(age)) {
      toast.error(
        "Invalid data. Please make sure price, quantity, and age are numbers."
      );
      return;
    }
    if (isNaN(sellerId)) {
      toast.error("Invalid data. Please select a seller.");
      return;
    }

    if (typeof itemName !== "string" || itemName.trim() === "") {
      toast.error("Invalid data. Please enter an item name.");
      return;
    }

    if (typeof brand !== "string" || brand.trim() === "") {
      toast.error("Invalid data. Please enter a brand.");
      return;
    }
    if (typeof category !== "string" || category.trim() === "") {
      toast.error("Invalid data. Please enter category information.");
      return;
    }

    if (typeof outdoor !== "string" || outdoor.trim() === "") {
      toast.error("Invalid data. Please enter outdoor information.");
      return;
    }

    if (typeof gender !== "string" || gender.trim() === "") {
      toast.error("Invalid data. Please enter gender information.");
      return;
    }

    if (typeof size !== "string" || size.trim() === "") {
      toast.error("Invalid data. Please enter size.");
      return;
    }

    if (typeof material !== "string" || material.trim() === "") {
      toast.error("Invalid data. Please enter material information.");
      return;
    }

    if (typeof tags !== "string" || tags.trim() === "") {
      toast.error("Invalid data. Please enter tags.");
      return;
    }

    if (typeof color !== "string" || color.trim() === "") {
      toast.error("Invalid data. Please enter color information.");
      return;
    }

    try {
      const response = await itemServices.addItem(newFormData);
      setFormData({});

      if (response.status === 201) {
        fetchData();
        toast.success("Item successfully added");
        setImageUrl("");
        setdisplaypost(false);
      }
    } catch (error) {
      toast.error("Item adding failed");
    }
  };

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return data.filter(
      (one) => regex.test(one.itemName) || regex.test(one.brand)
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

  const handleReorder = async (itemId) => {
    const newFormData = {
      ...updateFormData,
      quantity: parseInt(updateFormData.quantity, 10),
      userId: uid,
    };

    const { quantity } = newFormData;

    if (isNaN(quantity)) {
      toast.error("Invalid data. Please add quantity");
      return;
    }

    try {
      const demandWeekDate = new Date(tragetItem.demandweek);

      function getISOWeek(date) {
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(
          ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
        );
        return weekNumber;
      }

      const currentWeek = getISOWeek(new Date());
      const targetWeek = getISOWeek(demandWeekDate);
      emailServices.SendInventoryRequest(
        tragetItem.seller.name,
        tragetItem.seller.email,
        tragetItem.quantity,
        tragetItem.itemName
      );

      if (currentWeek === targetWeek) {
        const updatedQuantity =
          parseInt(quantity, 10) + parseInt(tragetItem.quantity, 10);
        const response = await itemServices.updateItems(itemId, {
          demandCounter:
            parseInt(tragetItem.demandCounter, 10) + parseInt(quantity, 10),
          quantity: updatedQuantity,
          userId: uid,
        });
      } else {
        const response = await itemServices.updateItems(itemId, {
          demand: tragetItem.demandCounter,
          demandCounter: 1,
          demandweek: currentWeek,
          quantity: updatedQuantity,
          userId: uid,
        });
      }

      toast.success("Reorder request sent");
      setDisplayReorder(false);
      fetchData();
    } catch (error) {
      toast.error(`Reorder request sent ${error}`);
    }
  };

  const handleUpdate = async (itemId) => {

    const { itemName , price , quantity } = updateFormData;

    if (typeof itemName !== "string" || itemName.trim() === "") {
      toast.error("Invalid data. Please enter an item name.");
      return;
    }
    if (!price || isNaN(price)) {
      toast.error("Invalid data. Please enter a price.");
      return;
    }
    if (!quantity || isNaN(quantity)) {
      toast.error("Invalid data. Please enter a quantity.");
      return;
    }
    const newFormData = {
      itemName,
      price: parseInt(price, 10),
      quantity: parseInt(quantity, 10),
      userId: 1,
    };

    if (isNaN(quantity)) {
      toast.error("Invalid data. Please make sure  quantity is a number.");
      return;
    }

    try {
      const response = await itemServices.updateItems(itemId, newFormData);
      toast.success("Item successfully updated");
      setdisplayUpdate(false);
      fetchData();
    } catch (error) {
      toast.error(`Item updating failed ${error}`);
    }
  };

  const genaratePDF = () => {
    toast.info("Genarating Report");
    const name = "Inventory";
    const pdf_title = "Inventory Report";
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

    doc.autoTable({
      startY: 130,
      head: [["Id", "Name", "category", "Quantity", "price"]],
      body: searchedResults.map((request) => [
        request.id,
        request.itemName,
        request.category,
        request.quantity,
        request.price,
      ]),
      theme: "grid",
    });

    doc.save(`${name}.pdf`);
  };

  const calculateReorderInfo = (item, leadTime, safetyFactor) => {
    const reorderPoint = Math.ceil(
      item.demand * leadTime +
        safetyFactor * Math.sqrt(item.demand * Math.pow(leadTime, 2))
    );
    let recommendation = "";
    if (item.quantity <= reorderPoint) {
      recommendation = `Reorder needed now.`;
    } else {
      const daysUntilReorder = Math.ceil(
        (item.quantity - reorderPoint) / item.demand
      );
      recommendation = `Reorder in ${daysUntilReorder} days.`;
    }

    return { reorderPoint, recommendation };
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
                        Total items in Inventory
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
                    <input
                      type="number"
                      id="simple-search"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={`Lead time set to ${leadTime}`}
                      onChange={(e) => {
                        setLeadTime(e.target.value);
                      }}
                      required=""
                    />
                    <button
                      type="button"
                      class="opacity-0 text-white ml-4 w-[120px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      onClick={() => fetchData()}
                    >
                      Automate
                    </button>
                  </div>

                  <div className="flex my-1">
                    <input
                      type="number"
                      id="simple-search"
                      class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={`Safety factor set to ${safetyFactor}`}
                      onChange={(e) => {
                        setSafetyFactor(e.target.value);
                      }}
                      required=""
                    />
                    <button
                      type="button"
                      class="text-white ml-4 w-[120px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      onClick={() => fetchData()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div class="bg-white mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div class="w-full md:w-1/2 ">
                    <form class="flex items-center">
                      <label for="simple-search" class="sr-only">
                        Search
                      </label>
                      <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            class="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewbox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clip-rule="evenodd"
                            />
                          </svg>
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
                  <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button
                      type="button"
                      class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                        setdisplaypost(true);
                      }}
                    >
                      <svg
                        class="h-3.5 w-3.5 mr-2"
                        fill="currentColor"
                        viewbox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      Add item
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                        genaratePDF();
                      }}
                    >
                      Export as PDF
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
                    <div class="max-h-[420px] h-screen overflow-y-auto">
                      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" class="px-4 py-3">
                              Item name
                            </th>
                            <th scope="col" class="px-4 py-3">
                              Brand
                            </th>
                            <th scope="col" class="px-4 py-3">
                              Seller
                            </th>
                            <th scope="col" class="px-4 py-3">
                              rating
                            </th>
                            <th scope="col" class="px-4 py-3">
                              Price
                            </th>
                            <th scope="col" class="px-4 py-3">
                              Quantity
                            </th>
                            <th scope="col" class="px-4 py-3">
                              ReOrder Point
                            </th>
                            <th scope="col" class="px-4 py-3">
                              <span class="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedResults.map((item) => {
                            const { reorderPoint, recommendation } =
                              calculateReorderInfo(
                                item,
                                leadTime,
                                safetyFactor
                              );

                            return (
                              <>
                                <tr
                                  key={item.id}
                                  class="border-b dark:border-gray-700"
                                  onClick={() => {
                                    setselectseller(item);
                                  }}
                                >
                                  <th
                                    scope="row"
                                    class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    {item.itemName}7&#34;
                                  </th>
                                  <td class="px-4 py-3">{item.brand}</td>
                                  <td class="px-4 py-3">{item.seller.name}</td>
                                  <td class="px-4 py-3">{item.rating}</td>
                                  <td class="px-4 py-3">{item.price}</td>
                                  <td class="px-4 py-3">{item.quantity}</td>
                                  <td class="px-4 py-3">
                                    <div className="flex items-center">
                                      <h1>{recommendation}</h1>
                                      <button
                                        type="button"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 ml-auto  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        onClick={() => {
                                          setTragetItem(item);
                                          setDisplayReorder(true);
                                        }}
                                      >
                                        Reorder
                                      </button>
                                    </div>
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
                                            {/* <li>
                                    <a
                                      href="#"
                                      onClick={() => handleShow(item.id)}
                                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                      Show
                                    </a>
                                  </li> */}
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
                                                onClick={() =>
                                                  handleDelete(item.id)
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
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {displayUpdate && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                update item
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      id="itemName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type item name"
                      required=""
                      value={updateFormData.itemName}
                      onChange={onUpdateChange}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
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
                      htmlFor="quantity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Quantity"
                      required=""
                      value={updateFormData.quantity}
                      onChange={onUpdateChange}
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <button
                      class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                      onClick={() => {
                      handleUpdate(targetId);
                    }}
                  >
                    Update item
                  </button>

                  <button
                    type="submit"
                    class="ml-2 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
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

      {displayPost && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white dark:bg-gray-900 rounded-xl mt-[50px]">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-5 ">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Add a new item
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      id="itemName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type item name"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="seller"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seller
                    </label>
                    <select
                      id="sellerId"
                      name="sellerId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      onChange={onChange}
                    >
                      <option value="">Select a seller</option>
                      {sellers.map((seller) => (
                        <option key={seller.id} value={seller.id}>
                          {seller.id} - {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="brand"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Item brand"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
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
                      htmlFor="quantity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Quantity"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="col-span-3 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

                  <div className="w-full">
                    <label
                      htmlFor="outdoor"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Outdoor
                    </label>
                    <select
                      id="outdoor"
                      name="outdoor"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      onChange={onChange}
                    >
                      <option value="outdoor">Select</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor">Indoor</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      onChange={onChange}
                    >
                      <option value="SNEAKERS">Select</option>
                      <option value="SNEAKERS">Sneakers</option>
                      <option value="SOCKS">Socks</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      defaultValue="male"
                      onChange={onChange}
                    >
                      <option value="male">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="uni">Uni</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="material"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Material
                    </label>
                    <select
                      id="material"
                      name="material"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      defaultValue="Leather"
                      onChange={onChange}
                    >
                      <option value="Leather">Select</option>
                      <option value="Leather">Leather</option>
                      <option value="Mesh">Mesh</option>
                      <option value="Canvas">Canvas</option>
                      <option value="Rubber">Rubber</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="tags"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tags
                    </label>
                    <select
                      id="tags"
                      name="tags"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                      onChange={onChange}
                    >
                      <option value="athletic">Select</option>
                      <option value="athletic">Athletic</option>
                      <option value="casual">Casual</option>
                      <option value="summer">Summer</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="age"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Age"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      id="size"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Size"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="color"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      id="color"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Color"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                  <div className="">
        {imageUrl && (
          <img src={imageUrl} alt="Uploaded" className="w-[120px] h-[100px]" style={{ maxWidth: '100%' }} />
        )}
      </div>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*" // Optionally, you can restrict file types to images
                      className="hidden" // This input is hidden
                      required=""
                      onChange={onImageUpload} // Call a function when an image is uploaded
                    />
                    <button
                      className="bg-blue-500 text-white rounded-lg p-2.5 mt-7 hover:bg-blue-600"
                      onClick={() => document.getElementById("image").click()}
                    >
                      Upload Image
                    </button>
                  </div>
                </div>

  
                <div className="mt-2">
                  <button
                  class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  onClick={handleAdd}
                  >
                    Add item
                  </button>

                  <button
                    type="submit"
                    class="ml-4 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
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

      {displayReorder && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white w-[500px] dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Reorder item
              </h2>

              <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Seller details
              </h2>

              <label
                htmlFor="itemName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Seller name: {tragetItem.seller.name}
              </label>

              <label
                htmlFor="itemName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Seller email: {tragetItem.seller.email}
              </label>

              <div className="col-span-3 mb-4 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {/* <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Message
                    </label>
                    <input
                      type="text"
                      name="message"
                      id="message"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Leave blank to auto genarate message"
                      required=""
                      onChange={onEmailChange}
                    />
                  </div> */}

                  <div className="w-full col-span-2">
                    <label
                      htmlFor="quantity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Quantity"
                      required=""
                      onChange={onUpdateChange}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                     class="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                     onClick={() => {
                      handleReorder(tragetItem.id);
                    }}
                  >
                    Reorder item
                  </button>

                  <button
                    type="submit"
                    class="ml-3 inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                    onClick={() => {
                      setDisplayReorder(false);
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

export default Inventory;
