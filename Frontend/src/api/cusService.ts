import axios, { AxiosRequestConfig } from "axios";

//const  BE_URL = "https://proclient.azurewebsites.net/api/v1"
const  BE_URL = "http://localhost/api/v1"

interface CustomerCreatePayload {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    dob: string,
}

interface CustomerUpdatePayload {
    id: string
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    dob: string,
}

// Function to set up Axios with the bearer token
const axiosWithToken = (token: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});

const createCustomer = async (payload: CustomerCreatePayload, token: string) => {
    const response = await axios.post(`${BE_URL}/user`, payload, axiosWithToken(token));
    return response;
}

const getAllCustomers = async (page: number = 0, size: number = 10, token: string) => {
    const response = await axios.get(`${BE_URL}/user?page=${page}&size=${size}`, axiosWithToken(token));
    return response;
}

const searchCustomers = async (searchType: string, searchTerm: string, token: string) => {
    const response = await axios.get(`${BE_URL}/user/search?searchField=${searchType}&searchTerm=${searchTerm}`, axiosWithToken(token));
    return response;
}

const updateCustomer = async (payload: CustomerUpdatePayload, token: string) => {
    const response = await axios.put(`${BE_URL}/user`, payload, axiosWithToken(token));
    return response;
}

const deleteCustomer = async (id: string, token: string) => {
    const response = await axios.delete(`${BE_URL}/user/${id}`, axiosWithToken(token));
    return response;
}

const CustomerService = {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
};

export default CustomerService;
