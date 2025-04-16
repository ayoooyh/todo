"use client";

import Image from "next/image";
import { useUpdateGoalMutation } from "@/queries/useGoalQuery";
import { useForm } from "react-hook-form";
import { IPostAndUpdateGoals } from "@/types/goal";
import { useGetGoalQuery } from "@/queries/useGoalQuery";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function EditGoal({
  goalId,
  onClose,
}: {
  goalId: number;
  onClose: () => void;
}) {
  const { mutate: updateGoal } = useUpdateGoalMutation();
  const { data: goalData } = useGetGoalQuery({ goalId });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IPostAndUpdateGoals>({
    mode: "onChange",
    defaultValues: {
      title: goalData?.title || "",
    },
  });

  const onSubmit = (data: IPostAndUpdateGoals) => {
    updateGoal(
      { goalId, updateData: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
          queryClient.invalidateQueries({ queryKey: ["goals"] });
          onClose();
          router.refresh();
        },
      }
    );
  };

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <span className="text-base font-semibold text-slate-800">
              목표 이름
            </span>
            <input
              {...register("title", { required: "제목을 입력해주세요" })}
              type="text"
              className="w-full bg-slate-50 rounded-xl px-6 py-3 text-base font-normal text-slate-800"
            />
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 ${
                !isValid ? "bg-slate-400 cursor-not-allowed" : ""
              }`}
            >
              수정하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
