"use client";

import Image from "next/image";
import EditAndDelete from "./EditAndDelete";
import { useState } from "react";
import { ITodo } from "@/types/todo";
import DetailNote from "@/app/(main)/notes/[id]/components/DetailNote";
import { useRouter } from "next/navigation";
import useDropdownToggle from "@/hooks/useDropdownToggle";

interface TodoAttachmentIconsProps {
  fileUrl?: string | null;
  linkUrl?: string | null;
  todoId: number;
  todo: ITodo;
  noteId?: number;
  goalId?: number;
}

const TodoAttachmentIcons = ({
  fileUrl,
  linkUrl,
  todoId,
  todo,
  noteId,
  goalId,
}: TodoAttachmentIconsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef } = useDropdownToggle<HTMLDivElement>({
    isOpen,
    onClose: () => setIsOpen(false),
  });

  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const router = useRouter();

  const handleNoteClick = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    } else {
      setSelectedNoteId(noteId);
    }
  };

  const handleCreateNoteClick = (
    goalId: number,
    todoId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    router.push(`/createNote/${goalId}?todoId=${todoId}`);
  };

  return (
    <div ref={containerRef} className="flex gap-2 relative">
      {noteId && (
        <>
          <Image
            src="/images/note-view.svg"
            alt="note"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={(e) => handleNoteClick(noteId, e)}
          />
          {selectedNoteId === noteId && (
            <DetailNote
              onClose={() => setSelectedNoteId(null)}
              noteId={noteId}
              todoId={todoId}
            />
          )}
        </>
      )}
      {fileUrl && (
        <Image src="/images/file.svg" alt="file" width={24} height={24} />
      )}
      {linkUrl && (
        <Image src="/images/link.svg" alt="link" width={24} height={24} />
      )}
      {!noteId && goalId && (
        <button
          className="cursor-pointer"
          onClick={(e) => handleCreateNoteClick(goalId, todoId, e)}
        >
          <Image src="/images/note.svg" alt="note" width={21} height={21} />
        </button>
      )}

      <button
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image src="/images/kebab.svg" alt="kebab" width={24} height={24} />
      </button>
      {isOpen && (
        <EditAndDelete
          todoId={todoId}
          todo={todo}
          noteId={noteId}
          goalId={goalId}
          onClose={() => setIsOpen(false)}
          isDropdownOpen={isOpen}
          setIsDropdownOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default TodoAttachmentIcons;
