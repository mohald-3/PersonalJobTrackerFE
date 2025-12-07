import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:7030";

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set true if you later use cookies/auth
});

// Optional: basic logger for errors – can be improved later
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  },
);
