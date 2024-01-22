import axios from "axios";
import { BE_URL } from "./api";


const healthCheck = async () =>{
    const response = await axios.get(`${BE_URL}/health`);
    return response;
}

const healthService = {
 healthCheck
};
  
export default healthService;