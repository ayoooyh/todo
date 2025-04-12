"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ICreateNote } from "@/types/note";
import NoteForm from "@/components/common/NoteForm";
import { useCreateNoteMutation } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useGoalId";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";

export default function CreateNotePage() {
  const goalId = useGoalId();
  const router = useRouter();
  const { data, isLoading } = useGetGoalQuery({ goalId: useGoalId() });
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

        router.push(`/goal/${goalId}`);
      } catch (error) {
        console.error("노트 생성 실패:", error);
        alert("노트 생성에 실패했습니다.");
      }
    },
    [goalId, router, createNoteMutation]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <NoteForm
        goalId={goalId}
        goalTitle={data?.title ?? ""}
        todoId={0}
        todoTitle=""
        mode="create"
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </div>
  );
}
