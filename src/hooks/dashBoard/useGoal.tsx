import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoal, postGoal, getGoalId } from "@/apis/dashBoard/goal";

export const useGoal = () => {
  return useQuery({
    queryKey: ["goal"],
    queryFn: getGoal,
  });
};

export const usePostGoal = () => {
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

export const useGetGoalId = (goal_id: number) => {
  return useQuery({
    queryKey: ["goal", goal_id],
    queryFn: () => getGoalId(goal_id),
  });
};
