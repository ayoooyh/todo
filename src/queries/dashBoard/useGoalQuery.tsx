import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, postGoal, getGoal } from "@/apis/dashBoard/goals";

export const useGoalQuery = () => {
  return useQuery({
    queryKey: ["goal"],
    queryFn: getGoals,
  });
};

export const usePostGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal"] });
    },
    onError: (error) => {
      console.error("Goal 추가 실패:", error);
    },
  });
};

export const useGetGoalQuery = (goal_id: number) => {
  return useQuery({
    queryKey: ["goal", goal_id],
    queryFn: () => getGoal(goal_id),
  });
};
