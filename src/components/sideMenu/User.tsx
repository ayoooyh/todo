"use client";

import Image from "next/image";
import { useUserQuery } from "@/queries/useUserQuery";
import { useState } from "react";
import { CreateTodo } from "@/components/CreateTodo";
import { useLogout } from "@/hooks/auth";

export default function User() {
  const { data, isLoading, error } = useUserQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useLogout();

  const handleModalOpen = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // 스켈레톤 로딩
  if (isLoading)
    return (
      <div className="flex flex-col justify-center gap-4 px-6">
        <div className="flex animate-pulse space-x-4 justify-between items-center gap-3">
          <div
            className="rounded-xl bg-gray-200"
            style={{ width: 64, height: 64 }}
          />
          <div className="flex flex-col gap-2 items-start w-full">
            <div className="flex flex-col gap-1 w-full">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-1">
          <div className="h-6 rounded bg-gray-200 w-full" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-red-500 text-sm font-normal">
          에러가 발생했습니다
        </span>
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-slate-400 text-sm font-normal">
          사용자 정보가 없습니다.
        </span>
      </div>
    );

  return (
    <div className="flex flex-col justify-center gap-4 px-6">
      <div className="flex justify-between items-center gap-3 ">
        <Image
          src="/images/userDefaultImage.svg"
          alt="user"
          width={64}
          height={64}
        />
        <div className="flex flex-col gap-2 items-start w-full">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800">
              {data.name}
            </span>
            <span className="font-medium text-sm text-slate-600">
              {data.email}
            </span>
          </div>
          <button
            className="text-xs font-normal text-slate-400 hover:text-slate-600 cursor-pointer "
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
      <button
        className="flex justify-center items-center gap-1 bg-blue-500 py-3 rounded-xl hover:bg-blue-600 cursor-pointer"
        onClick={handleModalOpen}
      >
        <Image src="/images/plus.svg" alt="plus" width={24} height={24} />
        <span className="font-medium text-base text-white text-center tracking-[0%]">
          새 할 일
        </span>
      </button>
      {isModalOpen && <CreateTodo onClose={handleModalClose} />}
    </div>
  );
}
