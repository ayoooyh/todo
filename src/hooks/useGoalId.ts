import { useParams } from "next/navigation";

export const useGoalId = () => {
  const params = useParams<{ id: string }>();
  const goalId = Number(params.id);

  return goalId;
};
