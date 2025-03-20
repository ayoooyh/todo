import axiosInstance from "@/apis/axiosInstance";
import {
  ITodos,
  IProgressTodoResponse,
  ICreateTodo,
  ICreateTodoResponse,
  IUploadFileResponse,
} from "@/types/todo";

export const getTodos = async (
  goalId?: number,
  size: number = 20
): Promise<ITodos> => {
  const url = goalId
    ? `/todos?goalId=${goalId}&size=${size}`
    : `/todos?size=${size}`;
  const response = await axiosInstance.get(url);
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
