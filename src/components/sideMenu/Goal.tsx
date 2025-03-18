"use client";

import {
  useGoalsQuery,
  usePostGoalsMutation,
} from "@/queries/dashBoard/useGoalQuery";
import { useState } from "react";
import Image from "next/image";

export default function Goal() {
  const { data, isLoading, error } = useGoalsQuery();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const { mutate: postGoal, isPending } = usePostGoalsMutation();

  const handleAddGoal = () => {
    postGoal({ title: newGoal });
    setIsAdding(false);
    setNewGoal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const onClickCancel = () => {
    setIsAdding(false);
    setNewGoal("");
  };

  // TODO: 로딩 중 화면 렌더링 추가 필요
  if (isLoading || isPending)
    return (
      <div className="flex justify-center items-center h-full">로딩 중...</div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        에러가 발생했습니다: {error.message}
      </div>
    );
  if (!data)
    return (
      <div className="flex justify-center items-center h-full">
        데이터가 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex justify-left items-center gap-2">
        <Image src="/images/flag.svg" alt="goal" width={24} height={24} />
        <span className="text-lg font-medium text-slate-800">목표</span>
      </div>
      <div className="flex flex-col">
        {data.goals.map((goal) => (
          <span
            key={goal.id}
            className="p-2 text-slate-700 font-medium text-sm"
          >
            <span className="pr-1 text-slate-700 font-medium text-sm">・</span>

            {goal.title}
          </span>
        ))}
      </div>

      {isAdding ? (
        <div className="relative w-full">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-blue-500 rounded-xl h-[50px] text-xs p-3"
            placeholder="새로운 목표를 입력하세요"
          />
          <button
            onClick={onClickCancel}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image src="/images/exit.svg" alt="exit" width={12} height={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-white border border-blue-500 py-3  rounded-xl w-full"
        >
          <div className="flex justify-center items-center gap-1 ">
            <Image
              src="/images/plus-blue.svg"
              alt="plus"
              width={24}
              height={24}
            />
            <span className="text-base font-medium text-blue-500">새 목표</span>
          </div>
        </button>
      )}
    </div>
  );
}
