import axiosInstance from "@/apis/axiosInstance";
import { INotes, INote, ICreateNote, IUpdateNote } from "@/types/note";

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

export const getNote = async ({
  note_id,
}: {
  note_id: number;
}): Promise<INote> => {
  const response = await axiosInstance.get(`/notes/${note_id}`);
  return response.data;
};

export const postNote = async (data: ICreateNote): Promise<INote> => {
  const response = await axiosInstance.post("/notes", data);
  return response.data;
};

export const updateNote = async (
  note_id: number,
  data: IUpdateNote
): Promise<INote> => {
  const response = await axiosInstance.patch(`/notes/${note_id}`, data);
  return response.data;
};

export const deleteNote = async (note_id: number) => {
  await axiosInstance.delete(`/notes/${note_id}`);
};
