import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { postTodo } from "@/apis/dashBoard/todos";
import { ICreateTodo } from "@/types/todo";
import GoalDropDown from "./GoalDropDown";
import { uploadFile } from "@/apis/dashBoard/todos";
import { Input } from "@/components/common/Input";
import Image from "next/image";

interface IMakeTodoForm {
  title: string;
  fileUrl: FileList | null;
  linkUrl: string | null;
  goalId: number | null;
}

const ConformModal = ({
  setIsCloseConfirmOpen,
  onClose,
}: {
  setIsCloseConfirmOpen: (isCloseConfirmOpen: boolean) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80">
    <div className="bg-white p-6 rounded-lg w-[300px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <button
            onClick={() => setIsCloseConfirmOpen(false)}
            className=" text-gray-500 hover:text-gray-700 "
          >
            <Image src="/images/exit.svg" alt="exit" width={24} height={24} />
          </button>
        </div>

        <span className="mb-4 font-medium text-base text-center">
          정말 나가시겠어요? <br /> 작성된 내용이 모두 삭제됩니다.
        </span>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsCloseConfirmOpen(false)}
            className="py-3 bg-white border border-blue-500 rounded-xl hover:bg-blue-50 w-1/2"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 w-1/2"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function MakeTodoModal({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<IMakeTodoForm>({
    mode: "onChange",
  });

  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState<"file" | "link" | null>(
    null
  );
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  const onSubmit = useCallback(
    async (data: IMakeTodoForm) => {
      // TODO: Form 처리 올바르게 해서 리팩토링하기
      const todoData: ICreateTodo = {
        title: data.title,
        goalId: data.goalId ? Number(data.goalId) : null,
        fileUrl: null,
        linkUrl: null,
      };

      if (attachmentType === "link") {
        todoData.linkUrl = data.linkUrl;
      } else {
        if (attachmentType !== "file" || !data.fileUrl?.length) {
          console.error("fileUrl is required");
          return;
        }

        const formData = new FormData();
        formData.append("file", data.fileUrl[0]);
        try {
          const uploadResponse = await uploadFile(formData);
          todoData.fileUrl = uploadResponse.url;
        } catch (error) {
          console.error(error);
          return;
        }
      }

      try {
        await postTodo(todoData);
        // TODO: 제거하고 캐시 초기화 하기
        window.location.reload();
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [attachmentType, onClose]
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center ">
      <div className="bg-white p-6 rounded-lg max-w-[520px] w-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">할 일 생성</span>
          <button
            onClick={() => {
              setIsCloseConfirmOpen(true);
            }}
            className="text-gray-500 hover:text-gray-700"
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
                required: "제목을 입력해주세요",
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
                registerOptions={{ fileUrl: {} }}
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
                registerOptions={{ linkUrl: {} }}
              />
            )}
          </div>
          <span>목표</span>
          <GoalDropDown
            onFilterChange={(goalId: number | null) => {
              setSelectedGoalId(goalId);
              setValue("goalId", goalId);
            }}
            value={selectedGoalId}
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
        <ConformModal
          setIsCloseConfirmOpen={setIsCloseConfirmOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
}
