"use client";

import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import subscriptionServices from "@app/api/subscriptionServices";
import { toast } from "react-toastify";

const Placeholder = () => (
    <div className="mt-40 text-black text-center">
        <div className="w-40 h-12 mx-auto relative">
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
        </div>
        <p className="mt-6 text-2xl text-center font-bold text-primary pb-80">
            Generating an Awesome List of Items
        </p>
        <style jsx>{`
            .dot {
                width: 12px;
                height: 12px;
                background-color: #000;
                border-radius: 50%;
                display: inline-block;
                animation: bounce 1.5s infinite;
                margin: 0 4px;
            }

            .dot1 {
                animation-delay: 0.1s;
            }

            .dot2 {
                animation-delay: 0.3s;
            }

            .dot3 {
                animation-delay: 0.5s;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }
        `}</style>
    </div>
);

const SubscriptionManagement = () => {
    const router = useRouter();
    const search = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [tableItems, setTableItems] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [subscription, setSubscription] = useState([]);
    const [itemPackage, setItemPackage] = useState([]);

    const subscriptionId = search.get("id");

    const fetchData = async () => {
        setLoading(true);
        try {
            const subscriptionData = await subscriptionServices.getASubscriptionById(
                subscriptionId
            );
            setSubscription(subscriptionData.data.data);

            const getItemPackage = await subscriptionServices.getPackage(
                subscriptionData.data.data.package.id
            );
            setItemPackage(getItemPackage.data);

            const recommendItems = await subscriptionServices.getRecommendedItems(
                subscriptionData.data.data.user.id
            );
            const filteredItems = recommendItems.data.filter((item) => subscriptionData.data.data.package.price >= item.price);
            setAvailableItems(filteredItems);

            setLoading(false);
        } catch (error) {
            console.log("Error fetching data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddToTable = (item) => {
        setTableItems((prevItems) => [...prevItems, item]);
        setAvailableItems((prevItems) =>
            prevItems.filter((availableItem) => availableItem.id !== item.id)
        );
    };

    const handleRemoveFromTable = (item) => {
        setTableItems((prevItems) =>
            prevItems.filter((tableItem) => tableItem.id !== item.id)
        );
        setAvailableItems((prevItems) => [...prevItems, item]);
    };

    const handleCreateSubscription = async () => {
        const items = tableItems.map((item) => item.id);
        const payload = {
            customerId: subscription.user.id,
            items: items,
        };

        try {
            const response = await subscriptionServices.createSubscriptionBox(
                payload
            );
            await subscriptionServices.updateSubscription(subscription.id);
            toast.success("Subscription box created successfully");
            
            if (response) {
                window.setTimeout(function () {
                    window.location.href =
                        "http://localhost:3000/admin/subscription-management";
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const calculateTotal = () => {
        return tableItems.reduce((total, item) => total + item.price, 0);
    };

    return (
        <>
            <Admin />
            <div className="md:ml-64 h-auto mb-30">
                <div className="bg-gray-50 rounded-lg dark:border-gray-600 h-screen">
                    <section className="bg-white dark:bg-gray-900 h-full p-3 sm:p-5">
                        <div className="mx-auto max-w-screen-xl px-4 lg:px-2 pt-[50px]">
                            <div className="bg-white mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Placeholder />
                                    </div>
                                ) : (
                                    <div className="h-[calc(100% - 140px)] overflow-y-auto">
                                        <h1 className="text-4xl font-extrabold text-primary text-center sm:text-6xl text-black">
                                            Create The Subscription Box
                                        </h1>
                                        <div className="relative ml-10 mr-10 mt-5">
                                            <div className="text-black bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4 shadow-lg">
                                                <h3 className="text-lg font-semibold text-primary">
                                                    Package Details
                                                </h3>
                                                <h4 className="mb-2">Package Name: {itemPackage.name}</h4>
                                                <h4>Package Price: ${itemPackage.price}</h4>
                                            </div>
                                        </div>

                                        {tableItems.length >= 1 ? (
                                            <table className="w-full mt-4 text-sm text-left text-gray-700 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3">
                                                            Item Name
                                                        </th>
                                                        <th scope="col" className="px-4 py-3">
                                                            Price
                                                        </th>
                                                        <th scope="col" className="px-4 py-3">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {tableItems.map((item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-b dark:border-gray-700"
                                                        >
                                                            <td className="px-4 py-3">{item.name}</td>
                                                            <td className="px-4 py-3">${item.price}</td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveFromTable(item)}
                                                                    className="block w-20 rounded-md py-2 text-sm font-semibold text-center hover:border-primary bg-red-500 text-white"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {tableItems.length > 0 && (
                                                        <tr className="border-t dark:border-gray-700 text-black">
                                                            <td className="px-4 py-3 font-semibold">Total:</td>
                                                            <td className="px-4 py-3 font-semibold">
                                                                ${calculateTotal()}
                                                            </td>
                                                            <td className="px-4 py-3"></td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <h1></h1>
                                        )}

                                        {tableItems.length >= 1 && (
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleCreateSubscription}
                                                    className="text-white mr-10 mb-4 bg-black hover:bg-black-500 focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-black-600 dark:hover-bg-green-700 focus:outline-none dark:focus:ring-black-800"
                                                >
                                                    Create Subscription Box
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-4 w-full bg-white">
                                            <div className="mt-1 overflow-x-auto overflow-y-hidden flex space-x-4">
                                                {availableItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="mb-10 ml-10  mr-10 relative flex-shrink-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 flex flex-col items-center w-60 h-90"
                                                    >
                                                        <h2 className="text-xl font-semibold text-black mb-1">
                                                            {item.itemName}
                                                        </h2>
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.itemName}
                                                            className="w-full h-40 object-contain mb-1"
                                                        />
                                                        <span className="text-md font-semibold text-red-500 absolute top-12 left-6">
                                                            {item.isRecommend ? "Recommended" : ""}
                                                        </span>
                                                        <span className="text-lg font-semibold text-black">
                                                            {item.name}
                                                        </span>
                                                        <div>
                                                            <p className="-ml-20 text-sm font-semibold text-black">Brand: {item.brand}</p>
                                                            <p className="-ml-20 text-sm font-semibold text-black">Color: {item.color}</p>
                                                            <p className="-ml-20 text-sm font-semibold text-black">Price: ${item.price}</p>
                                                        </div>
                                                        <div
                                                            data-cb-type="checkout"
                                                            data-cb-item-0={item.id}
                                                            data-cb-item-0-quantity="1"
                                                        >
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleAddToTable(item)}
                                                                variant="slim"
                                                                className="mt-2 block w-full rounded-md py-2 text-sm font-medium text-center hover:border-primary bg-zinc-300 text-zinc-900"
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default SubscriptionManagement;
