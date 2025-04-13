"use client";

import Image from "next/image";

export default function EditGoal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-10">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">목표 수정</span>
            <button onClick={onClose} className="cursor-pointer">
              <Image src="/images/exit.svg" alt="exit" width={24} height={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-800">
              목표 이름
            </span>
            <input
              type="text"
              className="w-full bg-slate-50 rounded-xl px-6 py-3 text-base font-normal text-slate-800"
            />
          </div>
          <button className="w-full bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600">
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
