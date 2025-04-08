"use client";

import { useState } from "react";
import { UseFormRegister, Path } from "react-hook-form";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FieldValues } from "react-hook-form";
import {
  // useGetTodosQuery,
  useInfiniteTodosQuery,
} from "@/queries/useTodoQuery";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
// import { useGetNoteQuery } from "@/queries/useNoteQuery";

// TODO: 해당 todo에 이미 생성한 note가 있을 시 생성 못하도록 처리
export default function TodoDropDown<T extends FieldValues>({
  onFilterChange,
  value,
  register,
  name,
  error,
  goalId,
}: {
  onFilterChange: (todoId: number) => void;
  value: number;
  register: UseFormRegister<T>;
  name: string;
  error?: string;
  goalId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // const {
  //   data,
  //   isLoading,
  //   error: queryError,
  // } = useGetTodosQuery({
  //   goalId,
  //   size: 1000,
  // });

  const {
    data,
    isLoading,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTodosQuery({
    goalId,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelect = (todoId: number) => {
    onFilterChange(todoId);
    setIsOpen(false);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (queryError) return <div>에러가 발생했습니다: {queryError.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-slate-50 w-full px-3 py-0.5 rounded-[4px] text-left flex justify-between items-center gap-3 text-sm font-medium text-slate-900
          ${error ? "border-2 border-red-500" : ""}`}
      >
        {value ? (
          data?.pages
            .find((page) => page.todos.find((todo) => todo.id === value))
            ?.todos.find((todo) => todo.id === value)?.title
        ) : (
          <span className="text-slate-400 text-sm font-medium">
            할일을 선택해주세요
          </span>
        )}
        <Image
          src="/images/arrow.svg"
          alt="arrow"
          width={16}
          height={16}
          className={`${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {register && (
        <input
          type="hidden"
          value={value}
          {...register(name as Path<T>, {
            required: "할일을 선택해주세요",
          })}
        />
      )}

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-slate-50 rounded-[4px] shadow-lg z-10 max-h-[200px] overflow-y-auto"
          >
            {data?.pages.map((page) =>
              page.todos.map((todo) => (
                <motion.li
                  key={todo.id}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  onClick={() => handleSelect(todo.id)}
                  className="px-2 py-2 cursor-pointer text-slate-900 text-sm font-medium"
                >
                  {todo.title}
                </motion.li>
              ))
            )}
            {hasNextPage && (
              <li ref={ref} className="text-center py-2 text-slate-400 text-sm">
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
