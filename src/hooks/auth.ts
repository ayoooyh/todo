import { signIn } from "@/apis/auth";
import { setCookie, deleteCookie } from "cookies-next";
import { useCallback } from "react";
import { TokenTypes } from "@/types/token";

const useLogin = () => {
  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      let result;
      try {
        result = await signIn({ email, password });
      } catch (error) {
        alert("로그인에 실패했습니다.");
        console.error("로그인 실패:", error);
        return Promise.reject(error);
      }

      // 쿠키 옵션
      const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS에서만 쿠키 전송
        sameSite: "strict" as const, // CSRF 방지
      };

      setCookie(TokenTypes.ACCESS_TOKEN, result.access_token, cookieOptions);
      setCookie(TokenTypes.REFRESH_TOKEN, result.refresh_token, cookieOptions);

      return true;
    },
    []
  );

  return { login };
};

const useLogout = () => {
  const logout = useCallback(() => {
    deleteCookie(TokenTypes.ACCESS_TOKEN);
    deleteCookie(TokenTypes.REFRESH_TOKEN);
    window.location.href = "/auth/signin";
  }, []);

  return { logout };
};

export { useLogin, useLogout };
