import axiosInstance from "@/apis/axiosInstance";
import { INotes } from "@/types/note";

export const getNotes = async ({
  goal_id,
  cursor = undefined,
  size = 20,
}: {
  goal_id: number;
  cursor?: string;
  size?: number;
}): Promise<INotes> => {
  const queryParams = new URLSearchParams();
  if (goal_id !== undefined) queryParams.set("goal_id", goal_id.toString());
  if (cursor !== undefined) queryParams.set("cursor", cursor);
  if (size !== undefined) queryParams.set("size", size.toString());

  const response = await axiosInstance.get(`/notes?${queryParams.toString()}`);
  return response.data;
};
