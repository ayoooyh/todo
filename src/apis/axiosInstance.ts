import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { TokenTypes } from "@/types/token";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie(TokenTypes.ACCESS_TOKEN);
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
      const refreshToken = getCookie(TokenTypes.REFRESH_TOKEN);
      if (!refreshToken) {
        console.log("refreshToken 없음");
        return Promise.reject(error);
      }
      deleteCookie(TokenTypes.ACCESS_TOKEN);
      deleteCookie(TokenTypes.REFRESH_TOKEN);
      let refreshResponse;
      try {
        refreshResponse = await axiosInstance.post(
          "/auth/tokens",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
      } catch (error) {
        return Promise.reject(error);
      }
      if (
        refreshResponse.data.access_token &&
        refreshResponse.data.refresh_token
      ) {
        setCookie(TokenTypes.ACCESS_TOKEN, refreshResponse.data.access_token, {
          path: "/",
        });
        setCookie(
          TokenTypes.REFRESH_TOKEN,
          refreshResponse.data.refresh_token,
          {
            path: "/",
          }
        );
        return axiosInstance(error.config);
      } else {
        deleteCookie(TokenTypes.ACCESS_TOKEN);
        deleteCookie(TokenTypes.REFRESH_TOKEN);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
