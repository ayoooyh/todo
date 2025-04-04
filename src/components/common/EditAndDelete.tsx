"use client";

import { useState } from "react";
import { EditTodoModal } from "@/components/EditTodo";
import { ITodo } from "@/types/todo";
import { DeleteTodo } from "@/components/DeleteTodo";
import { useDeleteTodoMutation } from "@/queries/useTodoQuery";

export default function EditAndDelete({
  todoId,
  todo,
}: {
  todoId: number;
  todo: ITodo;
}) {
  const { mutate: deleteTodo } = useDeleteTodoMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditClick = () => {
    setIsOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteTodo(todoId);
    setIsDeleteOpen(false);
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
        <button
          className="cursor-pointer text-sm font-normal text-slate-700"
          onClick={handleDeleteClick}
        >
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
      {isDeleteOpen && (
        <DeleteTodo
          setIsCloseConfirmOpen={setIsDeleteOpen}
          onClose={handleDeleteConfirm}
          todoOrGoal={"할 일"}
        />
      )}
    </>
  );
}
