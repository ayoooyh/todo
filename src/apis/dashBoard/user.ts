import axiosInstance from "../axiosInstance";
import { IUser } from "@/types/user";

export const getUser = async (): Promise<IUser> => {
  const response = await axiosInstance.get("/user");
  return response.data;
};
