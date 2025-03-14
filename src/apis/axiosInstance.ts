import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("헤더:", response.headers);
    console.log("데이터:", response.data);
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
