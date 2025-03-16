export interface ISignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  hashed_password: string;
  name: string;
}

export interface IAuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
