import axiosInstance from "../axiosInstance";
import { ISignUpRequest } from "@/types/auth/auth";

export const signUp = async (data: ISignUpRequest) => {
  const response = await axiosInstance.post("/user", data);
  return response.data;
};
