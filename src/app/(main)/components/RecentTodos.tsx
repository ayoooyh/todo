import { useGetTodosQuery } from "@/queries/useTodoQuery";

export default function RecentTodos() {
  const { data, isLoading } = useGetTodosQuery({
    size: 5,
    sortOrder: "newest",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data?.todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </>
  );
}
