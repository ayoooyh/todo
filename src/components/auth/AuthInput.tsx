import Image from "next/image";
import eyeOff from "../../../public/images/auth/visibility-off.svg";
import eyeOn from "../../../public/images/auth/visibility-on.svg";
import { IAuthInputProps } from "@/types/auth/form";
import { FieldValues, Path } from "react-hook-form";

export function AuthInput<T extends FieldValues>({
  label,
  type,
  name,
  placeholder,
  errors,
  register,
  registerOptions,
  showPassword,
  onTogglePassword,
}: IAuthInputProps<T> & {
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isConfirmPasswordField?: boolean;
}) {
  const isPasswordField = type === "password" || type === "text";

  return (
    <div className="relative">
      <div className="flex flex-col gap-6">
        <label className="text-base font-medium text-state-800">{label}</label>
        <input
          {...register(name, registerOptions[name as Path<T>])}
          type={isPasswordField && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`flex py-3 px-6 bg-neutral-100 rounded-xl outline-none
            ${
              errors
                ? "border-2 border-red-700"
                : "border-2 border-transparent focus:border-blue-500"
            }`}
        />
        {errors && (
          <span className="text-sm font-normal text-red-700">{errors}</span>
        )}
      </div>

      {isPasswordField && onTogglePassword && (
        <div
          className="absolute right-6 top-[62px] cursor-pointer"
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
