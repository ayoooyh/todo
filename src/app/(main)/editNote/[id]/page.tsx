"use client";

import NoteForm from "@/components/common/NoteForm";
import { useGetNoteQuery } from "@/queries/useNoteQuery";
import { useRouter } from "next/navigation";
import { IUpdateNote } from "@/types/note";
import { useUpdateNoteMutation } from "@/queries/useNoteQuery";
import { useNoteId } from "@/hooks/useId";

export default function EditNotePage() {
  const router = useRouter();
  const noteId = useNoteId();
  const { data: note, isLoading } = useGetNoteQuery({
    note_id: noteId,
  });
  const updateNoteMutation = useUpdateNoteMutation();

  const handleSubmit = async (noteData: IUpdateNote) => {
    try {
      await updateNoteMutation.mutateAsync({
        note_id: noteId,
        noteData,
      });
      router.push(`/notes/${note?.goal_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (!note) {
    return <div>노트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-3 py-6 px-4 max-w-[792px] mx-auto h-screen sm:px-4 md:px-6 lg:px-20">
      <NoteForm
        goalId={note.goal_id}
        goalTitle={note.goal?.title}
        todoId={note.todo_id}
        todoTitle={note.todo?.title}
        mode="edit"
        initialData={{
          title: note.title,
          content: note.content,
          linkUrl: note.link_url || "",
          todoId: note.todo_id,
        }}
        onSubmit={handleSubmit}
        onClose={() => router.push(`/notes/${note.goal_id}`)}
      />
    </div>
  );
}
