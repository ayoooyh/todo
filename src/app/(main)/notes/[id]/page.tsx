"use client";

import Image from "next/image";
import { useGetNotesQuery } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useId";
import { useState } from "react";
import DetailNote from "./components/DetailNote";
import { useGetGoalQuery } from "@/queries/useGoalQuery";
import Link from "next/link";
import EditAndDelete from "@/components/common/EditAndDelete";
import useDropdownToggle from "@/hooks/useDropdownToggle";

export default function NotePage() {
  const goalId = useGoalId();

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDetailNoteId, setOpenDetailNoteId] = useState<number | null>(null);

  const { data, isLoading } = useGetNotesQuery({
    goal_id: goalId,
    size: 20,
  });

  const { data: goalData, isLoading: isGoalLoading } = useGetGoalQuery({
    goalId: goalId,
  });

  const { containerRef } = useDropdownToggle<HTMLDivElement>({
    isOpen: openDropdownId !== null,
    onClose: () => setOpenDropdownId(null),
  });

  if (isLoading || isGoalLoading) {
    return <></>;
  }

  const handleNoteClick = (noteId: number) => {
    setOpenDetailNoteId(noteId);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-2 max-w-[792px] mx-auto sm:px-4 md:px-6 lg:px-20 ">
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
        data?.notes.map((note) => {
          const isDropdownOpen = openDropdownId === note.id;
          const isDetailOpen = openDetailNoteId === note.id;
          return (
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
                  ref={isDropdownOpen ? containerRef : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(isDropdownOpen ? null : note.id);
                  }}
                >
                  <Image
                    src="/images/kebab.svg"
                    alt="kebab"
                    width={24}
                    height={24}
                  />
                  {isDropdownOpen && (
                    <div className="absolute top-0 right-0">
                      <EditAndDelete
                        noteId={note.id}
                        todo={note.todo || undefined}
                        onClose={() => setOpenDropdownId(null)}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={(open) =>
                          setOpenDropdownId(open ? note.id : null)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
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
              {isDetailOpen && (
                <DetailNote
                  onClose={() => setOpenDetailNoteId(null)}
                  noteId={note.id}
                  todoId={note.todo?.id}
                />
              )}
            </div>
          );
        })
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
