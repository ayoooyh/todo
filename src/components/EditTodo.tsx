"use client";

import { useState, useCallback } from "react";
import { ConfirmModal } from "./ConfirmModal";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/common/Input";
import GoalDropDown from "@/components/GoalDropDown";
import { IEditTodoForm } from "@/types/form";
import { useUpdateTodoMutation } from "@/queries/useTodoQuery";
import { IUpdateTodo } from "@/types/todo";
import { ITodo } from "@/types/todo";

export function EditTodoModal({
  onClose,
  todoId,
  todo,
}: {
  onClose: () => void;
  todoId: number;
  todo?: ITodo;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<IEditTodoForm>({
    mode: "onChange",
    defaultValues: {
      title: todo?.title || "",
      linkUrl: todo?.link_url || "",
      fileUrl: undefined,
      goalId: todo?.goal_id || null,
      done: todo?.done || false,
    },
  });

  const updateTodo = useUpdateTodoMutation();
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState<"file" | "link">(
    todo?.file_url ? "file" : todo?.link_url ? "link" : "file"
  );
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  const onSubmit = useCallback(
    async (data: IEditTodoForm) => {
      const updateTodoData: IUpdateTodo = {
        title: data.title,
        goalId: data.goalId ? Number(data.goalId) : null,
        fileUrl: attachmentType === "file" ? todo?.file_url || null : null,
        linkUrl: attachmentType === "link" ? data.linkUrl || null : null,
        done: data.done,
      };

      try {
        await updateTodo.mutateAsync({
          todoId,
          ...updateTodoData,
          file:
            attachmentType === "file" && data.fileUrl
              ? data.fileUrl[0]
              : undefined,
        });
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [attachmentType, onClose, updateTodo, todo, todoId]
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-[520px] w-full">
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">할 일 수정</span>
            <button
              onClick={() => {
                setIsCloseConfirmOpen(true);
              }}
              className="cursor-pointer"
            >
              <Image src="/images/exit.svg" alt="exit" width={24} height={24} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {todo?.done ? (
              <Image
                src="/images/active.svg"
                alt="check"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src="/images/inactive.svg"
                alt="check"
                width={24}
                height={24}
              />
            )}
            <span className="text-base font-semibold text-slate-600 mt-[1px]">
              Done
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="제목"
            type="text"
            name="title"
            placeholder="할 일의 제목을 적어주세요"
            register={register}
            errors={errors.title?.message}
            registerOptions={{
              title: {
                required: {
                  value: true,
                  message: "제목을 입력해주세요",
                },
                maxLength: {
                  value: 30,
                  message: "제목은 30자 이하로 입력해주세요",
                },
              },
            }}
          />
          <span className="text-base font-semibold text-slate-800">자료</span>
          <div className="flex flex-col">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttachmentType("file")}
                className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 ${
                  attachmentType === "file"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <Image
                  src={
                    attachmentType === "file"
                      ? "/images/active-white.svg"
                      : "/images/inactive.svg"
                  }
                  alt="upload"
                  width={24}
                  height={24}
                />
                파일 업로드
              </button>
              <button
                type="button"
                onClick={() => setAttachmentType("link")}
                className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 ${
                  attachmentType === "link"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <Image
                  src={
                    attachmentType === "link"
                      ? "/images/active-white.svg"
                      : "/images/inactive.svg"
                  }
                  alt="link"
                  width={24}
                  height={24}
                />
                링크 첨부
              </button>
            </div>

            {attachmentType === "file" && (
              <div className="relative">
                <Input
                  label=""
                  type="file"
                  name="fileUrl"
                  placeholder=""
                  register={register}
                  registerOptions={{
                    fileUrl: {
                      required: false,
                    },
                  }}
                  className={`${
                    todo?.file_url
                      ? "opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      : "w-full text-sm text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                  }`}
                />
                {todo?.file_url && (
                  <div className="flex mt-3 py-3 px-6 bg-slate-50 rounded-xl border-2 border-transparent focus-within:border-blue-500">
                    {todo.file_url.split("/").pop()}
                  </div>
                )}
              </div>
            )}
            {attachmentType === "link" && (
              <div className="relative">
                <Input
                  label=""
                  type="url"
                  name="linkUrl"
                  placeholder="관련 링크를 입력하세요"
                  register={register}
                  registerOptions={{
                    linkUrl: {
                      required: {
                        value: true,
                        message: "링크를 입력해주세요",
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
          <span>목표</span>
          <GoalDropDown
            onFilterChange={(goalId: number | null) => {
              setSelectedGoalId(goalId);
              setValue("goalId", goalId, {
                shouldValidate: true,
              });
            }}
            value={todo?.goal_id || selectedGoalId}
            register={register}
            name="goalId"
            error={errors.goalId?.message}
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 rounded-xl ${
                isValid
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-slate-400 text-white cursor-not-allowed"
              }`}
            >
              확인
            </button>
          </div>
        </form>
      </div>
      {isCloseConfirmOpen && (
        <ConfirmModal
          setIsCloseConfirmOpen={setIsCloseConfirmOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
}
