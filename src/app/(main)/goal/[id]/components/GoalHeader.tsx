"use client";

import Image from "next/image";
import { useGetGoalQuery } from "@/queries/useGoalQuery";
import { useGetProgressTodoQuery } from "@/queries/useTodoQuery";
import { useGoalId } from "@/hooks/useId";
import { useState } from "react";
import EditAndDelete from "@/components/common/EditAndDelete";
import ProgressBar from "@/components/common/ProgressBar";

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

  const [isOpen, setIsOpen] = useState(false);

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

  const handleKebabClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl p-4 relative z-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/images/black-flag.svg"
            alt="blackIcon"
            width={40}
            height={40}
          />
          <span className="text-lg font-medium">{goalData.title}</span>
        </div>

        <button
          className="absolute right-4 top-5 cursor-pointer"
          onClick={handleKebabClick}
        >
          <Image
            src="/images/meatball.svg"
            alt="meatball"
            width={22}
            height={22}
          />
        </button>
        {isOpen && (
          <div className="absolute top-4 right-3">
            <EditAndDelete goalId={goalId} />
          </div>
        )}
      </div>

      <ProgressBar progress={progressData.progress} />
    </div>
  );
}
