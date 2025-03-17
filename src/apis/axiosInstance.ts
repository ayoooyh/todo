import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

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
    return response;
  },
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data.detail === "Token has expired"
    ) {
      const refreshToken = getCookie("refresh_token");
      if (!refreshToken) {
        return Promise.reject(error);
      }
      deleteCookie("access_token");
      deleteCookie("refresh_token");

      const refreshResponse = await axiosInstance.post(
        "/auth/tokens",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      if (
        refreshResponse.data.access_token &&
        refreshResponse.data.refresh_token
      ) {
        setCookie("accessToken", refreshResponse.data.access_token, {
          path: "/",
        });
        setCookie("refreshToken", refreshResponse.data.refresh_token, {
          path: "/",
        });
        return axiosInstance(error.config);
      } else {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
