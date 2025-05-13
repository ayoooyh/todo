import Image from "next/image";
import { useGetNoteQuery } from "@/queries/useNoteQuery";
import { format } from "date-fns";
import Link from "next/link";
import { useDeleteNoteMutation } from "@/queries/useNoteQuery";

export default function DetailNote({
  onClose,
  todoId,
  noteId,
}: {
  onClose: () => void;
  todoId: number;
  noteId: number;
}) {
  const { data, isLoading } = useGetNoteQuery({
    note_id: noteId,
  });
  const { mutate: deleteNoteMutation } = useDeleteNoteMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDeleteNote = () => {
    deleteNoteMutation({ note_id: noteId });
    onClose();
  };

  console.log(data);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 flex justify-end bg-black/80 z-50 ">
      <div className="flex w-full justify-end">
        <div
          className="
            bg-white p-6
            w-full h-full
            sm:rounded-lg sm:max-w-[520px] sm:h-screen
          "
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={onClose}
              >
                <Image
                  src="/images/exit.svg"
                  alt="exit"
                  width={24}
                  height={24}
                />
              </button>
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleDeleteNote}
                  className="text-gray-500 hover:text-gray-700 font-semibold text-sm"
                >
                  삭제하기
                </button>
                <Link
                  href={`/editNote/${noteId}`}
                  className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
                >
                  수정하기
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/black-flag.svg"
                    alt="note"
                    width={24}
                    height={24}
                  />
                  <span className="text-base font-medium text-slate-800">
                    {data?.goal.title}
                  </span>
                </div>
                {todoId === data?.todo_id && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-[3px] py-0.5 bg-slate-100 rounded-[4px] text-xs font-medium text-slate-700">
                        To do
                      </span>

                      <span className="text-slate-700 font-normal text-xs">
                        {data.todo.title}
                      </span>
                    </div>

                    <div className="text-xs font-normal text-slate-500 flex items-center gap-1">
                      {(() => {
                        return data?.todo.created_at
                          ? format(new Date(data.todo.created_at), "yyyy.MM.dd")
                          : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <hr className="border-t border-slate-200" />
                {todoId === data?.todo_id && (
                  <>
                    <span className="text-lg font-medium text-slate-800">
                      {data?.title}
                    </span>
                    <hr className="border-t border-slate-200" />

                    {data?.link_url && (
                      <div className="bg-slate-200 rounded-[20px] px-1.5 py-1 flex items-center gap-2 cursor-pointer">
                        <Image
                          src="/images/attachment.svg"
                          alt="attachment"
                          width={16}
                          height={16}
                        />

                        <span className="text-sm font-normal text-slate-700">
                          {data?.link_url && (
                            <a href={data.link_url} target="_blank">
                              {data.link_url}
                            </a>
                          )}
                        </span>
                      </div>
                    )}
                    <span className="text-base font-normal text-slate-700">
                      {data?.content}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
