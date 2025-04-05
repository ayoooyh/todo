"use client";

import Image from "next/image";
import { useGetNotesQuery } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useGoalId";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import { useGetTodosQuery } from "@/queries/useTodoQuery";

export default function NotePage() {
  const goalId = useGoalId();

  const { data, isLoading } = useGetNotesQuery({
    goal_id: goalId,
    size: 20,
    cursor: undefined,
  });

  const { data: goalData, isLoading: goalLoading } = useGetGoalQuery({
    goalId,
  });

  const { data: todoData, isLoading: todoLoading } = useGetTodosQuery({
    goalId,
  });

  if (isLoading || goalLoading || todoLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto">
      <h1 className="text-lg font-semibold text-slate-900">노트 모아보기</h1>
      <div className="bg-white border border-slate-100 rounded-xl px-6 py-3.5 flex items-center gap-2">
        <Image src="/images/black-flag.svg" alt="note" width={24} height={24} />
        {data?.notes.map((note) => (
          <div key={note.goal_id}>
            <span className="text-slate-800 font-semibold text-sm mt-0.5">
              {goalData?.title}
            </span>
          </div>
        ))}
      </div>
      {data?.notes.map((note) => (
        <div
          className="flex flex-col gap-4 bg-white border border-slate-100 rounded-xl px-6 py-3.5"
          key={note.goal_id}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/images/note-list.svg"
              alt="note"
              width={28}
              height={28}
            />
            <Image src="/images/kebab.svg" alt="kebab" width={24} height={24} />
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-slate-800 font-semibold text-sm mt-0.5">
              {note.title}
            </span>

            <hr className="border-t border-slate-200" />

            <div className="flex items-center gap-2">
              <span className="px-[3px] py-0.5 bg-slate-100 rounded-[4px] text-xs font-medium text-slate-700">
                To do
              </span>

              <span className="text-slate-700 font-normal text-xs">
                {
                  todoData?.todos.find((todo) => todo.id === note.todo_id)
                    ?.title
                }
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
