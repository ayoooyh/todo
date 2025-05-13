"use client";

import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { CreateTodo } from "@/components/CreateTodo";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";
import TodoAttachmentIcons from "@/components/common/TodoAttachmentIcons";
import { ITodo } from "@/types/todo";

const TodoFilter = ({
  selectedFilter,
  onFilterChange,
}: {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "All"
            ? "text-white bg-blue-500 border-blue-500 "
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => onFilterChange("All")}
      >
        All
      </button>
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "To do"
            ? "text-white bg-blue-500 border-blue-500"
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => onFilterChange("To do")}
      >
        To do
      </button>
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "Done"
            ? "text-white bg-blue-500 border-blue-500"
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => onFilterChange("Done")}
      >
        Done
      </button>
    </div>
  );
};

export default function TodosPage() {
  const { mutate: updateTodo } = useUpdateTodoMutation();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [hasMoreTodos, setHasMoreTodos] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data, isLoading } = useGetTodosQuery({
    sortOrder: "newest",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const PAGE_SIZE = 40;
  const [page, setPage] = useState(1);
  const [visibleTodos, setVisibleTodos] = useState<ITodo[]>([]);

  const filteredTodos = useMemo(() => {
    return (
      data?.todos.filter((todo) => {
        if (selectedFilter === "All") return true;
        if (selectedFilter === "To do") return !todo.done;
        if (selectedFilter === "Done") return todo.done;
        return true;
      }) ?? []
    );
  }, [data?.todos, selectedFilter]);

  // page나 필터가 바뀔 때마다 보여줄 todo 갱신
  useEffect(() => {
    setVisibleTodos(filteredTodos.slice(0, page * PAGE_SIZE));
    setHasMoreTodos(filteredTodos.length > page * PAGE_SIZE);
  }, [filteredTodos, page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-7 max-w-[1200px] mx-auto lg:px-20">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span>모든 할 일</span>
          <span>({visibleTodos.length})</span>
        </h1>
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

      <div className="flex flex-col gap-4 bg-white border border-slate-100 rounded-xl p-6">
        <TodoFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        <div className="flex flex-col items-center gap-2">
          {visibleTodos?.map((todo) => (
            <div className="flex justify-between w-full" key={todo.id}>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-normal">
                <Image
                  src={
                    todo.done ? "/images/active.svg" : "/images/inactive.svg"
                  }
                  alt={todo.done ? "완료" : "미완료"}
                  width={20}
                  height={20}
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
                {todo.done ? (
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
                goalId={todo.goal_id}
              />
            </div>
          ))}
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
