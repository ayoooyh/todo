import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Link from "next/link";

export default function RecentTodos() {
  const { data, isLoading } = useGetTodosQuery({
    size: 5,
    sortOrder: "newest",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {data?.todos.map((todo) => (
          <div key={todo.id}>{todo.title}</div>
        ))}
      </div>

      <Link href="/todos">모든 할 일 보기</Link>
    </div>
  );
}
