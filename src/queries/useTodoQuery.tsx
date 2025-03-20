import { useQuery } from "@tanstack/react-query";
import { getTodos, getProgressTodo } from "@/apis/todos";
import { ITodos, IProgressTodoResponse } from "@/types/todo";

export const useGetTodosQuery = (props?: { goalId?: number }) => {
  return useQuery<ITodos>({
    queryKey: ["todos", props?.goalId],
    queryFn: async () => {
      const response = await getTodos({
        goalId: props?.goalId,
      });
      return response;
    },
    enabled: true,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
