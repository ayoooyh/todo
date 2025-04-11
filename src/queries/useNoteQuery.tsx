import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, getNote, postNote, updateNote } from "@/apis/notes";
import { INotes, INote, ICreateNote, IUpdateNote } from "@/types/note";

export const useGetNotesQuery = ({
  goal_id,
  cursor,
  size = 20,
}: {
  goal_id: number;
  cursor?: string;
  size?: number;
}) => {
  return useQuery<INotes>({
    queryKey: ["notes", goal_id, size, cursor],
    queryFn: async () => {
      const response = await getNotes({ goal_id, size, cursor });
      return response;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetNoteQuery = ({ note_id }: { note_id: number }) => {
  return useQuery<INote>({
    queryKey: ["note", note_id],
    queryFn: async () => {
      const response = await getNote({ note_id });
      return response;
    },
    enabled: !!note_id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteData }: { noteData: ICreateNote }) => {
      const response = await postNote(noteData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      note_id,
      noteData,
    }: {
      note_id: number;
      noteData: IUpdateNote;
    }) => {
      const response = await updateNote(note_id, noteData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
