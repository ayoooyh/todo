"use client";

import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Image from "next/image";
import { useState } from "react";
import { MakeTodoModal } from "@/components/CreateTodo";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";
import TodoAttachmentIcons from "@/components/common/TodoAttachmentIcons";

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

  const filteredTodos = data?.todos.filter((todo) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "To do") return !todo.done;
    if (selectedFilter === "Done") return todo.done;
    return true;
  });

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
        {isModalOpen && <MakeTodoModal onClose={handleModalClose} />}
      </div>

      <div className="flex flex-col gap-4 bg-white border border-slate-100 rounded-xl p-6">
        <TodoFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        <div className="flex flex-col items-center gap-2">
          {filteredTodos?.map((todo) => (
            <div className="flex justify-between w-full" key={todo.id}>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-normal">
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
