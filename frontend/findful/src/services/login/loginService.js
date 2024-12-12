// import axios from "axios";
import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const registerUser = async (user) => {
  console.log("Registration form values:", user);
  const response = await fetch(`${apiUrl}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Registration response:", data);
  } else {
    const error = await response.json();
    throw Error(error.message || "Registration failed!");
  }
};

export const loginUser = async (user) => {
  console.log("Login form values:", user);
  const response = await fetch(`${apiUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/users/${id}`);
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};
