"use client";

import { useState } from "react";
import { EditTodoModal } from "@/components/EditTodo";
import { ITodo } from "@/types/todo";
import { DeleteTodo } from "@/components/DeleteTodo";
import { useDeleteTodoMutation } from "@/queries/useTodoQuery";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  todoId: number;
  todo: ITodo;
  noteId?: number;
  onEditClick?: () => void;
}

export default function EditAndDelete({
  todoId,
  todo,
  noteId,
}: // onEditClick,
Props) {
  const { mutate: deleteTodo } = useDeleteTodoMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const handleEditClick = () => {
    if (!noteId) {
      setIsOpen(true);
    } else {
      router.push(`/editNote/${noteId}`);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (todoId) {
      deleteTodo(todoId);
    }
    setIsDeleteOpen(false);
  };

  console.log("컴포넌트 렌더링:", { isOpen, noteId, todoId });

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
      {isOpen && !noteId ? (
        <EditTodoModal
          onClose={() => {
            setIsOpen(false);
          }}
          todoId={todoId}
          todo={todo}
        />
      ) : isOpen && noteId ? (
        <Link href={`/editNote/${noteId}`}>수정하기</Link>
      ) : null}

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
