import axiosInstance from "../axiosInstance";
import {
  IGoals,
  IPostGoalsRequest,
  IPostGoalsResponse,
  IGetGoalsByIdResponse,
} from "@/types/goal";

export const getGoals = async (): Promise<IGoals> => {
  const response = await axiosInstance.get("/goals");
  return response.data;
};

export const postGoals = async (
  data: IPostGoalsRequest
): Promise<IPostGoalsResponse> => {
  const response = await axiosInstance.post("/goals", data);
  return response.data;
};

export const getGoalById = async (
  goal_id: number
): Promise<IGetGoalsByIdResponse> => {
  const response = await axiosInstance.get(`/goals/${goal_id}`);
  return response.data;
};

export const updateGoals = async (
  goalId: number,
  updateData: Partial<IGoals>
): Promise<IGoals> => {
  const response = await axiosInstance.patch(`/goals/${goalId}`, updateData);
  return response.data;
};
