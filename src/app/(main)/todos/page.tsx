"use client";

import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import { useState } from "react";
import CreateTodo from "@/components/CreateTodo";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";

const TodoFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex items-center gap-2.5">
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "All"
            ? "text-white bg-blue-500 border-blue-500 "
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => handleFilterClick("All")}
      >
        All
      </button>
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "To do"
            ? "text-white bg-blue-500 border-blue-500"
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => handleFilterClick("To do")}
      >
        To do
      </button>
      <button
        className={`text-sm font-medium border rounded-full px-3 py-1 ${
          selectedFilter === "Done"
            ? "text-white bg-blue-500 border-blue-500"
            : "text-slate-800 bg-white border-slate-200"
        }`}
        onClick={() => handleFilterClick("Done")}
      >
        Done
      </button>
    </div>
  );
};

export default function TodosPage() {
  const { mutate: updateTodo } = useUpdateTodoMutation();

  const { data, isLoading } = useGetTodosQuery({
    size: 40,
    sortOrder: "newest",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span>모든 할 일</span>
          <span>({data?.todos.length})</span>
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
      <div className="flex flex-col gap-2.5 bg-white border border-slate-100 rounded-xl p-6">
        <TodoFilter />
        {data?.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 text-slate-800 text-sm font-normal"
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
                  goalId: todo.goal_id,
                })
              }
              className="cursor-pointer"
            />
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}
