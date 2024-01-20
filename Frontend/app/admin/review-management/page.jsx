"use client";
import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import { toast } from "react-toastify";
import reviewServices from "@app/api/reviewServices";

const Review = () => {
    const [displayPost, setdisplaypost] = useState(false);
    const [displayUpdate, setdisplayUpdate] = useState(false);
    const [data, setData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateFormData, setUpdateFormdata] = useState({});
    const [targetId, setTargetId] = useState(0);

    const toggleDropdown = (reviewId) => {
        setShowDropdown(!showDropdown);
        setSelectedReviewId(reviewId);
    };

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onUpdateChange = (e) =>
        setUpdateFormdata({ ...updateFormData, [e.target.name]: e.target.value });

    const fetchData = async () => {
        try {
            const response = await reviewServices.getAllReviews();
            console.log(response.data.data);
            if (response.status === 200) {
                setData(response.data.data);
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

    const handleShow = (reviewId) => {
        console.log(`Show review with ID: ${reviewId}`);
    };

    const handleDelete = async (reviewId) => {
        try {
            await reviewServices.deleteReview(reviewId);
            setData((prevReviews) => prevReviews.filter((data) => data.id !== reviewId));
        } catch (error) {
            toast.error(error);
        }
    };

    const handleUpdate = async (reviewId) => {
        const newFormData = {
            ...updateFormData,
            userId: 1,
        };

        toast.success(updateFormData);
        try {
            const response = await reviewServices.updateReview(reviewId, newFormData);
            toast.success("Review successfully updated");
            setdisplayUpdate(false);
            fetchData();
        } catch (error) {
            toast.error(`Review updating failed ${error}`);
        }
    };


    const handleAnalyse = (reviewId) => {
        //wip
        console.log(`Reorder item with ID: ${reviewId}`);
        console.log(formData);
    };

    return (
        <>
            <Admin />

            <div class=" md:ml-64 h-auto ">
                <div class=" rounded-lg  dark:border-gray-600 h-screen ">
                    <section class="bg-gray-50 dark:bg-gray-900 h-screen p-3 sm:p-5">
                        <div class=" mx-auto max-w-screen-xl px-4 lg:px-12 pt-[80px]">
                            <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                    <div class="w-full md:w-1/2 ">
                                        <form className="flex items-center">
                                            <label htmlFor="simple-search" className="sr-only">
                                                Search
                                            </label>
                                            <div class="relative w-full">
                                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                                                    required=""
                                                />
                                            </div>
                                        </form>
                                    </div>

                                </div>
                                <div class="max-h-[500px] h-screen overflow-y-auto">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Rating
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Item Name
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Opinion
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Is Positive
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Sentiment
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                Posted On
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                <span class="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data != null ?
                                            data.map((review) => (
                                            <tr key={review.id} class="border-b dark:border-gray-700">
                                                <th
                                                    scope="row"
                                                    className="px-4 py-3 font-medium text-gray-900 dark:text-white w-1/6"
                                                >
                                                    {review.description}
                                                </th>
                                                <td className="px-4 py-3">{review.rating}</td>
                                                <td className="px-4 py-3">{review.item.itemName}</td>
                                                <td className="px-4 py-3">{review.opinion == null ? "not set" : review.opinion}</td>
                                                <td className="px-4 py-3">{review.isPositive == null ? "not set" : review.isPositive}</td>
                                                <td className="px-4 py-3">{review.sentiment == null ? "not set" : review.sentiment}</td>
                                                <td className="px-4 py-3">{(review.createdAt).split("T")[0]}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 ml-auto  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                            onClick={() => handleAnalyse(review.id)}
                                                        >
                                                            Analyse
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3 flex items-center justify-end relative">
                                                    <button
                                                        id={`dropdown-button-${review.id}`}
                                                        onClick={() => toggleDropdown(review.id)}
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
                                                    {showDropdown && selectedReviewId === review.id && (
                                                        <div
                                                            className="absolute z-10 w-40 bg-white rounded-lg shadow-lg divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600"
                                                            style={{ top: 10, right: 40 }}
                                                        >
                                                            <ul
                                                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                                aria-labelledby={`dropdown-button-${review.id}`}
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
                                                                        onClick={() => handleDelete(review.id)}
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
                                        ))
                                        : null}
                                        </tbody>
                                    </table>
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
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                update Review
                            </h2>
                            <div>
                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            description
                                        </label>
                                        <input
                                            type="text"
                                            name="description"
                                            id="description"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Type item name"
                                            required=""
                                            onChange={onUpdateChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="rating"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            rating
                                        </label>
                                        <input
                                            type="number"
                                            name="rating"
                                            id="rating"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="$2999"
                                            required=""
                                            onChange={onUpdateChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="itemId"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            itemId
                                        </label>
                                        <input
                                            type="number"
                                            name="itemId"
                                            id="itemId"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Quantity"
                                            required=""
                                            onChange={onUpdateChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                                        onClick={() => {
                                            handleUpdate(targetId);
                                        }}
                                    >
                                        Update item
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

        </>
    );
};

export default Review;
