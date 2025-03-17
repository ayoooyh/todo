export interface IGoal {
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

export interface IPostGoalRequest {
  title: string;
}

export interface IPostGoalResponse {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user_id: number;
}

export interface IGetGoalIdResponse {
  created_at: string;
  updated_at: string;
  user_id: number;
  id: number;
  title: string;
}
