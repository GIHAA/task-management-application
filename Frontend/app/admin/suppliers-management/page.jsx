"use client";
import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import { toast } from "react-toastify";
import sellersServices from "@app/api/sellerServices";
import { Oval } from "react-loader-spinner";
import "jspdf-autotable";
import jsPDF from "jspdf";
import axios from "axios";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";

import dotenv from 'dotenv';
dotenv.config();

const Placeholder = () => {
  return (
    <div className="mt-40">
      <Oval
        height={80}
        width={80}
        color="#0096FF"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#89CFF0"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const MapComponent = withScriptjs(
  withGoogleMap(
    ({ storeLocation, userLocation, directions, eta, distance }) => {
      return (
        <div>
          <GoogleMap defaultZoom={10} defaultCenter={storeLocation}>
            <Marker position={storeLocation} label="Store" />
            <Marker position={userLocation} label="You" />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          {eta && distance && (
            <div>
              <p>Estimated Time of Arrival: {eta}</p>
              <p>Distance: {distance}</p>
            </div>
          )}
        </div>
      );
    }
  )
);

const Seller = () => {
  // const { data: session } = useSession();
  const [displayPost, setdisplaypost] = useState(false);
  const [displayUpdate, setdisplayUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormdata] = useState({});
  const [sellers, setSellers] = useState([]);
  const [targetId, setTargetId] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lat, setlat] = useState(0);
  const [long, setlong] = useState(0);
  const [target, setTraget] = useState({});
  const [storeLocation, setStoreLocation] = useState({
    lat: 6.927079,
    lng: 79.861244,
  }); 
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setETA] = useState(null);
  const [distance, setDistance] = useState(null);
  const [globaldelay, setglobaldelay] = useState(false);
  const [newestSeller, setNewestSeller] = useState("");
  const [oldestSeller, setOldestSeller] = useState("");

  useEffect(() => {

    if (data.length > 0) {
      let newest = data[0];
      let oldest = data[0];

      for (const seller of data) {
        const sellerCreatedAt = new Date(data.createdAt);
        const newestCreatedAt = new Date(newest.createdAt);
        const oldestCreatedAt = new Date(oldest.createdAt);

        if (sellerCreatedAt > newestCreatedAt) {
          newest = seller;
        }
        if (sellerCreatedAt < oldestCreatedAt) {
          oldest = seller;
        }
      }

    toast.info(newest)
      setNewestSeller(newest);
      setOldestSeller(oldest);
    }
  }, [data]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        calculateDirections(storeLocation, { lat: userLat, lng: userLng });
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setglobaldelay(true);
    }, 5000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleMapLoad = (seller) => {
    setglobaldelay(false);
    setTraget(seller);
    setStoreLocation({ lat: seller.slat, lng: seller.slong });
    const timeoutId = setTimeout(() => {
      setglobaldelay(true);
    }, 5000);
    return () => {
      clearTimeout(timeoutId);
    };
  };

  const genaratePDF = () => {
    toast.info("Genarating Report");
    const name = "Seller";
    const pdf_title = "Sellers Report";
    const pdf_address = "info@spmproject.com";
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
      head: [["Id", "Name", "Email", "joined At", "postalCode"]],
      body: searchedResults.map((request) => [
        request.id,
        request.name,
        request.email,
        request.country,
        request.postalCode,
      ]),
      theme: "grid",
    });

    doc.save(`${name}.pdf`);
  };

  const calculateDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          const route = result.routes[0].legs[0];
          const etaInSeconds = route.duration.value;
          const distanceInMeters = route.distance.value;

          const minutes = Math.floor(etaInSeconds / 60);
          setETA(`${minutes} min`);

          const kilometers = (distanceInMeters / 1000).toFixed(2);
          setDistance(`${kilometers} km`);
        } else {
          console.error(`Directions request failed: ${status}`);
        }
      }
    );
  };

  const toggleDropdown = (itemId) => {
    setShowDropdown(!showDropdown);
    setSelectedItemId(itemId);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onUpdateChange = (e) =>
    setUpdateFormdata({ ...updateFormData, [e.target.name]: e.target.value });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await sellersServices.getAllSellers();
      if (response.status === 200) {
        setData(response.data.data.sellers);
        setSearchedResults(response.data.data.sellers);
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
    setLoading(false);
  }, []);

  const handleShow = (itemId) => {
    console.log(`Show seller with ID: ${itemId}`);
  };

  const handleDelete = async (itemId, name) => {
    try {
      toast.warn(
        <div>
          <p class="text-red-700 ml-8">Do you want to remove {name}?</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{ marginRight: "1rem" }}
              onClick={() => {
                sellersServices.deleteSellers(itemId);
                toast.success("Seller deleted successfully");
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
            <button onClick={() => toast.dismiss()}>No</button>
          </div>
        </div>,
        { autoClose: false }
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleReorder = (itemId) => {
    //wip
    console.log(`Reorder seller with ID: ${itemId}`);
    console.log(formData);
  };

  const handleAdd = async (lat , long) => {
    let newFormData;
    
    if(lat && long){
      newFormData = {
        ...formData,
        slat: parseFloat(lat , 10),
        slong: parseFloat(long , 10),
      };
    }else{
      newFormData = {
        ...formData,
        slat: 7.087310,
        slong: 80.014366,
      };
    }
    
    const {
      name,
      email,
      line1,
      line2,
      city,
      postalCode,
      state,
      country,
      slat,
      slong,
    } = newFormData;


    // Validation checks for the new attributes
    if (typeof name !== "string" || name.trim() === "") {
      toast.error("Invalid data. Please enter a name.");
      return;
    }

    if (
      typeof email !== "string" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      toast.error("Invalid data. Please enter a valid email address.");
      return;
    }

    if (typeof line1 !== "string" || line1.trim() === "") {
      toast.error("Invalid data. Please enter address line 1.");
      return;
    }

    if (typeof line2 !== "string") {
      toast.error("Invalid data. Please enter address 2.");
      return;
    }

    if (typeof city !== "string" || city.trim() === "") {
      toast.error("Invalid data. Please enter a city.");
      return;
    }

    if (typeof postalCode !== "string" || postalCode.trim() === "") {
      toast.error("Invalid data. Please enter a postal code.");
      return;
    }

    if (typeof state !== "string" || state.trim() === "") {
      toast.error("Invalid data. Please enter a state.");
      return;
    }

    if (typeof country !== "string" || country.trim() === "") {
      toast.error("Invalid data. Please enter a country.");
      return;
    }

    if (isNaN(slat)) {
      toast.error("Invalid data. Please enter a valid latitude.");
      return;
    }
    if (isNaN(slong)) {
      toast.error("Invalid data. Please enter a valid longitude.");
      return;
    }

    try {
      const response = await sellersServices.addSeller(newFormData);

      if (response.status === 201) {
        fetchData();
        toast.success("seller successfully added");
        setFormData({});
        setdisplaypost(false);
      }
    } catch (error) {
      toast.error(`seller adding failed`);
    }
  };

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return data.filter((one) => regex.test(one.name));
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

  const handleUpdate = async (itemId) => {
    let newFormData;
    if (lat && long) {
      newFormData = {
        ...updateFormData,
        slat: 7.084,
        slong: 80.0098,
      };
    } else {
      newFormData = {
        ...updateFormData,
        slat: 7.084,
        slong: 80.0098,
      };
    }
    const { email } = newFormData;

    if (
      typeof email !== "string" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      toast.error("Invalid data. Please enter a valid email address.");
      return;
    }
    try {
      const response = await sellersServices.updateSellers(itemId, newFormData);
      toast.success("seller successfully updated");
      setdisplayUpdate(false);
      fetchData();
    } catch (error) {
      toast.error(`seller updating failed ${error}`);
    }
  };

  const handleContactClick = (seller) => {
    const emailSubject = `Regarding your listing`;
    const emailBody = `Hi ${seller.name},`;
    const encodedEmailSubject = encodeURIComponent(emailSubject);
    const encodedEmailBody = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:${seller.email}?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;
    window.location.href = mailtoLink;
  };

  const handleGetCoordinates = () => {
    const { city } = formData;

    if (typeof city !== "string" || city.trim() === "") {
      toast.error("Invalid data. Please enter a city.");
      return;
    }


    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: city,
          key: `AIzaSyDAo-NgO_83JSn1gyhs9H2kCoOMx1ufRiw`,
        },
      })
      .then((response) => {
        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          setlat(location.lat);
          setlong(location.long);
          // toast.info(location.lat)
          console.log
          handleAdd(location.lat , location.lng);
        } else {
          //Handle the error here
          console.error("Error getting coordinates");
          handleAdd();
        }
      })
      .catch((error) => {
        // Handle the HTTP request error here
        console.error("Error:", error);
        handleAdd();
      });
  };

  return (
    <>
      <Admin />

      <div class=" md:ml-64 h-auto ">
        <div class=" rounded-lg  dark:border-gray-600 h-screen ">
          <section class="bg-gray-50 dark:bg-gray-900 h-screen p-3 sm:p-5">
            <div class=" mx-auto max-w-screen-xl px-4 lg:px-2  pt-[50px]">
              <div className="flex justify-between">
                <div class=" flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 "></div>
                <div className=" w-full bg-white rounded-lg shadow dark:bg-gray-800  md:p-6">
                  <div className="flex justify-between">
                    <div>
                      <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                        {data.length}
                      </h5>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Total Number of Seller
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

                <div class="m-2 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 "></div>

<div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">




  <div className="flex justify-between">
    <div>
    <p className="text-base font-bold text-gray-500 dark:text-gray-400">
    Market Leader
      </p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Name: {oldestSeller.name}
      </p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Email: {oldestSeller.email}
      </p>
    </div>
    <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">

    </div>
  </div>
</div>
<br />




                <div class="m-2 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 "></div>
                <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
                <div className="flex justify-between">
    <div>
    <p className="text-base font-bold text-gray-500 dark:text-gray-400">
    Newest Seller
      </p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Name: {newestSeller.name}
      </p>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Email: {newestSeller.email}
      </p>
    </div>
    <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">

    </div>
  </div>
                </div>
                <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>
              </div>

              <div className="flex justify-between ">
                <div class="bg-white w-full mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
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
                        Add Seller
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
                                Id
                              </th>
                              <th scope="col" class="px-4 py-3">
                                Name
                              </th>
                              {/* <th scope="col" class="px-4 py-3">
                                Email
                              </th> */}
                              <th scope="col" class="px-4 py-3">
                                Address
                              </th>
                              <th scope="col" class="px-4 py-3">
                                City
                              </th>
                              <th scope="col" class="px-4 py-3">
                                Country
                              </th>
                              <th scope="col" class="px-4 py-3">
                                <span class="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchedResults.map((seller) => (
                              <tr
                                key={seller.id}
                                class="border-b dark:border-gray-700"
                              >
                                <th
                                  scope="row"
                                  class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  {seller.id}7&#34;
                                </th>
                                <td class="px-4 py-3">{seller.name}</td>
                                {/* <td class="px-4 py-3">{seller.email}</td> */}
                                <td class="px-4 py-3">{seller.line1}</td>
                                <td class="px-4 py-3">{seller.city}</td>
                                <td class="px-4 py-3">
                                  <div className="flex">
                                    <h1>{seller.country}</h1>
                                    <button
                                      type="button"
                                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 ml-auto  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                      onClick={() => handleMapLoad(seller)}
                                    >
                                      view
                                    </button>
                                  </div>
                                </td>

                                <td class="px-4 py-3 flex items-center justify-end relative">
                                  <button
                                    id={`dropdown-button-${seller.id}`}
                                    onClick={() => toggleDropdown(seller.id)}
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
                                    selectedItemId === seller.id && (
                                      <div
                                        className="absolute z-10 w-40 bg-white rounded-lg shadow-lg divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600"
                                        style={{ top: 10, right: 40 }}
                                      >
                                        <ul
                                          className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                          aria-labelledby={`dropdown-button-${seller.id}`}
                                        >
                                          <li>
                                            <a
                                              href="#"
                                              onClick={() => {
                                                setdisplayUpdate(true);
                                                setTargetId(seller.id);
                                                toggleDropdown(seller.id);
                                                setUpdateFormdata(seller);
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
                                                handleDelete(
                                                  seller.id,
                                                  seller.name
                                                )
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                <div class="ml-[16px] w-[400px] mt-[10px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="#">
                    <div className="h-[250px]">
                      {globaldelay && (
                        <MapComponent
                          storeLocation={storeLocation}
                          userLocation={userLocation}
                          directions={directions}
                          eta={eta}
                          distance={distance}
                          googleMapURL={`https://maps.googleapis.com/maps/api/js?&v=3.exp&libraries=geometry,drawing,places`}
                          loadingElement={<div style={{ height: "100%" }} />}
                          containerElement={<div style={{ height: "100%" }} />}
                          mapElement={<div style={{ height: "100%" }} />}
                        />
                      )}
                    </div>
                  </a>
                  <div class="p-5">
                    <a href="#">
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {target.name}
                      </h5>
                      <h5 class="mb-1 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                        Email :{" "}
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {" "}
                          {target.email}{" "}
                        </p>
                      </h5>
                      <h5 class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
                        {/* Elstimated Delivery Time : */}
                        Address :{" "}
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {target.line1} {target.city} {target.postalCode}{" "}
                        </p>
                      </h5>
                    </a>
                    {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Address : 
                    </p> */}

                    <button
                      onClick={() => {
                        handleContactClick(target);
                      }}
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Contact
                      <svg
                        class="w-3.5 h-3.5 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {displayUpdate && (
        <div className="backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
          <section className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
              <h2 className="mb-4 text-xl font-bold w-[400px] text-gray-900 dark:text-white">
                Update Seller
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seller Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type seller name"
                      required=""
                      value={updateFormData.name}
                      onChange={onUpdateChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3 mt-3">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Seller Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type seller name"
                    required=""
                    value={updateFormData.email}
                    onChange={onUpdateChange}
                  />
                </div>

                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="itemName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Seller address
                  </label>
                  <input
                    type="text"
                    name="line1"
                    id="line1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type seller name"
                    required=""
                    value={updateFormData.address}
                    onChange={onUpdateChange}
                  />
                </div> */}

                <div>
                  <button
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={() => {
                      handleUpdate(targetId);
                    }}
                  >
                    Update seller
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
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
                Add a new Seller
              </h2>
              <div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seller name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type seller name"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full col-span-2">
                    <label
                      htmlFor="brand"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Seller email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="seller brand"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      postalCode
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="PostalCode"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="col-span-2 items-center border-gray-200 border-t dark:border-gray-700 justify-between"></div>

                  <div className="w-full col">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address line 1
                    </label>
                    <input
                      type="text"
                      name="line1"
                      id="line1"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full col">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address line 2
                    </label>
                    <input
                      type="text"
                      name="line2"
                      id="line2"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full col">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State"
                      required=""
                      onChange={onChange}
                    />
                  </div>

                  <div className="w-full col">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="State"
                      required=""
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    onClick={handleGetCoordinates}
                  >
                    Add Seller
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
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

export default Seller;
