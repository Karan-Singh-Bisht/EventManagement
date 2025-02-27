import axios from "axios";
export const API_BASE_URL = "https://eventmanagement-iggq.onrender.com";

const token = localStorage.getItem("token");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
