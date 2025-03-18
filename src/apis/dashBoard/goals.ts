import axiosInstance from "../axiosInstance";
import {
  IGoals,
  IPostGoalsRequest,
  IGoalResponse,
  IGetGoalResponse,
} from "@/types/goal";

export const getGoals = async (): Promise<IGoals> => {
  const response = await axiosInstance.get("/goals");
  return response.data;
};

export const postGoal = async (
  data: IPostGoalsRequest
): Promise<IGoalResponse> => {
  const response = await axiosInstance.post("/goals", data);
  return response.data;
};

export const getGoal = async (goal_id: number): Promise<IGetGoalResponse> => {
  const response = await axiosInstance.get(`/goals/${goal_id}`);
  return response.data;
};

export const updateGoal = async (
  goalId: number,
  updateData: Partial<IGoals>
): Promise<IGoals> => {
  const response = await axiosInstance.patch(`/goals/${goalId}`, updateData);
  return response.data;
};
