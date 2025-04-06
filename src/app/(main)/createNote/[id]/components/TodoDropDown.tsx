"use client";

import { useState } from "react";
import { UseFormRegister, Path } from "react-hook-form";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FieldValues } from "react-hook-form";
import { useGetTodosQuery } from "@/queries/useTodoQuery";

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
  const {
    data,
    isLoading,
    error: queryError,
  } = useGetTodosQuery({
    goalId,
  });

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
        className={`bg-slate-50 w-full px-5 py-3 rounded-xl text-left flex justify-between items-center gap-3
          ${error ? "border-2 border-red-500" : ""}`}
      >
        {value ? (
          data?.todos.find((todo) => todo.id === value)?.title
        ) : (
          <span className="text-slate-400">할일을 선택해주세요</span>
        )}
        <Image
          src="/images/arrow.svg"
          alt="arrow"
          width={20}
          height={20}
          className={`${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {register && (
        <input
          type="hidden"
          value={value || ""}
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
            className="absolute w-full mt-1 bg-slate-50 rounded-lg shadow-lg z-10"
          >
            {data?.todos.map((todo) => (
              <motion.li
                key={todo.id}
                whileHover={{ backgroundColor: "#f3f4f6" }}
                onClick={() => handleSelect(todo.id)}
                className="px-4 py-2 cursor-pointer text-slate-900 text-sm font-medium"
              >
                {todo.title}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
