import Image from "next/image";
import eyeOff from "../../../public/images/auth/visibility-off.svg";
import eyeOn from "../../../public/images/auth/visibility-on.svg";
import { IAuthInputProps } from "@/types/form";
import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

export interface BaseInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export interface FormInputProps<T extends FieldValues> extends BaseInputProps {
  name: Path<T>;
  register?: UseFormRegister<T>;
  registerOptions?: Record<Path<T>, RegisterOptions>;
}

export function Input<T extends FieldValues>({
  label,
  type,
  name,
  placeholder,
  errors,
  register,
  registerOptions,
  showPassword,
  onTogglePassword,
  className,
}: IAuthInputProps<T> & {
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isConfirmPasswordField?: boolean;
  className?: string;
}) {
  const isPasswordField = type === "password" || type === "text";

  return (
    <div className="relative">
      <div className="flex flex-col gap-3">
        <label className="text-base font-medium text-state-800">{label}</label>
        <input
          {...register(name, registerOptions[name as Path<T>])}
          type={isPasswordField && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`flex py-3 px-6 bg-slate-50  rounded-xl outline-none
            placeholder:text-slate-400
            ${
              errors
                ? "border-2 border-red-700"
                : "border-2 border-transparent focus:border-blue-500"
            } ${className}`}
        />
        {errors && (
          <span className="text-sm font-normal text-red-700">{errors}</span>
        )}
      </div>

      {isPasswordField && onTogglePassword && (
        <div
          className="absolute right-4 top-[50px] cursor-pointer"
          onClick={onTogglePassword}
        >
          <Image
            src={showPassword ? eyeOn : eyeOff}
            alt="password visibility toggle"
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
}
