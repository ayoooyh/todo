import { useParams } from "next/navigation";

export const useGoalId = () => {
  const params = useParams<{ id: string }>();
  const goalId = Number(params.id);

  return goalId;
};

export const useNoteId = () => {
  const params = useParams<{ id: string }>();
  const noteId = Number(params.id);

  return noteId;
};

export const useTodoId = () => {
  const params = useParams<{ id: string }>();
  const todoId = Number(params.id);

  return todoId;
};
