"use client";

import Image from "next/image";

export function DeleteModal({
  setIsCloseConfirmOpen,
  onClose,
  todoOrGoalOrNote,
}: {
  setIsCloseConfirmOpen: (isCloseConfirmOpen: boolean) => void;
  onClose: () => void;
  todoOrGoalOrNote: string;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <div className="flex flex-col gap-5">
          <div className="flex justify-end">
            <button
              onClick={() => setIsCloseConfirmOpen(false)}
              className=" text-gray-500 hover:text-gray-700 "
            >
              <Image src="/images/exit.svg" alt="exit" width={24} height={24} />
            </button>
          </div>

          <span className="mb-4 font-medium text-base text-center text-slate-800">
            {todoOrGoalOrNote}을 삭제하시겠어요? <br /> 삭제된{" "}
            {todoOrGoalOrNote}은 복구할 수 없습니다.
          </span>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsCloseConfirmOpen(false)}
              className="py-3 bg-white border border-blue-500 rounded-xl hover:bg-blue-50 w-1/2"
            >
              <span className="text-base font-semibold text-blue-500">
                취소
              </span>
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 w-1/2"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
