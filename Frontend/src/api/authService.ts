import axios from "axios";
import { BE_URL } from "./api";


interface signInPayload {

    email:string,
    password:string,
}

interface signUpPayload {
    firstName: string,
    lastName:string,
    email:string,
    phoneNumber:string,
    gender:string,
    dob:string,
    password:string
}

const signIn = async (payload:signInPayload) =>{
    const response = await axios.post(`${BE_URL}/auth/signin`, payload);
    return response;
}

const signUp = async (payload:signUpPayload) =>{
    const response = await axios.post(`${BE_URL}/auth/signup`, payload);
    return response;
}

const logout = () => {
    //localStorage.removeItem("logged_user");
  };

const AuthService = {
    signIn,
    signUp,
    logout
};
  
export default AuthService;