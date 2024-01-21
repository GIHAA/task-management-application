import axios from "axios";
import { BE_URL } from "./api";

interface TaskCreatePayload {
    firstName: string,
    lastName:string,
    email:string,
    phoneNumber:string,
    gender:string,
    dob:string,
}

interface TaskUpdatePayload {
    id:string
    firstName: string,
    lastName:string,
    email:string,
    phoneNumber:string,
    gender:string,
    dob:string,
}

const createTask = async (payload:TaskCreatePayload) =>{
    const response = await axios.post(`${BE_URL}/task`, payload);
    return response;
}

const getAllTasks = async (page: number = 0, size : number = 10) =>{
    const response = await axios.get(`${BE_URL}/task?page=${page}&size=${size}`);
    return response;
}

const searchTasks = async (searchType: string ,  searchTerm : string) =>{
    const response = await axios.get(`${BE_URL}/task/search?searchField=${searchType}&searchTerm=${searchTerm}`);
    return response;
}

const updateTask = async (payload : TaskUpdatePayload) =>{
    const response = await axios.put(`${BE_URL}/task`, payload);
    return response;
}

const deleteTask = async (id : string) =>{
    const response = await axios.delete(`${BE_URL}/task/${id}`);
    return response;
}

const TaskService = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    searchTasks
};
  
export default TaskService;