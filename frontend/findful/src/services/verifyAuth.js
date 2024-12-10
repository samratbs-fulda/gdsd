import { jwtDecode } from "jwt-decode";

export const verifyAuth = async (role) => {
    role = role.toUpperCase();
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw Error("No token found!");
        }
        const tokenData = jwtDecode(token);
        if (tokenData['role'] !== role) {
            throw Error("Unauthorized!");
        }
        return;
    } catch (error) {
        const message = "Error verifying authorization: " + error.message
        throw Error(message);
    }
};