import { useParams } from "next/navigation";

export const useGoalId = () => {
  const params = useParams();
  const goalId = typeof params?.id === "string" ? parseInt(params.id) : null;
  // URL 파라미터에서 id를 추출하여 숫자로 변환

  return goalId;
};
