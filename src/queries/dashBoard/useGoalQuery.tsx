import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, postGoal, getGoal } from "@/apis/goals";
import { IGoals } from "@/types/goal";
export const useGetGoalsQuery = ({
  cursor = undefined,
  size = 20,
  sortOrder = "newest",
}: {
  cursor?: string;
  size?: number;
  sortOrder?: "newest" | "oldest";
}) => {
  return useQuery<IGoals>({
    queryKey: ["goals", cursor, size, sortOrder],
    queryFn: () =>
      getGoals({ cursor: cursor, size: size, sortOrder: sortOrder }),
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

export const useGetGoalQuery = (goalId: number) => {
  return useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => getGoal(goalId),
    staleTime: Infinity,
    refetchOnMount: true,
    enabled: true,
  });
};
