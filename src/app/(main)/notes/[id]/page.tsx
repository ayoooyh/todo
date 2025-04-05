"use client";

import Image from "next/image";
import { useGetNotesQuery } from "@/queries/useNoteQuery";
import { useGoalId } from "@/hooks/useGoalId";
import { useState } from "react";
import DetailNote from "./components/DetailNote";

export default function NotePage() {
  const goalId = useGoalId();

  const [isDetailNoteOpen, setIsDetailNoteOpen] = useState(false);
  const { data, isLoading } = useGetNotesQuery({
    goal_id: goalId,
    size: 20,
  });

  if (isLoading) {
    return <></>;
  }

  const handleNoteClick = () => {
    setIsDetailNoteOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <h1 className="text-lg font-semibold text-slate-900">노트 모아보기</h1>

      <div className="bg-white border border-slate-100 rounded-xl px-6 py-3.5 flex items-center gap-2">
        <Image src="/images/black-flag.svg" alt="note" width={24} height={24} />
        <span className="text-slate-800 font-semibold text-sm mt-0.5">
          {data?.notes.map((note) => note.goal.title)}
        </span>
      </div>

      {data?.notes.length && data?.notes.length > 0 ? (
        data?.notes.map((note) => (
          <div
            className="flex flex-col gap-4 bg-white border border-slate-100 rounded-xl px-6 py-3.5"
            key={note.goal_id}
          >
            <div className="flex items-center justify-between">
              <Image
                src="/images/note-list.svg"
                alt="note"
                width={28}
                height={28}
              />
              {/* TODO : 수정, 삭제하기 드롭다운 및 기능 구현 */}
              <Image
                src="/images/kebab.svg"
                alt="kebab"
                width={24}
                height={24}
              />
            </div>
            {isDetailNoteOpen && (
              <DetailNote
                onClose={() => setIsDetailNoteOpen(false)}
                noteId={note.id}
              />
            )}
            <div
              className="flex flex-col gap-3 cursor-pointer"
              onClick={handleNoteClick}
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
                  {data?.notes.map((note) => note.todo.title)}
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
          {/* TODO : 노트 등록하기 버튼 기능 구현 */}
          <button className="text-white font-normal text-sm bg-blue-500 rounded-xl px-4 py-2">
            노트 등록하기
          </button>
        </div>
      )}
    </div>
  );
}
