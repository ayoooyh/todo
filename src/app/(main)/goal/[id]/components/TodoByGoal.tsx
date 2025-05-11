"use client";

import { Suspense, useMemo } from "react";
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/queries/useTodoQuery";
import Image from "next/image";
import { CreateTodo } from "@/components/CreateTodo";
import { useState } from "react";
import { useGoalId } from "@/hooks/useId";
import { ErrorBoundary } from "react-error-boundary";
import { ITodo } from "@/types/todo";
import TodoAttachmentIcons from "@/components/common/TodoAttachmentIcons";

const TodoContainer = ({ goalId }: { goalId: number }) => {
  const { data: todosData, isLoading } = useGetTodosQuery({
    goalId,
    done: undefined,
  });

  const todos = useMemo(() => todosData?.todos || [], [todosData]);

  const undoneTodos = useMemo(
    () => todos.filter((todo) => !todo.done),
    [todos]
  );
  const doneTodos = useMemo(() => todos.filter((todo) => todo.done), [todos]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-col gap-1 w-full md:w-1/2 bg-white rounded-xl p-4 h-auto md:h-[228px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-800 font-semibold text-sm">To do</span>
          <button
            className="flex items-center gap-1 cursor-pointer"
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
        <Todos todos={undoneTodos} />
      </div>

      <div className="flex flex-col gap-1 w-full md:w-1/2 bg-slate-200 rounded-xl p-4 h-auto md:h-[228px]">
        <span className="text-slate-800 font-semibold text-sm">Done</span>
        <DoneTodos todos={doneTodos} />
      </div>
    </div>
  );
};

const DoneTodos = ({ todos }: { todos: ITodo[] }) => {
  const { mutate: updateTodo } = useUpdateTodoMutation();

  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-[100px]">
        <span className="text-sm text-neutral-500">다 한 일이 아직 없어요</span>
      </div>
    );
  }

  return (
    <div className="py-2 px-4 flex flex-col gap-2 overflow-y-auto max-h-[180px]">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center gap-2 text-neutral-700 text-sm"
        >
          <input
            type="checkbox"
            checked={true} // 항상 체크 상태
            onChange={() =>
              updateTodo({
                todoId: todo.id,
                title: todo.title,
                done: false, // 체크박스 체크 시 할일 완료 처리
                fileUrl: todo.file_url,
                linkUrl: todo.link_url,
                goalId: todo.goal_id,
              })
            }
            className="cursor-pointer"
          />
          {todo.title}
        </div>
      ))}
    </div>
  );
};

const Todos = ({ todos }: { todos: ITodo[] }) => {
  const { mutate: updateTodo } = useUpdateTodoMutation();

  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-[100px]">
        <span className="text-sm text-neutral-500">
          해야할 일이 아직 없어요
        </span>
      </div>
    );
  }

  return (
    <div className="py-2 px-2 flex flex-col gap-2 overflow-y-auto max-h-[180px]">
      {todos.map((todo) => (
        <div key={todo.id} className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-neutral-700 text-sm">
            <input
              type="checkbox"
              checked={false} // 항상 체크 해제 상태
              onChange={() =>
                updateTodo({
                  todoId: todo.id,
                  title: todo.title,
                  done: true, // 체크박스 체크 시 할일 완료 처리
                  fileUrl: todo.file_url,
                  linkUrl: todo.link_url,
                  goalId: todo.goal_id,
                })
              }
              className="cursor-pointer"
            />
            {todo.title}
          </div>
          <TodoAttachmentIcons
            fileUrl={todo.file_url}
            linkUrl={todo.link_url}
            todoId={todo.id}
            todo={todo}
            noteId={todo.note_id}
          />
        </div>
      ))}
    </div>
  );
};

export default function TodoByGoal() {
  const goalId = useGoalId();

  return (
    <>
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중</div>}>
          <TodoContainer goalId={goalId as number} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
