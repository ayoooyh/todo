import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

enum TokenTypes {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

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
        return Promise.reject(error);
      }
      deleteCookie(TokenTypes.ACCESS_TOKEN);
      deleteCookie(TokenTypes.REFRESH_TOKEN);

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
