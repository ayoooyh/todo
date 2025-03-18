import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, postGoal, getGoal } from "@/apis/dashBoard/goals";

export const useGoalsQuery = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
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
  });
};
