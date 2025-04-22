"use client";

import RecentTodos from "./components/RecentTodos";
import MainTodoByGoals from "./components/MainTodoByGoals";
import Image from "next/image";
import { useMemo } from "react";
import { useGetTodosQuery } from "@/queries/useTodoQuery";
// import progressStyle from "@/style/progreeStyle.module.css";

function useTodoCompletion(
  totalCount: number | null,
  nextCursor: number | null
): number {
  return useMemo(() => {
    if (!totalCount) return 0;
    const completed = totalCount - (nextCursor || 0);
    return Math.round((completed / totalCount) * 100);
  }, [totalCount, nextCursor]);
}

export default function Dashboard() {
  const { data } = useGetTodosQuery();
  const completionPercentage = useTodoCompletion(
    data?.total_count || null,
    data?.next_cursor || null
  );

  return (
    <>
      <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
        <span className="text-xl font-semibold text-slate-900">대시보드</span>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <section className="bg-white rounded-xl px-6 py-4 w-full h-[250px]">
              <RecentTodos />
            </section>
            <div className="relative bg-blue-500 rounded-xl px-6 py-4 w-full h-[250px] flex flex-col gap-4">
              <Image
                src="/images/progress.svg"
                alt="progress"
                width={40}
                height={40}
              />
              <div className="flex flex-row items-center justify-between relative">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-lg font-semibold">
                    내 진행 상황
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-white text-3xl font-bold">
                      {completionPercentage}
                    </span>
                    <span className="text-white text-base font-semibold">
                      %
                    </span>
                  </div>
                </div>
                <div className="absolute right-10 z-10 mt-10">
                  <svg className="transform -rotate-90 w-[166px] h-[166px]">
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      stroke="#0F172A"
                      strokeWidth="25"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      stroke="#FFFFFF"
                      strokeWidth="25"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 55}
                      strokeDashoffset={
                        (completionPercentage / 100) * (2 * Math.PI * 55)
                      }
                      className="text-white transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 right-0">
                <Image
                  src="/images/large_layout.svg"
                  alt="large_layout"
                  width={588}
                  height={250}
                />
              </div>
            </div>
          </div>
          <section className="bg-white rounded-xl p-4 w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/flag-icon.svg"
                  alt="flag-icon"
                  width={40}
                  height={40}
                />
                <span className="text-lg font-semibold text-slate-800">
                  목표 별 할 일
                </span>
              </div>
              <MainTodoByGoals />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
