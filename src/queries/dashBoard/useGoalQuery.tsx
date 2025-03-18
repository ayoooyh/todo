import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, postGoals, getGoalById } from "@/apis/dashBoard/goals";

export const useGoalsQuery = () => {
  return useQuery({
    queryKey: ["goal"],
    queryFn: getGoals,
  });
};

export const usePostGoalsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal"] });
    },
    onError: (error) => {
      console.error("Goal 추가 실패:", error);
    },
  });
};

export const useGetGoalByIdQuery = (goal_id: number) => {
  return useQuery({
    queryKey: ["goal", goal_id],
    queryFn: () => getGoalById(goal_id),
  });
};
