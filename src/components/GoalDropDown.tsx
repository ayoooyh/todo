"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGetGoalsQuery } from "@/queries/dashBoard/useGoalQuery";

interface DropDownProps {
  onFilterChange: (goalId: number | null) => void;
  value: number | null;
}

export default function GoalDropDown({ onFilterChange, value }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetGoalsQuery();

  const handleSelect = (goalId: number | null) => {
    onFilterChange(goalId);
    setIsOpen(false);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50  w-full px-6 py-3 rounded-xl text-left flex justify-between items-center"
      >
        {value ? (
          data?.goals.find((goal) => goal.id === value)?.title
        ) : (
          <span className="text-slate-400">목표를 선택해주세요</span>
        )}
        <Image
          src="/images/arrow.svg"
          alt="arrow"
          width={20}
          height={20}
          className={`${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-white  rounded-lg shadow-lg"
          >
            <motion.li
              whileHover={{ backgroundColor: "#f3f4f6" }}
              onClick={() => handleSelect(null)}
              className="px-4 py-2 cursor-pointer"
            ></motion.li>
            {data?.goals.map((goal) => (
              <motion.li
                key={goal.id}
                whileHover={{ backgroundColor: "#f3f4f6" }}
                onClick={() => handleSelect(goal.id)}
                className="px-4 py-2 cursor-pointer"
              >
                {goal.title}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
