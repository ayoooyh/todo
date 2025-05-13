"use client";

import GoalHeader from "./components/GoalHeader";
import Image from "next/image";
import TodoByGoal from "./components/TodoByGoal";
import { useGetNotesQuery } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useId";
import Link from "next/link";

export default function GoalPage() {
  const goalId = useGoalId();

  const { data, isLoading } = useGetNotesQuery({
    goal_id: goalId,
    size: 20,
    cursor: undefined,
  });

  if (isLoading) {
    return <></>;
  }

  console.log(data);

  return (
    <div className="flex flex-col gap-3 py-6 px-2 max-w-[1200px] mx-auto sm:px-4 md:px-6 lg:px-20">
      <h1 className="text-lg font-medium text-slate-900">목표</h1>
      <div className="flex flex-col gap-4">
        <GoalHeader />
        <Link href={`/notes/${goalId}`}>
          <div className="flex justify-between w-full bg-blue-100 border border-slate-100 rounded-xl px-6 py-4 items-center">
            <div className="flex items-center gap-2">
              <Image src="/images/note.svg" alt="note" width={24} height={24} />
              <span className=" text-neutral-700 font-bold text-sm">
                노트 모아보기
              </span>
            </div>
            <Image
              src="/images/arrow_right.svg"
              alt="arrow-right"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
        </Link>

        <TodoByGoal />
      </div>
    </div>
  );
}
