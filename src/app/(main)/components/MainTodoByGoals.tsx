"use client";

import { useGetGoalsQuery } from "@/queries/dashBoard/useGoalQuery";
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/queries/useTodoQuery";
import TodoAttachmentIcons from "@/components/common/TodoAttachmentIcons";
import { ITodo } from "@/types/todo";
import Image from "next/image";
import { useState, useMemo } from "react";
import { CreateTodo } from "@/components/CreateTodo";
import { useGetProgressTodoQuery } from "@/queries/useTodoQuery";
import ProgressBar from "@/components/common/ProgressBar";

export default function MainTodoByGoals() {
  const { data: goalsData, isLoading: goalsLoading } = useGetGoalsQuery();

  if (goalsLoading) {
    return <div>목표 로딩 중...</div>;
  }

  if (!goalsData || goalsData.goals.length === 0) {
    return <div>목표가 없습니다. 목표를 추가해주세요.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {goalsData.goals.map((goal) => (
        <GoalContent key={goal.id} goalId={goal.id} />
      ))}
    </div>
  );
}

function GoalContent({ goalId }: { goalId: number }) {
  const { data: goalData, isLoading: goalLoading } = useGetGoalsQuery();
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: todosData, isLoading: todosLoading } = useGetTodosQuery({
    goalId,
    done: undefined,
  });

  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
  } = useGetProgressTodoQuery({ goalId });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const progressValue = useMemo(() => {
    if (!progressData) return 0;
    return progressData.progress;
  }, [progressData]);

  if (goalLoading || todosLoading || progressLoading) {
    return <div>데이터 로딩 중...</div>;
  }

  if (progressError) {
    return <div>에러</div>;
  }

  const selectedGoal = goalData?.goals.find((goal) => goal.id === goalId);
  const todos = todosData?.todos || [];
  const undoneTodos = todos.filter((todo) => !todo.done).slice(0, displayCount);
  const doneTodos = todos.filter((todo) => todo.done).slice(0, displayCount);
  const hasMoreTodos = todos.length > displayCount;

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    setDisplayCount((prev) => prev + 5);
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 justify-between bg-blue-50 rounded-4xl p-6">
      <div className="flex justify-between items-center gap-2">
        <span className="text-lg font-bold text-slate-800">
          {selectedGoal?.title}
        </span>
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
          <span className="text-sm text-blue-500 font-semibold">할일 추가</span>
        </button>
        {isModalOpen && <CreateTodo onClose={handleModalClose} />}
      </div>
      <ProgressBar progress={progressValue} />

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-800 font-semibold text-sm">To do</span>
          </div>
          <TodoList todos={undoneTodos} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-800 font-semibold text-sm">Done</span>
          </div>
          <TodoList todos={doneTodos} isDone={true} />
        </div>
      </div>
      <div className="flex justify-center items-center">
        {hasMoreTodos && (
          <button
            className="flex items-center gap-[2px] bg-white rounded-2xl px-9 py-1 justify-center"
            onClick={handleShowMore}
            disabled={isLoadingMore}
          >
            <span className="text-sm font-semibold text-slate-700">더보기</span>
            <Image
              src="/images/arrow_down.svg"
              alt="arrow_down"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
    </div>
  );
}

function TodoList({
  todos,
  isDone = false,
}: {
  todos: ITodo[];
  isDone?: boolean;
}) {
  const { mutate: updateTodo } = useUpdateTodoMutation();

  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-sm text-neutral-500">
          {isDone ? "다 한 일이 아직 없어요" : "해야할 일이 아직 없어요"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <div key={todo.id} className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-neutral-700 text-sm">
            <Image
              src={todo.done ? "/images/active.svg" : "/images/inactive.svg"}
              alt={todo.done ? "완료" : "미완료"}
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() =>
                updateTodo({
                  todoId: todo.id,
                  title: todo.title,
                  done: !todo.done,
                  fileUrl: todo.file_url,
                  linkUrl: todo.link_url,
                  goalId: todo.goal_id,
                })
              }
            />
            {isDone && todo.done ? (
              <span className="line-through">{todo.title}</span>
            ) : (
              <span>{todo.title}</span>
            )}
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
}
