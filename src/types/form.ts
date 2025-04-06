import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions as RHFRegisterOptions,
} from "react-hook-form";

export interface IAuthInputProps<T extends FieldValues> {
  label: string;
  type: string;
  name: Path<T>;
  placeholder: string;
  errors?: string;
  register: UseFormRegister<T>;
  registerOptions: Partial<Record<Path<T>, RHFRegisterOptions<T>>>;
}

export interface IMakeTodoForm {
  title: string;
  fileUrl: FileList | null;
  linkUrl: string | null;
  goalId: number | null;
}

export interface IEditTodoForm extends IMakeTodoForm {
  done: boolean;
}

export interface ICreateNoteForm {
  title: string;
  content: string;
  todoId: number;
  goalId: number;
  linkUrl: string | null;
}
