"use client";

import { useState, useRef, useEffect } from "react";
import { EditTodoModal } from "@/components/EditTodo";
import { ITodo } from "@/types/todo";
import { DeleteModal } from "@/components/DeleteModal";
import { useDeleteTodoMutation } from "@/queries/useTodoQuery";
import { useRouter } from "next/navigation";
import { useDeleteNoteMutation } from "@/queries/useNoteQuery";
import EditGoal from "@/components/EditGoal";
import { useDeleteGoalMutation } from "@/queries/useGoalQuery";

interface Props {
  todoId?: number;
  todo?: ITodo;
  noteId?: number;
  goalId?: number;
  onClose: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

export default function EditAndDelete({
  todoId,
  todo,
  noteId,
  goalId,
  onClose,
  isDropdownOpen,
  setIsDropdownOpen,
}: Props) {
  const { mutate: deleteTodo } = useDeleteTodoMutation({
    onSuccess: () => {
      setIsDeleteOpen(false);
      onClose();
    },
  });
  const { mutate: deleteNote } = useDeleteNoteMutation({
    onSuccess: () => {
      setIsDeleteOpen(false);
      onClose();
    },
  });
  const { mutate: deleteGoal } = useDeleteGoalMutation({
    onSuccess: () => {
      router.push("/");
      setIsDeleteOpen(false);
      onClose();
    },
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(true);
        setIsDeleteOpen(false);
      }
    }

    if ((isDropdownOpen || isDeleteOpen) && !isEditOpen && !isDeleteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isEditOpen, isDeleteOpen, setIsDropdownOpen]);

  const handleEditClick = () => {
    if (goalId || todoId) {
      setIsEditOpen(true);
    } else if (noteId) {
      router.push(`/editNote/${noteId}`);
      onClose();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteOpen(true);
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
    onClose();
  };

  return (
    <>
      {isDropdownOpen && (
        <div
          ref={menuRef}
          className="absolute z-10 top-8 right-1 flex flex-col gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2 w-21 shadow-md"
        >
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
      )}

      {isEditOpen && goalId && (
        <EditGoal
          goalId={goalId}
          onClose={() => {
            setIsEditOpen(false);
            onClose();
          }}
        />
      )}
      {isEditOpen && todoId && (
        <EditTodoModal
          onClose={() => {
            setIsEditOpen(false);
            onClose();
          }}
          todoId={todoId || 0}
          todo={todo || undefined}
        />
      )}

      {isDeleteOpen && (
        <DeleteModal
          setIsCloseConfirmOpen={setIsDeleteOpen}
          onClose={handleDeleteConfirm}
          todoOrGoalOrNote={noteId ? "노트" : todoId ? "할 일" : "목표"}
        />
      )}
    </>
  );
}
