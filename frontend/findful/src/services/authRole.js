import { jwtDecode } from "jwt-decode";

export const getRoleOfCurrentUser = () => {
  // TODO: Possibly rework once roles are saved
  const token = localStorage.getItem("token");
  if (!token) {
    return "GUEST";
  }
  const tokenData = jwtDecode(token);
  return tokenData['role'];
};