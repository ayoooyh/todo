"use client";

import { useGoalId } from "@/hooks/useGoalId";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import { useCreateNoteMutation } from "@/queries/useNoteQuery";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ConfirmModal";
import CreateNoteForm from "./components/CreateNoteForm";
import { ICreateNote } from "@/types/note";

export default function CreateNotePage() {
  const createNoteMutation = useCreateNoteMutation();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { data, isLoading } = useGetGoalQuery({ goalId: useGoalId() });

  const handleSubmit = async (noteData: ICreateNote) => {
    try {
      await createNoteMutation.mutateAsync({ noteData });
      router.push(`/notes/${data!.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setIsConfirmOpen(false);
    router.back();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <CreateNoteForm
        goalId={data!.id}
        goalTitle={data!.title}
        onSubmit={handleSubmit}
        onClose={() => setIsConfirmOpen(true)}
      />

      {isConfirmOpen && (
        <ConfirmModal
          setIsCloseConfirmOpen={setIsConfirmOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
