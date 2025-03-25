"use client";

import Image from "next/image";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import { useGetProgressTodoQuery } from "@/queries/useTodoQuery";
import { useGoalId } from "@/hooks/useGoalId";

export default function GoalHeader() {
    const goalId = useGoalId();
  
    const {
      data: goalData,
      isLoading: goalLoading,
      error: goalError,
    } = useGetGoalQuery({ goalId });
  
    const {
      data: progressData,
      isLoading: progressLoading,
      error: progressError,
    } = useGetProgressTodoQuery({ goalId });
  
    if (!goalId) {
      return <div>유효하지 않은 목표 입니다.</div>;
    }
  
    if (goalLoading || progressLoading)
      return (
        <div className="flex justify-center items-center h-screen">
          로딩 중...
        </div>
      );
    if (goalError || progressError)
      return (
        <div className="flex justify-center items-center h-screen">
          에러가 발생했습니다: {goalError?.message}
        </div>
      );
    if (!goalData || !progressData)
      return (
        <div className="flex justify-center items-center h-screen">
          데이터를 불러오는데 실패했습니다.
        </div>
      );
  
  return (
            <div className="flex flex-col gap-6 bg-white rounded-xl p-4 relative">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/black-flag.svg"
                  alt="blackIcon"
                  width={40}
                  height={40}
                />
                <span className="text-lg font-medium">{goalData.title}</span>
    
                {/* TODO: 수정,삭제하기 드롭다운 애니메이션 구현 */}
                <Image
                  src="/images/meatball.svg"
                  alt="meatball"
                  width={24}
                  height={24}
                  className="absolute right-4 top-4"
                />
              </div>
              <div className="flex items-center justify-between">
                {/* TODO: 프로그레스 바 애니메이션 구현 */}
                <span className="text-slate-900 text-xs font-semibold">
                  Progress
                </span>
                <span className="text-slate-900 text-xs font-semibold">
                  {progressData.progress}%
                </span>
              </div>
            </div>
    
  )
}