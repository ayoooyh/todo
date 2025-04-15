"use client";

import RecentTodos from "./components/RecentTodos";
import MainTodoByGoals from "./components/MainTodoByGoals";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
        <span className="text-xl font-semibold text-slate-900">대시보드</span>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <section className="bg-white rounded-xl px-6 py-4 w-full h-[250px]">
              <RecentTodos />
            </section>
            <div className=" bg-blue-500 rounded-xl px-6 py-4 w-full h-[250px] flex flex-col gap-4">
              <Image
                src="/images/progress.svg"
                alt="progress"
                width={40}
                height={40}
              />
              <span className="text-white text-lg font-semibold">
                내 진행 상황
              </span>
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
