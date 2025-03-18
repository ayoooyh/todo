"use client";

import Image from "next/image";
import { useUserQuery } from "@/queries/dashBoard/useUserQuery";

export default function User() {
  const { data, isLoading, error } = useUserQuery();

  // TODO: 로딩 중 화면 렌더링 추가 필요
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">로딩 중...</div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        에러가 발생했습니다: {error.message}
      </div>
    );
  if (!data)
    return (
      <div className="flex justify-center items-center h-full">
        사용자 정보가 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col justify-center gap-4 px-6">
      <div className="flex justify-between items-center gap-3">
        <Image
          src="/images/userDefaultImage.svg"
          alt="user"
          width={64}
          height={64}
        />
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800">
              {data.name}
            </span>
            <span className="font-medium text-sm text-slate-600">
              {data.email}
            </span>
          </div>
          {/* TODO: 로그아웃 기능 추가 */}
          <div className="text-xs font-normal text-slate-400">로그아웃</div>
        </div>
      </div>
      {/* TODO: 할일생성 구현 시 버튼 클릭 시 모달 추가 */}
      <button className="flex justify-center items-center gap-1 bg-blue-500 py-3 rounded-xl">
        <Image src="/images/plus.svg" alt="plus" width={24} height={24} />
        <span className="font-medium text-base text-white text-center tracking-[0%]">
          새 할 일
        </span>
      </button>
    </div>
  );
}
