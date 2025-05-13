"use client";

import { useGetGoalsQuery, usePostGoalMutation } from "@/queries/useGoalQuery";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reorder, AnimatePresence } from "framer-motion";

// optional prop과 타입 정의 추가
interface GoalProps {
  onGoalClick?: () => void;
}

export default function Goal({ onGoalClick }: GoalProps) {
  const { data, isLoading, error } = useGetGoalsQuery({
    cursor: undefined,
    size: 20,
    sortOrder: "newest",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [items, setItems] = useState<Array<{ id: string; title: string }>>([]);

  // useEffect를 추가하여 데이터가 로드되면 items 상태 업데이트
  useEffect(() => {
    if (data?.goals) {
      setItems(
        data.goals.map((goal) => ({
          id: goal.id.toString(),
          title: goal.title,
        }))
      );
    }
  }, [data?.goals]);

  //postGoal은 mutate 함수여서 mutateAsync를 사용해야 함
  const { mutateAsync: postGoal, isPending } = usePostGoalMutation();

  const handleAddGoal = async () => {
    try {
      const response = await postGoal({ title: newGoal });
      // 새 목표를 상단에 추가
      if (response?.id) {
        setItems((prevItems) => [
          { id: response.id.toString(), title: newGoal },
          ...prevItems,
        ]);
      }
      setIsAdding(false);
      setNewGoal("");
    } catch (error) {
      console.error("목표 추가 실패:", error);
      alert("목표를 추가하는데 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 입력 시 Enter 이벤트가 두 번 발생하는 것 방지
    // isComposing이 false일 때만 이벤트 처리
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const onClickCancel = () => {
    setIsAdding(false);
    setNewGoal("");
  };

  // TODO: 로딩 중 화면 렌더링 추가 필요
  if (isLoading || isPending) return <></>;
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        에러가 발생했습니다: {error.message}
      </div>
    );
  if (!data)
    return (
      <div className="flex justify-center items-center h-full">
        데이터가 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 px-6 h-full">
      <div className="flex justify-left items-center gap-2">
        <Image src="/images/flag.svg" alt="goal" width={24} height={24} />
        <span className="text-lg font-medium text-slate-800">목표</span>
      </div>

      <div className="flex flex-col w-full flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
        <div className="flex flex-col w-full">
          <AnimatePresence mode="popLayout">
            <Reorder.Group
              axis="y"
              values={items}
              onReorder={setItems}
              className="flex flex-col w-full"
              layoutScroll
              initial={false}
            >
              {items.map((goal) => (
                <Reorder.Item
                  key={goal.id}
                  value={goal}
                  className="cursor-move w-full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.4,
                  }}
                  whileDrag={{
                    scale: 1.01,
                    backgroundColor: "rgba(240, 240, 240, 0.5)",
                  }}
                >
                  <span
                    className={`p-2 text-slate-700 font-medium text-sm block ${
                      goal.id.startsWith("temp-")
                        ? "bg-blue-50 border-l-2 border-blue-400 pl-3"
                        : ""
                    }`}
                  >
                    <span className="pr-1 text-slate-700 font-medium text-sm">
                      ・
                    </span>
                    <Link href={`/goal/${goal.id}`} onClick={onGoalClick}>
                      {goal.title}
                    </Link>
                  </span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </AnimatePresence>
        </div>
        <div className="w-full mt-2">
          {isAdding ? (
            <div className="relative w-full">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-blue-500 rounded-xl h-[50px] text-xs p-3"
                placeholder="새로운 목표를 입력하세요"
                autoFocus
              />
              <button
                onClick={onClickCancel}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src="/images/exit.svg"
                  alt="exit"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-white border border-blue-500 py-3 rounded-xl w-full mb-4"
            >
              <div className="flex justify-center items-center gap-1">
                <Image
                  src="/images/plus-blue.svg"
                  alt="plus"
                  width={24}
                  height={24}
                />
                <span className="text-base font-medium text-blue-500">
                  새 목표
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
