import { signIn } from "@/apis/auth/auth";
import { setCookie } from "cookies-next";
import { useCallback } from "react";

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

      setCookie("access_token", result.access_token, { path: "/" });
      setCookie("refresh_token", result.refresh_token, { path: "/" });
      return true;
    },
    []
  );

  return { login };
};

export { useLogin };
