"use client";

import Image from "next/image";
import EditAndDelete from "./EditAndDelete";
import { useState, useRef, useEffect } from "react";
import { ITodo } from "@/types/todo";
import DetailNote from "@/app/(main)/notes/[id]/components/DetailNote";
import { useRouter } from "next/navigation";

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

  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

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
    <div ref={menuRef} className="flex gap-2 relative">
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

      <button className="cursor-pointer" onClick={handleDropdownToggle}>
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
