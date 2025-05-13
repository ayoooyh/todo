import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Link from "next/link";
import Image from "next/image";

export default function RecentTodos() {
  const { data, isLoading } = useGetTodosQuery({
    size: 5,
    sortOrder: "newest",
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/todo-recently.svg"
            alt="todo-recently"
            width={40}
            height={40}
          />
          <span className="text-lg font-semibold text-slate-800">
            최근 등록한 할 일
          </span>
        </div>
        <div className="flex items-center">
          <Link href="/todos" className="text-sm font-medium text-slate-600">
            모두 보기
          </Link>
          <Image
            src="/images/arrow_right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {data?.todos.length === 0 ? (
          <div className="flex justify-center items-center py-15">
            <span className="text-slate-500 text-sm font-normal">
              최근 등록한 할 일이 없어요
            </span>
          </div>
        ) : (
          data?.todos.map((todo) => (
            <div className="flex items-center gap-2" key={todo.id}>
              <Image
                src="/images/check.svg"
                alt="check"
                width={20}
                height={20}
              />
              <div>{todo.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
