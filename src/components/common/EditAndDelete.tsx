import { useState } from "react";
import { EditTodoModal } from "@/components/EditTodo";
import { ITodo } from "@/types/todo";

export default function EditAndDelete({
  todoId,
  todo,
}: {
  todoId: number;
  todo: ITodo;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEditClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="absolute z-10 top-8 right-1 flex flex-col gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2 w-21 shadow-md">
        <button
          className="cursor-pointer text-sm font-normal text-slate-700"
          onClick={handleEditClick}
        >
          수정하기
        </button>
        <button className="cursor-pointer text-sm font-normal text-slate-700">
          삭제하기
        </button>
      </div>
      {isOpen && (
        <EditTodoModal
          onClose={() => {
            setIsOpen(false);
          }}
          todoId={todoId}
          todo={todo}
        />
      )}
    </>
  );
}
