import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getTodos,
  getProgressTodo,
  postTodo,
  uploadFile,
  editTodo,
} from "@/apis/todos";
import {
  ITodos,
  IProgressTodoResponse,
  ICreateTodo,
  IUpdateTodo,
} from "@/types/todo";

export const useGetTodosQuery = ({
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
} = {}) => {
  return useQuery<ITodos>({
    queryKey: ["todos", goalId, size, done, cursor, sortOrder],
    queryFn: async () => {
      const response = await getTodos({
        goalId: goalId,
        size: size,
        done: done,
        cursor: cursor,
        sortOrder: sortOrder,
      });
      return response;
    },
    enabled: true,
    retry: 1,
  });
};

export const useGetProgressTodoQuery = ({ goalId }: { goalId: number }) => {
  return useQuery<IProgressTodoResponse>({
    queryKey: ["progress", goalId],
    queryFn: () => getProgressTodo(goalId),
  });
};

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoData,
      file,
    }: {
      todoData: ICreateTodo;
      file?: File;
    }) => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await uploadFile(formData);
        todoData.fileUrl = uploadResponse.url;
      }
      return await postTodo(todoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoId,
      title,
      done,
      fileUrl,
      linkUrl,
      goalId,
    }: IUpdateTodo & { todoId: number }) => {
      return await editTodo(todoId, { title, done, fileUrl, linkUrl, goalId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};
