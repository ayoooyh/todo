"use client";

import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import CreateTodo from "./CreateTodo";
import { useState } from "react";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";
import { useGoalId } from "@/hooks/useGoalId";

export default function TodoByGoalPage() {
  const goalId = useGoalId();

  const {
    data: todos,
    isLoading: todosLoading,
    error: todosError,
  } = useGetTodosQuery({ goalId: goalId ?? 0 });

  const { mutate: updateTodo } = useUpdateTodoMutation();

  const goalTodos = todos?.todos;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (todosLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  if (todosError)
    return (
      <div className="flex justify-center items-center h-screen">
        에러가 발생했습니다: {todosError?.message}
      </div>
    );
  if (!todos)
    return (
      <div className="flex justify-center items-center h-screen">
        데이터를 불러오는데 실패했습니다.
      </div>
    );

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        {goalTodos?.filter((todo) => !todo.done).length === 0 ? (
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2 bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-semibold text-sm">
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
              <span className="text-slate-800 font-semibold text-sm">Done</span>
              <div className="flex items-center justify-center flex-1 min-h-[100px]">
                <span className="text-sm text-neutral-500">
                  다 한 일이 아직 없어요
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-1/2 bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-semibold text-sm">
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

              <div className="mt-2 ml-4 flex flex-col gap-2">
                {goalTodos
                  ?.filter((todo) => !todo.done)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 text-neutral-700 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() =>
                          updateTodo({ todoId: todo.id, done: !todo.done })
                        }
                        className="cursor-pointer"
                      />

                      {todo.title}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-1/2 bg-slate-200 rounded-xl p-4">
              {goalTodos?.filter((todo) => todo.done).length === 0 ? (
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
                  <div className="mt-2 ml-4 flex flex-col gap-2">
                    {goalTodos
                      ?.filter((todo) => todo.done)
                      .map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-2 text-neutral-700 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() =>
                              updateTodo({
                                todoId: todo.id,
                                done: !todo.done,
                              })
                            }
                            className="cursor-pointer"
                          />
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
    </>
  );
}
