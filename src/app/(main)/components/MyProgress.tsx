import { useGetTodosQuery } from "@/queries/useTodoQuery";
import { useMemo } from "react";
import { ITodos } from "@/types/todo";

function useTodoCompletion(todos: ITodos | undefined): number {
  return useMemo(() => {
    if (!todos || todos.todos.length === 0) return 0;

    const completedTodos = todos.todos.filter((todo) => todo.done);
    return Math.round((completedTodos.length / todos.todos.length) * 100);
  }, [todos]);
}

export default function MyProgress() {
  const { data } = useGetTodosQuery();
  const completionPercentage = useTodoCompletion(data);

  return (
    <div className="flex flex-row items-center justify-between relative">
      <div className="flex flex-col gap-1 z-[2] relative">
        <span className="text-white text-lg font-semibold">내 진행 상황</span>
        <div className="flex items-center gap-1">
          <span className="text-white text-3xl font-bold">
            {completionPercentage}
          </span>
          <span className="text-white text-base font-semibold">%</span>
        </div>
      </div>

      <div className="absolute right-0 mt-10 z-[2]">
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
            strokeDashoffset={(completionPercentage / 100) * (2 * Math.PI * 55)}
            className="text-white transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}
