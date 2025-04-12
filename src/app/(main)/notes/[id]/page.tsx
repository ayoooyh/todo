"use client";

import Image from "next/image";
import { useGetNotesQuery } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useGoalId";
import { useState } from "react";
import DetailNote from "./components/DetailNote";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import Link from "next/link";
import EditAndDelete from "@/components/common/EditAndDelete";

export default function NotePage() {
  const goalId = useGoalId();

  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  const { data, isLoading } = useGetNotesQuery({
    goal_id: goalId,
    size: 20,
  });

  const { data: goalData, isLoading: isGoalLoading } = useGetGoalQuery({
    goalId: goalId,
  });

  if (isLoading || isGoalLoading) {
    return <></>;
  }

  const handleNoteClick = (noteId: number) => {
    setSelectedNoteId(noteId);
  };

  const handleKebabClick = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openNoteId === noteId) {
      setOpenNoteId(null);
      setSelectedNoteId(null);
    } else {
      setOpenNoteId(noteId);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">노트 모아보기</h1>
        <Link
          href={`/createNote/${goalId}`}
          className="text-sm text-blue-500 font-semibold flex items-center gap-1"
        >
          <Image
            src="/images/plus-blue.svg"
            alt="plus"
            width={16}
            height={16}
          />
          노트 추가
        </Link>
      </div>
      <div className="bg-white border border-slate-100 rounded-xl px-6 py-3.5 flex items-center gap-2">
        <Image src="/images/black-flag.svg" alt="note" width={24} height={24} />
        <span className="text-slate-800 font-semibold text-sm mt-0.5">
          {goalData?.title}
        </span>
      </div>

      {data?.notes.length && data?.notes.length > 0 ? (
        data?.notes.map((note) => (
          <div
            className="flex flex-col gap-4 bg-white border border-slate-100 rounded-xl px-6 py-3.5"
            key={note.id}
          >
            <div className="flex items-center justify-between">
              <Image
                src="/images/note-list.svg"
                alt="note"
                width={28}
                height={28}
              />
              <div
                className="cursor-pointer relative"
                onClick={(e) => handleKebabClick(note.id, e)}
              >
                <Image
                  src="/images/kebab.svg"
                  alt="kebab"
                  width={24}
                  height={24}
                />
                {openNoteId === note.id && (
                  <div className="absolute right-0 top-full mt-1">
                    <EditAndDelete
                      noteId={note.id}
                      todo={note.todo || undefined}
                    />
                  </div>
                )}
              </div>
            </div>
            {selectedNoteId === note.id && (
              <DetailNote
                onClose={() => setSelectedNoteId(null)}
                noteId={note.id}
                todoId={note.todo?.id}
              />
            )}
            <div
              className="flex flex-col gap-3 cursor-pointer"
              onClick={() => handleNoteClick(note.id)}
            >
              <span className="text-slate-800 font-semibold text-sm mt-0.5">
                {note.title}
              </span>

              <hr className="border-t border-slate-200" />

              <div className="flex items-center gap-2">
                <span className="px-[3px] py-0.5 bg-slate-100 rounded-[4px] text-xs font-medium text-slate-700">
                  To do
                </span>

                <span className="text-slate-700 font-normal text-xs">
                  {note.todo?.title}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
          <span className="text-slate-500 font-normal text-sm">
            아직 등록된 노트가 없어요
          </span>

          <Link
            href={`/createNote/${goalId}`}
            className="text-white font-normal text-sm bg-blue-500 rounded-xl px-4 py-2 cursor-pointer"
          >
            노트 등록하기
          </Link>
        </div>
      )}
    </div>
  );
}
