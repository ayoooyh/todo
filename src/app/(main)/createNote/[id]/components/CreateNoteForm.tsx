"use client";

import { ICreateNote } from "@/types/note";
import NoteForm from "@/components/common/NoteForm";
import { useTodoId } from "@/hooks/useId";
interface CreateNoteFormProps {
  goalId: number;
  goalTitle: string;
  onSubmit: (noteData: ICreateNote) => Promise<void>;
  onClose: () => void;
}

export default function CreateNoteForm({
  goalId,
  goalTitle,
  onSubmit,
  onClose,
}: CreateNoteFormProps) {
  const todoId = useTodoId();
  return (
    <NoteForm
      goalId={goalId}
      goalTitle={goalTitle}
      todoTitle={""}
      mode="create"
      onSubmit={onSubmit}
      onClose={onClose}
      todoId={todoId}
    />
  );
}
