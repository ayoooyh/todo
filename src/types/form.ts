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
