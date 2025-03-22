"use client";

import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import CreateTodo from "../../../components/CreateTodo";
import { useState } from "react";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";
import { useGoalId } from "@/hooks/useGoalId";
import LoadingAndError from "@/components/common/LoadingAndError";

export default function TodoByGoal() {
  const goalId = useGoalId();

  const {
    data: todos,
    isLoading: todosLoading,
    error: todosError,
  } = useGetTodosQuery({ goalId });

  const { mutate: updateTodo } = useUpdateTodoMutation();

  const goalTodos = todos?.todos;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <LoadingAndError loading={todosLoading} error={todosError} data={todos}>
      {() => (
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 w-1/2 bg-white rounded-xl p-4 h-[228px]">
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
            {goalTodos?.filter((todo) => !todo.done).length === 0 ? (
              <div className="flex items-center justify-center flex-1 min-h-[100px]">
                <span className="text-sm text-neutral-500">
                  해야할 일이 아직 없어요
                </span>
              </div>
            ) : (
              <div className="py-2 px-4 flex flex-col gap-2">
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
                          updateTodo({
                            todoId: todo.id,
                            title: todo.title,
                            done: !todo.done,
                            fileUrl: todo.file_url,
                            linkUrl: todo.link_url,
                            goalId: goalId as number,
                          })
                        }
                        className="cursor-pointer"
                      />
                      {todo.title}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-1/2 bg-slate-200 rounded-xl p-4 h-[228px]">
            <span className="text-slate-800 font-semibold text-sm">Done</span>
            {goalTodos?.filter((todo) => todo.done).length === 0 ? (
              <div className="flex items-center justify-center flex-1 min-h-[100px]">
                <span className="text-sm text-neutral-500">
                  다 한 일이 아직 없어요
                </span>
              </div>
            ) : (
              <div className="py-2 px-4 flex flex-col gap-2">
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
                            title: todo.title,
                            done: !todo.done,
                            fileUrl: todo.file_url,
                            linkUrl: todo.link_url,
                            goalId: goalId as number,
                          })
                        }
                        className="cursor-pointer"
                      />
                      {todo.title}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </LoadingAndError>
  );
}
