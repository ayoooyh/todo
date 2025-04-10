"use client";

import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { ICreateNoteForm } from "@/types/form";
import TodoDropDown from "./TodoDropDown";
import { useCallback, useState, useEffect } from "react";
import { ICreateNote } from "@/types/note";

interface CreateNoteFormProps {
  goalId: number;
  goalTitle: string;
  onSubmit: (noteData: ICreateNote) => Promise<void>;
  onClose: () => void;
}

export default function CreateNoteForm({
  goalId,
  goalTitle,
  onSubmit,
  onClose,
}: CreateNoteFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    getValues,
    control,
  } = useForm<ICreateNoteForm>({ mode: "onChange", shouldUnregister: true });

  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [showTempNoteAlert, setShowTempNoteAlert] = useState<boolean>(false);

  const todoId = useWatch({
    control,
    name: "todoId",
  });

  useEffect(() => {
    if (!todoId) return;
    const key = `note:${goalId}:${todoId}`;
    const savedData = localStorage.getItem(key);
    setShowTempNoteAlert(!!savedData);
  }, [todoId, goalId]);

  useEffect(() => {
    if (!todoId) return;
    const key = `note:${goalId}:${todoId}`;
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setValue("title", parsedData.title);
      setValue("content", parsedData.content);
      setValue("linkUrl", parsedData.linkUrl);
    }
  }, [todoId, goalId, setValue]);

  const handleFormSubmit = useCallback(
    async (formData: ICreateNoteForm) => {
      const noteData: ICreateNote = {
        title: formData.title,
        content: formData.content,
        goal_id: goalId,
        todo_id: formData.todoId,
        link_url: formData.linkUrl === "" ? null : formData.linkUrl,
      };
      await onSubmit(noteData);
    },
    [goalId, onSubmit]
  );

  const handleLinkUrl = useCallback(() => {
    setShowLinkInput(!showLinkInput);
  }, [showLinkInput]);

  const handleTempSave = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const key = `note:${goalId}:${todoId}`;
    const tempData = {
      title: getValues("title"),
      content: getValues("content"),
      linkUrl: getValues("linkUrl"),
      todoId: getValues("todoId"),
    };
    localStorage.setItem(key, JSON.stringify(tempData));
    alert("임시저장 완료");
  };

  const handleTempLoad = () => {
    const key = `note:${goalId}:${todoId}`;
    const tempData = localStorage.getItem(key);
    if (tempData) {
      const parsedData = JSON.parse(tempData);
      setValue("title", parsedData.title);
      setValue("content", parsedData.content);
      setValue("linkUrl", parsedData.linkUrl);
      setValue("todoId", parsedData.todoId);
      setShowTempNoteAlert(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-900">노트 작성</h1>
          <Image
            src="/images/exit.svg"
            alt="exit"
            width={16}
            height={16}
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>

        <div className="flex justify-end items-center gap-2">
          <button
            className="text-sm text-blue-500 font-semibold flex items-center gap-1 py-2.5 px-4.5 rounded-xl cursor-pointer"
            onClick={handleTempSave}
          >
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

        {showTempNoteAlert && (
          <div className="bg-slate-50 rounded-[28px] flex items-center gap-2 py-2.5 px-4 justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/cancle-blue.svg"
                alt="cancle"
                width={24}
                height={24}
              />
              <span className="text-sm font-semibold text-blue-500">
                임시 저장된 노트가 있어요. 저장된 노트를 불러오시겠어요?
              </span>
            </div>
            <button
              type="button"
              onClick={handleTempLoad}
              className="bg-white border border-blue-500 px-4.5 py-2 rounded-3xl text-blue-500 text-sm font-semibold hover:bg-blue-500 hover:text-white"
            >
              불러오기
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 my-6">
          <div className="flex items-center gap-1.5">
            <Image
              src="/images/black-flag.svg"
              alt="black-flag"
              width={24}
              height={24}
            />
            <span className="text-base font-medium text-slate-800">
              {goalTitle}
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
              goalId={goalId}
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
            <div className="flex justify-between gap-4">
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
                className="w-full bg-slate-200 rounded-[20px] px-10 py-1 placeholder:text-sm text-slate-800 font-normal"
                {...register("linkUrl", {
                  required: "링크를 입력해주세요",
                })}
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
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
      </div>
    </form>
  );
}
