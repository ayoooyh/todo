export interface IGoals {
  next_cursor: null;
  total_count: number;
  goals: IGoal[];
}

export interface IGoal {
  created_at: string;
  updated_at: string;
  user_id: number;
  id: number;
  title: string;
}

export interface IPostGoalsRequest {
  title: string;
}

export interface IPostGoalResponse {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user_id: number;
}

export interface IGoalResponse {
  created_at: string;
  updated_at: string;
  user_id: number;
  id: number;
  title: string;
}
