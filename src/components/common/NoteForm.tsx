import React, { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ICreateNote } from "@/types/note";
import Image from "next/image";
import { ICreateNoteForm } from "@/types/form";
import TodoDropDown from "@/components/common/TodoDropDown";

interface NoteFormProps {
  goalId: number;
  goalTitle: string;
  todoId: number;
  todoTitle: string;
  mode: "create" | "edit";
  initialData?: {
    title?: string;
    content?: string;
    todoId?: number;
    linkUrl?: string;
  };
  onSubmit: (noteData: ICreateNote) => Promise<void>;
  onClose: () => void;
}

export default function NoteForm({
  goalId,
  goalTitle,
  todoTitle,
  mode = "create",
  initialData,
  onSubmit,
  onClose,
}: NoteFormProps) {
  const [showLinkInput, setShowLinkInput] = useState<boolean>(
    !!initialData?.linkUrl
  );
  const [selectedTodoId, setSelectedTodoId] = useState<number>(
    initialData?.todoId || 0
  );
  const [showTempNoteAlert, setShowTempNoteAlert] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    getValues,
    control,
  } = useForm<ICreateNoteForm>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: initialData,
  });

  const todoId = useWatch({
    control,
    name: "todoId",
  });

  useEffect(() => {
    if (!todoId || mode === "edit") return;
    const key = `note:${goalId}:${todoId}`;
    const savedData = localStorage.getItem(key);
    setShowTempNoteAlert(!!savedData);
  }, [todoId, goalId, mode]);

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
    if (mode === "edit") return; // 수정 모드에서는 임시저장 비활성화
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
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === "create" ? "노트 작성" : "노트 수정"}
          </h1>
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
          {mode === "create" && (
            <button
              className="text-sm text-blue-500 font-semibold flex items-center gap-1 py-2.5 px-4.5 rounded-xl cursor-pointer"
              onClick={handleTempSave}
            >
              임시저장
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid}
            className={`text-sm py-2.5 px-4.5 rounded-xl text-white font-semibold flex items-center gap-1 cursor-pointer ${
              isValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-slate-400 cursor-not-allowed"
            }`}
          >
            {mode === "create" ? "작성완료" : "수정완료"}
          </button>
        </div>

        {mode === "create" && showTempNoteAlert && (
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
              className="text-sm text-blue-500 font-semibold flex items-center gap-1 py-2.5 px-4.5 rounded-xl cursor-pointer"
              onClick={handleTempLoad}
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
            {mode === "create" ? (
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
            ) : (
              <span className="text-sm text-slate-600">{todoTitle}</span>
            )}
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

          {showLinkInput && (
            <div className="relative">
              <input
                type="text"
                placeholder="링크를 입력해주세요"
                className="w-full bg-slate-200 rounded-[20px] px-10 py-1 placeholder:text-sm text-slate-800 font-normal"
                {...register("linkUrl")}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLinkUrl}
              className="text-sm text-slate-600"
            >
              {showLinkInput ? "링크 숨기기" : "링크 추가"}
            </button>
          </div>

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
