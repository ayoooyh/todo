"use client";

import { useState } from "react";
import { EditTodoModal } from "@/components/EditTodo";
import { ITodo } from "@/types/todo";
import { DeleteModal } from "@/components/DeleteModal";
import { useDeleteTodoMutation } from "@/queries/useTodoQuery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteNoteMutation } from "@/queries/useNoteQuery";
import EditGoal from "@/components/EditGoal";
import { useDeleteGoalMutation } from "@/queries/useGoalQuery";

interface Props {
  todoId?: number;
  todo?: ITodo;
  noteId?: number;
  goalId?: number;
  onEditClick?: () => void;
}

export default function EditAndDelete({ todoId, todo, noteId, goalId }: Props) {
  const { mutate: deleteTodo } = useDeleteTodoMutation();
  const { mutate: deleteNote } = useDeleteNoteMutation();
  const { mutate: deleteGoal } = useDeleteGoalMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const handleEditClick = () => {
    if (goalId) {
      setIsOpen(true);
    } else if (noteId) {
      router.push(`/editNote/${noteId}`);
    } else if (todoId) {
      setIsOpen(true);
    }
  };

  // 중첩 클릭 시 이벤트 충돌 방지를 위해 사용
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (todoId) {
      setIsDeleteOpen(true);
    } else if (noteId) {
      setIsDeleteOpen(true);
    } else if (goalId) {
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (todoId) {
      deleteTodo(todoId);
    } else if (noteId) {
      deleteNote({ note_id: noteId });
    } else if (goalId) {
      deleteGoal(goalId);
      router.push("/");
    }
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
      {isOpen && goalId ? (
        <EditGoal
          goalId={goalId}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      ) : isOpen && noteId ? (
        <Link href={`/editNote/${noteId}`}>수정하기</Link>
      ) : isOpen && todoId ? (
        <EditTodoModal
          onClose={() => {
            setIsOpen(false);
          }}
          todoId={todoId || 0}
          todo={todo || undefined}
        />
      ) : null}

      {isDeleteOpen && (
        <DeleteModal
          setIsCloseConfirmOpen={setIsDeleteOpen}
          onClose={handleDeleteConfirm}
          todoOrGoalOrNote={noteId ? "노트" : todoId ? "할 일" : "목표"}
          noteId={noteId}
          todoId={todoId}
          goalId={goalId}
        />
      )}
    </>
  );
}
