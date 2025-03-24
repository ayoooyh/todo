import GoalHeader from "./components/GoalHeader";
import Image from "next/image";
import TodoByGoal from "./components/TodoByGoal";

export default function GoalPage() {
  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
      <h1 className="text-lg font-medium">목표</h1>
      <div className="flex flex-col gap-4">
        <GoalHeader />
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
