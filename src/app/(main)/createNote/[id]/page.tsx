"use client";

import Image from "next/image";
import { useGoalId } from "@/hooks/useGoalId";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import TodoDropDown from "./components/TodoDropDown";
import { useForm } from "react-hook-form";
import { ICreateNoteForm } from "@/types/form";
import { useCreateNoteMutation } from "@/queries/useNoteQuery";
import { useCallback, useState } from "react";
import { ICreateNote } from "@/types/note";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";

export default function CreateNotePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ICreateNoteForm>({
    mode: "onChange",
    defaultValues: {
      goalId: useGoalId(),
      todoId: 0,
      title: "",
      content: "",
      linkUrl: "",
    },
  });

  const createNoteMutation = useCreateNoteMutation();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  // const [selectedLinkUrl, setSelectedLinkUrl] = useState<string>("");
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

  const { data, isLoading } = useGetGoalQuery({ goalId: useGoalId() });

  const onSubmit = useCallback(
    async (data: ICreateNoteForm) => {
      const noteData: ICreateNote = {
        title: data.title,
        content: data.content,
        goal_id: data.goalId,
        todo_id: data.todoId,
        link_url: data.linkUrl === "" ? null : data.linkUrl,
      };

      try {
        await createNoteMutation.mutateAsync({
          noteData,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [createNoteMutation]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    setIsConfirmOpen(false);
    router.back();
  };

  const handleLinkUrl = () => {
    setShowLinkInput(!showLinkInput);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-20 max-w-[792px] mx-auto h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center ">
            <h1 className="text-lg font-semibold text-slate-900">노트 작성</h1>

            <Image
              src="/images/exit.svg"
              alt="exit"
              width={16}
              height={16}
              onClick={() => setIsConfirmOpen(true)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <button className="text-sm text-blue-500 font-semibold flex items-center gap-1 py-2.5 px-4.5 rounded-xl">
              임시저장
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`text-sm py-2.5 px-4.5 rounded-xl text-white font-semibold flex items-center gap-1 cursor-pointer ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
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
            <span
              className="text-base font-medium text-slate-800"
              {...register("goalId", {
                required: "목표를 선택해주세요",
              })}
            >
              {data?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-[3px] py-0.5 bg-slate-100 rounded-[4px] text-xs font-medium text-slate-700">
              To do
            </span>

            <TodoDropDown
              onFilterChange={(todoId: number) => {
                setSelectedTodoId(todoId);
                setValue("todoId", todoId, {
                  shouldValidate: true,
                });
              }}
              value={selectedTodoId}
              register={register}
              name="todoId"
              error={errors.todoId?.message}
              goalId={data?.id ?? 0}
            />
          </div>

          <hr className="border-t border-slate-200" />

          <div>
            <input
              type="text"
              placeholder="노트의 제목을 입력해주세요"
              className="w-full border-none outline-none placeholder:text-slate-400 text-lg font-medium"
              {...register("title", {
                required: "제목을 입력해주세요",
              })}
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

            <button type="button" onClick={handleLinkUrl}>
              <Image
                src="/images/editor-icons/ic_link.svg"
                alt="link"
                width={22}
                height={22}
              />
            </button>
          </div>

          <hr className="border-t border-slate-200" />
          {showLinkInput && (
            <div className="relative">
              <input
                type="text"
                placeholder="링크를 입력해주세요"
                className=" w-full bg-slate-200 rounded-[20px] px-10 py-1 placeholder:text-sm text-slate-800 font-normal"
                {...register("linkUrl", {
                  required: "링크를 입력해주세요",
                })}
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 ">
                <Image
                  src="/images/linkUrl.svg"
                  alt="link"
                  width={22}
                  height={22}
                />
              </div>
            </div>
          )}

          <textarea
            placeholder="이 곳을 클릭해 노트 작성을 시작해주세요"
            className="w-full border-none outline-none placeholder:text-slate-400 text-base font-normal resize-none"
            {...register("content", {
              required: "내용을 입력해주세요",
            })}
          />
        </div>
      </form>
      {isConfirmOpen && (
        <ConfirmModal
          setIsCloseConfirmOpen={setIsConfirmOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
