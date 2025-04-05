import { useGetTodosQuery } from "@/queries/useTodoQuery";
import Link from "next/link";
import { useGetNotesQuery } from "@/queries/useNoteQuery";

export default function RecentTodos() {
  const { data, isLoading } = useGetTodosQuery({
    size: 5,
    sortOrder: "newest",
  });

  const { data: notes, isLoading: isNotesLoading } = useGetNotesQuery({
    goal_id: 9,
    size: 20,
    cursor: undefined,
  });

  if (isLoading || isNotesLoading) {
    return <div>Loading...</div>;
  }

  console.log(notes);

  return (
    <div className="flex flex-col gap-4">
      <div>
        {data?.todos.map((todo) => (
          <div key={todo.id}>{todo.title}</div>
        ))}
      </div>

      <Link href="/todos">모든 할 일 보기</Link>

      <div>
        {notes?.notes.map((note) => (
          <div key={note.id}>
            <div>{note.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
