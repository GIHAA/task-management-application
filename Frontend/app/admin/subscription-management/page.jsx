'use client';

import React, { useState, useEffect } from "react";
import Admin from "@components/Admin";
import subscriptionServices from "@app/api/subscriptionServices";
import { Oval } from "react-loader-spinner";
import { useRouter } from 'next/navigation';
import { parseDateStringToDate } from "@app/utils/date";

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

const SubscriptionManagement = () => {
    const router = useRouter();

    const [searchedResults, setSearchedResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await subscriptionServices.getSubscriptions();
            if (response.status === 200) {
                setSearchedResults(response.data.data.subscriptions);
            } else {
                console.error("Error fetching data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleView = (itemId) => {
        router.push(`/admin/subscription-management/view?id=${itemId}`);
    };

    return (
        <>
            <Admin />
            <div class="md:ml-64 h-auto">
                <div class="rounded-lg dark:border-gray-600 h-screen">
                    <section class="bg-gray-50 dark:bg-gray-900 h-screen p-3 sm:p-5">
                        <div class="mx-auto max-w-screen-xl px-4 lg:px-2 pt-[50px]">
                            <div class="flex justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
                                {/* Your content here */}
                            </div>
                            <div class="bg-white mt-[10px] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[420px]">
                                        <Placeholder />
                                    </div>
                                ) : (
                                    <>
                                        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                            <div class="w-full md:w-1/2">
                                                <h1
                                                    className="text-black text-3xl pt-2"
                                                >
                                                    Subscription Box Management
                                                </h1>
                                            </div>
                                        </div>
                                        <div class="max-h-[420px] h-screen overflow-y-auto p-10">
                                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th scope="col" class="px-4 py-3">
                                                            Customer name
                                                        </th>
                                                        <th scope="col" class="px-4 py-3">
                                                            Payment Amount
                                                        </th>
                                                        <th scope="col" class="px-4 py-3">
                                                            Package Name
                                                        </th>
                                                        <th scope="col" class="px-4 py-3">
                                                            Status
                                                        </th>
                                                        <th scope="col" class="px-4 py-3">
                                                            Start Date
                                                        </th>
                                                        <th scope="col" class="px-4 py-3">
                                                            End Date
                                                        </th>
                                                        <th scope="col" class="px-4 py-3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {searchedResults.map((item) => (
                                                        <tr
                                                            key={item.id}
                                                            class="border-b dark:border-gray-700"
                                                            onClick={() => {
                                                                setSelectSeller(item);
                                                            }}
                                                        >
                                                            <th
                                                                scope="row"
                                                                class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                            >
                                                                {item.user.firstName + " " + item.user.lastName}
                                                            </th>
                                                            <td class="px-4 py-3">${item.payment.amount}</td>
                                                            <td class="px-4 py-3">{item.package.name}</td>
                                                            <td class="px-4 py-3">{item.status}</td>
                                                            <td class="px-4 py-3">{parseDateStringToDate(item.startDate)}</td>
                                                            <td class="px-4 py-3">{parseDateStringToDate(item.endDate)}</td>
                                                            <td class="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <button
                                                                        type="button"
                                                                        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 ml-auto dark:bg-blue-600 dark:hover-bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${item.status === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        onClick={() => handleView(item.id)}
                                                                        disabled={item.status === 'COMPLETED'}
                                                                    >
                                                                        View
                                                                    </button>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    ))}
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
        </>
    );
};

export default SubscriptionManagement;
