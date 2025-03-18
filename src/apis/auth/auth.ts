import axiosInstance from "../axiosInstance";
import { ISignUpRequest, ISignInRequest, ISignInResponse } from "@/types/auth";

export const signUp = async (data: ISignUpRequest) => {
  const response = await axiosInstance.post("/user", data);
  return response.data;
};

export const signIn = async (data: ISignInRequest) => {
  const response = await axiosInstance.post<ISignInResponse>(
    "/auth/login",
    data
  );
  return response.data;
};
