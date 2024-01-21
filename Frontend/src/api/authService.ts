import axios from "axios";

//const  BE_URL = "https://proclient.azurewebsites.net/api/v1"
const  BE_URL = "http://localhost/api/v1/auth"

interface signInPayload {

    email:string,
    password:string,
}

interface signUpPayload {
    // id:string
    // firstName: string,
    // lastName:string,
    // email:string,
    // phoneNumber:string,
    // gender:string,
    // dob:string,
}

const signIn = async (payload:signInPayload) =>{
    const response = await axios.post(`${BE_URL}/signin`, payload);
    return response;
}

const signUp = async (payload:signUpPayload) =>{
    const response = await axios.post(`${BE_URL}/signup`, payload);
    return response.data.results;
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