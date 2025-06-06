import {
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getTodos,
  getProgressTodo,
  postTodo,
  uploadFile,
  editTodo,
  deleteTodo,
} from "@/apis/todos";
import {
  ITodos,
  IProgressTodoResponse,
  ICreateTodo,
  IUpdateTodo,
} from "@/types/todo";

export const useGetTodosQuery = ({
  goalId = undefined,
  size = 10000,
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
    queryFn: () =>
      getTodos({
        goalId,
        size,
        done,
        cursor,
        sortOrder,
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
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
      file,
    }: IUpdateTodo & { todoId: number; file?: File }) => {
      let updatedFileUrl = fileUrl;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await uploadFile(formData);
        updatedFileUrl = uploadResponse.url;
      }

      return await editTodo(todoId, {
        title,
        done,
        fileUrl: updatedFileUrl,
        linkUrl,
        goalId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress"],
      });
    },
  });
};

export const useDeleteTodoMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: number) => await deleteTodo(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onSuccess();
    },
  });
};

export const useInfiniteTodosQuery = ({ goalId }: { goalId: number }) => {
  return useInfiniteQuery<ITodos>({
    queryKey: ["todos", goalId],
    queryFn: ({ pageParam }) => {
      const res = getTodos({
        goalId,
        cursor: pageParam as string,
        size: 100,
      });
      return res;
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,

    initialPageParam: 0,
  });
};
