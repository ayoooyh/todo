import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotes,
  getNote,
  postNote,
  updateNote,
  deleteNote,
} from "@/apis/notes";
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
    onSuccess: (data, variables) => {
      // 노트 업데이트 후 업데이트된 노트를 가져오기 위해 개별 노트 쿼리 무효화 처리
      queryClient.invalidateQueries({
        queryKey: ["note", variables.note_id, data],
      });

      // 노트 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ note_id }: { note_id: number }) => {
      const response = await deleteNote(note_id);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["note", variables.note_id, data],
      });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
