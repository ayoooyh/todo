import axiosInstance from "@/apis/axiosInstance";
import {
  ITodos,
  IProgressTodoResponse,
  ICreateTodo,
  ICreateTodoResponse,
  IUploadFileResponse,
} from "@/types/todo";

export const getTodos = async ({
  goalId = undefined,
  size = 20,
  done = undefined,
  cursor = undefined,
  sortOrder = "newest",
}: {
  goalId?: number;
  size?: number;
  done?: boolean;
  cursor?: string;
  sortOrder?: "newest" | "oldest";
}): Promise<ITodos> => {
  const queryParams = new URLSearchParams();
  if (goalId !== undefined) queryParams.set("goalId", goalId.toString());
  if (size !== undefined) queryParams.set("size", size.toString());
  if (done !== undefined) queryParams.set("done", JSON.stringify(done));
  if (cursor !== undefined) queryParams.set("cursor", cursor);
  if (sortOrder !== undefined) queryParams.set("sortOrder", sortOrder);

  const response = await axiosInstance.get(`/todos?${queryParams.toString()}`);
  return response.data;
};

export const getProgressTodo = async (
  goalId: number
): Promise<IProgressTodoResponse> => {
  const response = await axiosInstance.get(`/todos/progress?goalId=${goalId}`);
  return response.data;
};

export const postTodo = async (
  data: ICreateTodo
): Promise<ICreateTodoResponse> => {
  const response = await axiosInstance.post("/todos", data);
  return response.data;
};

export const uploadFile = async (
  file: FormData
): Promise<IUploadFileResponse> => {
  const response = await axiosInstance.post("/files", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
