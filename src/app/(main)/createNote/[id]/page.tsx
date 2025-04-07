"use client";

import Image from "next/image";
import { useGoalId } from "@/hooks/useGoalId";
import { useGetGoalQuery } from "@/queries/dashBoard/useGoalQuery";
import TodoDropDown from "./components/TodoDropDown";
import { useForm, useWatch } from "react-hook-form";
import { ICreateNoteForm } from "@/types/form";
import { useCreateNoteMutation } from "@/queries/useNoteQuery";
import { useCallback, useState, useEffect } from "react";
import { ICreateNote } from "@/types/note";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";

export default function CreateNotePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    getValues,
    control,
  } = useForm<ICreateNoteForm>({ mode: "onChange", shouldUnregister: true });

  const createNoteMutation = useCreateNoteMutation();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  // const [selectedLinkUrl, setSelectedLinkUrl] = useState<string>("");
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [showTempNoteAlert, setShowTempNoteAlert] = useState<boolean>(false);

  const { data, isLoading } = useGetGoalQuery({ goalId: useGoalId() });

  // todo ID 변경 감지
  const todoId = useWatch({
    control,
    name: "todoId",
  });

  useEffect(() => {
    if (!todoId) return;

    // localStorage에서 임시저장 데이터 확인
    const key = `note:${data?.id}:${todoId}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      setShowTempNoteAlert(true);
    } else {
      setShowTempNoteAlert(false);
    }
  }, [todoId, data?.id]);

  useEffect(() => {
    if (!todoId) return;

    // localStorage에서 임시저장 데이터 확인
    const key = `note:${data?.id}:${todoId}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 폼 데이터 설정
      setValue("title", parsedData.title);
      setValue("content", parsedData.content);
      // 필요한 다른 필드들도 설정
    }
  }, [todoId, data?.id, setValue]);

  const onSubmit = useCallback(
    async (formData: ICreateNoteForm) => {
      const noteData: ICreateNote = {
        title: formData.title,
        content: formData.content,
        goal_id: data!.id,
        todo_id: formData.todoId,
        link_url: formData.linkUrl === "" ? null : formData.linkUrl,
      };

      try {
        await createNoteMutation.mutateAsync({
          noteData,
        });
        router.push(`/notes/${data!.id}`);
      } catch (error) {
        console.error(error);
      }
    },
    [createNoteMutation, router, data]
  );

  const handleLinkUrl = useCallback(() => {
    setShowLinkInput(!showLinkInput);
  }, [showLinkInput]);

  // 임시저장 함수
  const handleTempSave = (e?: React.MouseEvent) => {
    e?.preventDefault(); // 이벤트가 있을 경우 기본 동작 방지

    const key = `note:${data?.id}:${todoId}`;
    const tempData = {
      title: getValues("title"),
      content: getValues("content"),
      linkUrl: getValues("linkUrl"),
      todoId: getValues("todoId"),
    };
    localStorage.setItem(key, JSON.stringify(tempData));
    // TODO : 임시저장 완료 알림 구현 필요
    alert("임시저장 완료");
  };

  const handleTempLoad = () => {
    const key = `note:${data?.id}:${todoId}`;
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    setIsConfirmOpen(false);
    router.back();
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

          {/* 임시저장 노트 불러오기 알림 */}
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
        </div>

        <div className="flex flex-col gap-4 my-6">
          <div className="flex items-center gap-1.5">
            <Image
              src="/images/black-flag.svg"
              alt="black-flag"
              width={24}
              height={24}
            />
            <span className="text-base font-medium text-slate-800">
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
