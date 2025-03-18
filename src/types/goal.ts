export interface IGoals {
  next_cursor: null;
  total_count: number;
  goals: [
    {
      created_at: string;
      updated_at: string;
      user_id: number;
      id: number;
      title: string;
    }
  ];
}

export interface IPostGoalsRequest {
  title: string;
}

export interface IPostGoalsResponse {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user_id: number;
}

export interface IGetGoalsByIdResponse {
  created_at: string;
  updated_at: string;
  user_id: number;
  id: number;
  title: string;
}
