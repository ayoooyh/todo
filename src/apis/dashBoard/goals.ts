import axiosInstance from "../axiosInstance";
import {
  IGoals,
  IPostGoalsRequest,
  IGoalResponse,
  IPostGoalResponse,
} from "@/types/goal";

export const getGoals = async (): Promise<IGoals> => {
  const response = await axiosInstance.get("/goals");
  return response.data;
};

export const postGoal = async (
  data: IPostGoalsRequest
): Promise<IPostGoalResponse> => {
  const response = await axiosInstance.post("/goals", data);
  return response.data;
};

export const getGoal = async (goalId: number): Promise<IGoalResponse> => {
  const response = await axiosInstance.get(`/goals/${goalId}`);
  return response.data;
};

export const updateGoal = async (
  goalId: number,
  updateData: Partial<IGoals>
): Promise<IGoals> => {
  const response = await axiosInstance.patch(`/goals/${goalId}`, updateData);
  return response.data;
};
