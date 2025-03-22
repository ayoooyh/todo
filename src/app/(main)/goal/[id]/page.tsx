"use client";

import TodoByGoal from "./components/TodoByGoal";
import Image from "next/image";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import { useGetProgressTodoQuery } from "@/queries/useTodoQuery";
import { useGoalId } from "@/hooks/useGoalId";

export default function GoalPage() {
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
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
      <h1 className="text-lg font-medium">목표</h1>
      <div className="flex flex-col gap-4">
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

        <div className="flex justify-between w-full bg-blue-100 border border-slate-100 rounded-xl px-6 py-4 items-center">
          <div className="flex items-center gap-2">
            <Image src="/images/note.svg" alt="note" width={24} height={24} />
            <span className=" text-neutral-700 font-bold text-sm">
              노트 모아보기
            </span>
          </div>
          {/* TODO: 노트 모아보기 클릭 시 노트 모아보기 페이지로 이동 */}
          <Image
            src="/images/arrow_right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </div>

        <TodoByGoal />
      </div>
    </div>
  );
}
