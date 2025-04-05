import { ITodo } from "./todo";
import { IGoal } from "./goal";
import { IUser } from "./user";

export interface INotes {
  next_cursor: number;
  total_count: number;
  notes: INote[];
}

export interface INote {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  link_url: string;
  user_id: number;
  goal_id: number;
  todo_id: number;
  todo: ITodo;
  goal: IGoal;
  user: IUser;
}
