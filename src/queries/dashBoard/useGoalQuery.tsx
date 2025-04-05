import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, postGoal, getGoal } from "@/apis/goals";
import { IGoals } from "@/types/goal";
import { useParams } from "next/navigation";

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

export const useGoalId = () => {
  const params = useParams<{ id: string }>();
  const goalId = Number(params.id);

  return goalId;
};
