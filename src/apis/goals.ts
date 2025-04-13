import axiosInstance from "./axiosInstance";
import {
  IGoals,
  IPostAndUpdateGoals,
  IGoalResponse,
  IPostGoalResponse,
} from "@/types/goal";

export const getGoals = async ({
  cursor = undefined,
  size = 20,
  sortOrder = "newest",
}: {
  cursor?: string;
  size?: number;
  sortOrder?: "newest" | "oldest";
}): Promise<IGoals> => {
  const queryParams = new URLSearchParams();
  if (cursor !== undefined) queryParams.set("cursor", cursor);
  if (size !== undefined) queryParams.set("size", size.toString());
  if (sortOrder !== undefined) queryParams.set("sortOrder", sortOrder);

  const response = await axiosInstance.get(`/goals?${queryParams.toString()}`);
  return response.data;
};

export const postGoal = async (
  data: IPostAndUpdateGoals
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
  updateData: IPostAndUpdateGoals
): Promise<IPostAndUpdateGoals> => {
  const response = await axiosInstance.patch(`/goals/${goalId}`, updateData);
  return response.data;
};

export const deleteGoal = async (goalId: number): Promise<void> => {
  await axiosInstance.delete(`/goals/${goalId}`);
};
