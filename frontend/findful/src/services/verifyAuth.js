import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const verifyAuth = async (role) => {
    try{
        
        const response = await fetch(`${apiUrl}/api/users/auth`, {
            method: "GET",
            credentials: "include", // Include cookies(token) in the request
          });
        const data = await response.json();
        console.log(data);
        const userRole = data.user.role;
        if (response.ok && userRole === role) {
            console.log("Authorization successful!");
            return response;
        } else {
            throw Error("Authorization failed!");
        }
    } catch (error) {
        console.error("Error verifying authorization:", error);
    }
};