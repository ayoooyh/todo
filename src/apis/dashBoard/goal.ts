import axiosInstance from "../axiosInstance";
import {
  IGoal,
  IPostGoalRequest,
  IPostGoalResponse,
  IGetGoalIdResponse,
} from "@/types/goal";

export const getGoal = async (): Promise<IGoal> => {
  const response = await axiosInstance.get("/goals");
  return response.data;
};

export const postGoal = async (
  data: IPostGoalRequest
): Promise<IPostGoalResponse> => {
  const response = await axiosInstance.post("/goals", data);
  return response.data;
};

export const getGoalId = async (
  goal_id: number
): Promise<IGetGoalIdResponse> => {
  const response = await axiosInstance.get(`/goals/${goal_id}`);
  return response.data;
};

export const updateGoal = async (
  goalId: number,
  updateData: Partial<IGoal>
) => {
  const response = await fetch(`/api/goals/${goalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update goal");
  }

  return response.json();
};
