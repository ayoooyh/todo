import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTodos, getProgressTodo, postTodo, uploadFile } from "@/apis/todos";
import { ITodos, IProgressTodoResponse, ICreateTodo } from "@/types/todo";

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
}) => {
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

export const useGetProgressTodoQuery = (goalId: number) => {
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
  } = useQuery<IProgressTodoResponse>({
    queryKey: ["progress", goalId],
    queryFn: () => getProgressTodo(goalId),
  });

  return {
    progressData,
    progressLoading,
    progressError,
  };
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
