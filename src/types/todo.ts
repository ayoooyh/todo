import { INote } from "./note";

export interface ITodos {
  next_cursor: null;
  total_count: number;
  todos: ITodo[];
}

export interface ITodo {
  id: number;
  title: string;
  link_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  done: boolean;
  file_url: string;
  goal_id: number;
  note_id: number;
  note: INote;
}

export interface ICreateTodo {
  title: string;
  fileUrl: string | null;
  linkUrl: string | null;
  goalId: number | null;
}

export interface IMakeTodoResponse {
  id: number;
  title: string;
  link_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  done: boolean;
  file_url: string;
  goal_id: number;
}

export interface IProgressTodoResponse {
  progress: number;
}

export interface ICreateTodoResponse {
  id: number;
  title: string;
  link_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  done: boolean;
  file_url: string;
  goal_id: number;
}

export interface IUploadFileResponse {
  url: string;
}

export interface IUpdateTodo extends ICreateTodo {
  done: boolean;
}
