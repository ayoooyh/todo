import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.access_token) {
      setCookie("access_token", response.data.access_token, {
        maxAge: 24 * 60 * 60, // 24시간
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    console.log("로그인 성공", response);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
