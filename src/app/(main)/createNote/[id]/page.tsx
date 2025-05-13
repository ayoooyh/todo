"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ICreateNote } from "@/types/note";
import NoteForm from "@/components/common/NoteForm";
import { useCreateNoteMutation } from "@/queries/useNoteQuery";
import { useGoalId, useTodoId } from "@/hooks/useId";
import { useGetGoalQuery } from "@/queries/useGoalQuery";
import { useGetTodosQuery } from "@/queries/useTodoQuery";

export default function CreateNotePage() {
  const goalId = useGoalId();
  const todoId = useTodoId();
  const router = useRouter();
  const { data, isLoading } = useGetGoalQuery({ goalId });
  const { data: todoData, isLoading: todoLoading } = useGetTodosQuery({
    goalId,
  });
  const { mutate: createNoteMutation } = useCreateNoteMutation();

  const handleSubmit = useCallback(
    async (noteData: ICreateNote) => {
      try {
        await new Promise((resolve) => {
          createNoteMutation(
            { noteData },
            {
              onSuccess: () => resolve(undefined),
            }
          );
        });

        // 노트 생성 후 임시저장 데이터 삭제
        const key = `note:${noteData.goal_id}:${noteData.todo_id}`;
        localStorage.removeItem(key);

        router.back();
        // router.push(`/notes/${noteData.goal_id}`);
      } catch (error) {
        console.error("노트 생성 실패:", error);
        alert("노트 생성에 실패했습니다.");
      }
    },
    [router, createNoteMutation]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading || todoLoading) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3 py-6 px-4 max-w-[792px] mx-auto h-screen sm:px-4 md:px-6 lg:px-20">
      <NoteForm
        goalId={goalId}
        goalTitle={data?.title ?? ""}
        todoId={todoId}
        todoTitle={
          todoData?.todos.find((todo) => todo.id === todoId)?.title ?? ""
        }
        mode={"create"}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
}
