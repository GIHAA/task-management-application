import axios from "axios";

//const  BE_URL = "https://proclient.azurewebsites.net/api/v1"
const  BE_URL = "http://localhost/api/v1"

interface CustomerCreatePayload {
    firstName: string,
    lastName:string,
    email:string,
    phoneNumber:string,
    gender:string,
    dob:string,
}

interface CustomerUpdatePayload {
    id:string
    firstName: string,
    lastName:string,
    email:string,
    phoneNumber:string,
    gender:string,
    dob:string,
}

const createCustomer = async (payload:CustomerCreatePayload) =>{
    const response = await axios.post(`${BE_URL}/customer`, payload);
    return response;
}

const getAllCustomers = async (page: number = 0, size : number = 10) =>{
    const response = await axios.get(`${BE_URL}/customer?page=${page}&size=${size}`);
    return response;
}

const searchCustomers = async (searchType: string ,  searchTerm : string) =>{
    const response = await axios.get(`${BE_URL}/customer/search?searchField=${searchType}&searchTerm=${searchTerm}`);
    return response;
}

const updateCustomer = async (payload : CustomerUpdatePayload) =>{
    const response = await axios.put(`${BE_URL}/customer`, payload);
    return response;
}

const deleteCustomer = async (id : string) =>{
    const response = await axios.delete(`${BE_URL}/customer/${id}`);
    return response;
}

const CustomerService = {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    searchCustomers
};
  
export default CustomerService;