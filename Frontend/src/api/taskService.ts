import axios, { AxiosRequestConfig } from "axios";
import { BE_URL } from "./api";

interface TaskCreatePayload {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    dob: string,
}

interface TaskUpdatePayload {
    id: string
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    dob: string,
}

const axiosWithToken = (token: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});

const createTask = async (payload: TaskCreatePayload, token: string) => {
    const response = await axios.post(`${BE_URL}/task`, payload, axiosWithToken(token));
    return response;
}

const getAllTasks = async (page: number = 0, size: number = 10, token: string) => {
    const response = await axios.get(`${BE_URL}/task?page=${page}&size=${size}`, axiosWithToken(token));
    return response;
}

const searchTasks = async (searchType: string, searchTerm: string, token: string) => {
    const response = await axios.get(`${BE_URL}/task/search?searchField=${searchType}&searchTerm=${searchTerm}`, axiosWithToken(token));
    return response;
}

const updateTask = async (payload: TaskUpdatePayload, token: string) => {
    const response = await axios.put(`${BE_URL}/task`, payload, axiosWithToken(token));
    return response;
}

const deleteTask = async (id: string, token: string) => {
    const response = await axios.delete(`${BE_URL}/task/${id}`, axiosWithToken(token));
    return response;
}

const TaskService = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    searchTasks,
};

export default TaskService;
