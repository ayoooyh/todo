import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGoals,
  postGoal,
  getGoal,
  updateGoal,
  deleteGoal,
} from "@/apis/goals";
import { IGoals, IPostAndUpdateGoals } from "@/types/goal";

export const useGetGoalsQuery = (
  {
    cursor = undefined,
    size = 20,
    sortOrder = "newest",
  }: {
    cursor?: string;
    size?: number;
    sortOrder?: "newest" | "oldest";
  } = {}
  // = {} : 파라미터 없이도 호출 가능하도록 빈 객체를 기본값으로 설정
) => {
  return useQuery<IGoals>({
    queryKey: ["goals", cursor, size, sortOrder],
    queryFn: async () => {
      const response = await getGoals({
        cursor,
        size,
        sortOrder,
      });
      return response;
    },
    enabled: true,
    retry: 1,
  });
};

export const usePostGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      console.error("Goal 추가 실패:", error);
    },
  });
};

export const useGetGoalQuery = ({ goalId }: { goalId: number }) => {
  return useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => getGoal(goalId),
    staleTime: Infinity,
    refetchOnMount: true,
    enabled: true,
  });
};

export const useUpdateGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      updateData,
    }: {
      goalId: number;
      updateData: IPostAndUpdateGoals;
    }) => updateGoal(goalId, updateData),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["goal", variables.goalId, data],
      });

      queryClient.invalidateQueries({
        queryKey: ["goals", variables.goalId],
      });
    },
    onError: (error) => {
      console.error("Goal 수정 실패:", error);
    },
  });
};

export const useDeleteGoalMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: number) => await deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onSuccess();
    },
  });
};
