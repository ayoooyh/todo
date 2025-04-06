import Image from "next/image";

export default function CreateNotePage() {
  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center ">
          <h1 className="text-lg font-semibold text-slate-900">노트 작성</h1>

          <Image src="/images/exit.svg" alt="exit" width={16} height={16} />
        </div>
        <div className="flex justify-end items-center gap-2">
          <button className="text-sm text-blue-500 font-semibold flex items-center gap-1">
            임시저장
          </button>
          <button className="text-sm text-blue-500 font-semibold flex items-center gap-1">
            작성완료
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Image
            src="/images/black-flag.svg"
            alt="black-flag"
            width={24}
            height={24}
          />
          <span>goal.title</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-[3px] py-0.5 bg-slate-100 rounded-[4px] text-xs font-medium text-slate-700">
            To do
          </span>

          <div>todo 드롭다운</div>
        </div>

        <hr className="border-t border-slate-200" />

        <div>
          <input
            type="text"
            placeholder="노트의 제목을 입력해주세요"
            className="w-full border-none outline-none placeholder:text-slate-400 text-lg font-medium"
          />
        </div>

        <hr className="border-t border-slate-200" />

        <div className="flex justify-between">
          <div className="flex justify-between gap-4 ">
            <div className="flex items-center gap-1">
              <Image
                src="/images/editor-icons/ic_bold.svg"
                alt="bold"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_italic.svg"
                alt="italic"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_underline.svg"
                alt="underline"
                width={22}
                height={22}
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/editor-icons/ic_Alignment_left.svg"
                alt="Alignment_left"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_Alignment_center.svg"
                alt="Alignment_center"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_Alignment_right.svg"
                alt="Alignment_right"
                width={22}
                height={22}
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/editor-icons/ic_bullet.svg"
                alt="bullet"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_numbering.svg"
                alt="numbering"
                width={22}
                height={22}
              />
              <Image
                src="/images/editor-icons/ic_coloring.svg"
                alt="coloring"
                width={22}
                height={22}
              />
            </div>
          </div>
          <Image
            src="/images/editor-icons/ic_link.svg"
            alt="link"
            width={22}
            height={22}
          />
        </div>

        <hr className="border-t border-slate-200" />

        <textarea
          placeholder="이 곳을 클릭해 노트 작성을 시작해주세요"
          className="w-full border-none outline-none placeholder:text-slate-400 text-base font-normal resize-none"
        />
      </div>
    </div>
  );
}
