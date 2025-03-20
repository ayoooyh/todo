"use client";

import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import { useParams } from "next/navigation";
import { useGetTodosQuery } from "@/queries/useTodoQuery";
import { useGetProgressTodoQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import CreateTodo from "./CreateTodo";
import { useState } from "react";

export default function TodoByGoalPage() {
  const params = useParams();
  const goalId = typeof params?.id === "string" ? parseInt(params.id) : null;
  // URL 파라미터에서 id를 추출하여 숫자로 변환

  const {
    data: goalData,
    isLoading: goalLoading,
    error: goalError,
  } = useGetGoalQuery(goalId ?? Number(params.id));
  // goalId가 null인 경우 params.id를 숫자로 변환하여 사용

  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
  } = useGetTodosQuery(goalId ? { goalId } : undefined);

  // const goalTodos = todos.filter((todo) => todo.goal_id === goalId);
  const goalTodos = todos;
  const { progressData, progressLoading, progressError } =
    useGetProgressTodoQuery(goalId ?? Number(params.id));
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!goalId) {
    return <div>유효하지 않은 목표 입니다.</div>;
  }

  if (goalLoading || todosLoading || progressLoading)
    return <div>로딩 중...</div>;
  if (goalError || todosError || progressError)
    return <div>에러가 발생했습니다: {goalError?.message}</div>;
  if (!goalData || !todos || !progressData)
    return <>데이터를 불러오는데 실패했습니다.</>;

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
      <h1 className="text-lg font-medium">목표</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 bg-white rounded-xl p-4 relative">
          <div className="flex items-center gap-2">
            <Image
              src="/images/black-flag.svg"
              alt="blackIcon"
              width={40}
              height={40}
            />
            <span className="text-lg font-medium">{goalData.title}</span>

            {/* TODO: 수정,삭제하기 드롭다운 구현 */}
            <Image
              src="/images/meatball.svg"
              alt="meatball"
              width={24}
              height={24}
              className="absolute right-4 top-4"
            />
          </div>
          <p className="text-gray-500 text-xs">
            Progress : {progressData.progress}%
          </p>
        </div>

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
          />
        </div>

        <div>
          {goalTodos.length === 0 ? (
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-1/2 bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className=" text-slate-800 font-semibold text-sm">
                    To do
                  </span>

                  <button
                    className="flex items-center gap-1"
                    onClick={handleModalOpen}
                  >
                    <Image
                      src="/images/plus-blue.svg"
                      alt="plus"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm text-blue-500 font-semibold">
                      할일 추가
                    </span>
                  </button>
                  {isModalOpen && <CreateTodo onClose={handleModalClose} />}
                </div>
                <div className="flex items-center justify-center flex-1 min-h-[100px]">
                  <span className="text-sm text-neutral-500">
                    해야할 일이 아직 없어요
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2 bg-slate-200 rounded-xl p-4">
                <span className="text-slate-800 font-semibold text-sm">
                  Done
                </span>
                <div className="flex items-center justify-center flex-1 min-h-[100px]">
                  <span className="text-sm text-neutral-500">
                    다 한 일이 아직 없어요
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-1/2 bg-white rounded-xl p-4">
                <span className="text-slate-800 font-semibold text-sm">
                  To do
                </span>
                <div className="mt-2 ml-4 flex flex-col">
                  {goalTodos
                    .filter((todo) => !todo.done)
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-2 text-neutral-700 text-sm"
                      >
                        <input type="checkbox" checked={todo.done} />
                        {todo.title}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-1/2 bg-slate-200 rounded-xl p-4">
                {goalTodos.filter((todo) => todo.done).length === 0 ? (
                  <div className="flex flex-col h-full">
                    <span className="text-slate-800 font-semibold text-sm">
                      Done
                    </span>
                    <div className="flex items-center justify-center flex-1">
                      <span className="text-sm text-slate-500">
                        다 한 일이 아직 없어요
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-1/2">
                    <span className="text-neutral-900 font-semibold text-md">
                      Done
                    </span>
                    <div className="mt-2 ml-4 flex flex-col">
                      {goalTodos
                        .filter((todo) => todo.done)
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className="flex items-center gap-2 text-neutral-700 text-sm"
                          >
                            <input type="checkbox" checked={todo.done} />
                            {todo.title}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
