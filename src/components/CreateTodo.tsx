"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ICreateTodo } from "@/types/todo";
import GoalDropDown from "./GoalDropDown";
import { Input } from "@/components/common/Input";
import Image from "next/image";
import { useCreateTodoMutation } from "@/queries/useTodoQuery";
import { IMakeTodoForm } from "@/types/form";
import { ConfirmModal } from "./ConfirmModal";
import { createPortal } from "react-dom";

export function CreateTodo({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<IMakeTodoForm>({
    mode: "onChange",
  });

  const createTodoMutation = useCreateTodoMutation();
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState<"file" | "link">("file");
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const onSubmit = useCallback(
    async (data: IMakeTodoForm) => {
      const todoData: ICreateTodo = {
        title: data.title,
        goalId: data.goalId ? Number(data.goalId) : null,
        fileUrl: null,
        linkUrl: null,
      };

      if (attachmentType === "link") {
        todoData.linkUrl = data.linkUrl;
      }

      try {
        await createTodoMutation.mutateAsync({
          todoData,
          file: attachmentType === "file" ? data.fileUrl?.[0] : undefined,
        });
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [attachmentType, onClose, createTodoMutation]
  );

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white px-6 pb-6 rounded-lg max-w-[520px] w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pt-6 mb-6 sticky top-0 bg-white">
          <span className="text-lg font-bold">할 일 생성</span>
          <button
            onClick={() => {
              setIsCloseConfirmOpen(true);
            }}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <Image src="/images/exit.svg" alt="exit" width={24} height={24} />
          </button>
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
          <span>자료</span>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttachmentType("file")}
                className={`text-sm px-4 py-2 rounded-lg ${
                  attachmentType === "file"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                파일 업로드
              </button>
              <button
                type="button"
                onClick={() => setAttachmentType("link")}
                className={`text-sm px-4 py-2 rounded-lg ${
                  attachmentType === "link"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                링크 첨부
              </button>
            </div>

            {attachmentType === "file" && (
              <Input
                label=""
                type="file"
                name="fileUrl"
                placeholder=""
                register={register}
                registerOptions={{
                  fileUrl: {
                    required: {
                      value: true,
                      message: "파일을 첨부해주세요",
                    },
                  },
                }}
                className="text-sm text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0  file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
              />
            )}
            {attachmentType === "link" && (
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
            value={selectedGoalId}
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

  return mounted ? createPortal(modalContent, document.body) : null;
}
