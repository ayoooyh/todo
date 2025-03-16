"use client";

import Link from "next/link";
import { useState } from "react";
import { ISignUpRequest } from "@/types/auth";
import { signUp } from "@/apis/auth/auth";
import { useForm, RegisterOptions } from "react-hook-form";
import { AuthInput } from "@/components/auth/AuthInput";
import { IAuthFormData } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IAuthFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const registerOptions: Partial<
    Record<keyof IAuthFormData, RegisterOptions<IAuthFormData>>
  > = {
    name: { required: { value: true, message: "이름을 입력해주세요" } },
    email: {
      required: { value: true, message: "이메일을 입력해주세요" },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "올바른 이메일 형식이 아닙니다",
      },
    },
    password: {
      required: { value: true, message: "비밀번호를 입력해주세요" },
      minLength: { value: 8, message: "비밀번호는 최소 8자 이상이어야 합니다" },
    },
    confirmPassword: {
      required: { value: true, message: "비밀번호를 입력해주세요" },
      validate: (value: string) =>
        value === watch("password") || "비밀번호가 일치하지 않습니다",
    },
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (formData: IAuthFormData) => {
    try {
      const signUpData: ISignUpRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await signUp(signUpData);
      router.push("/auth/signin");
    } catch (error) {
      alert("회원가입에 실패했습니다.");
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div>
      <form
        className="flex flex-col justify-center gap-12 w-full max-w-[640px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-6">
          <AuthInput
            label="이름"
            type="text"
            name="name"
            placeholder="이름을 입력해주세요"
            errors={errors.name?.message}
            register={register}
            registerOptions={registerOptions}
          />
          <AuthInput
            label="이메일"
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            errors={errors.email?.message}
            register={register}
            registerOptions={registerOptions}
          />
          <AuthInput
            label="비밀번호"
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요"
            errors={errors.password?.message}
            register={register}
            registerOptions={registerOptions}
            showPassword={showPassword}
            onTogglePassword={handleShowPassword}
          />
          <AuthInput
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 입력해주세요"
            errors={errors.confirmPassword?.message}
            register={register}
            registerOptions={registerOptions}
            showPassword={showConfirmPassword}
            onTogglePassword={handleShowConfirmPassword}
          />
        </div>
        <div className="flex flex-col items-center gap-10">
          <button
            type="submit"
            className={`rounded-xl py-3 px-[277px] font-semibold text-base
              ${
                isValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-400 text-white cursor-not-allowed"
              }`}
          >
            회원가입하기
          </button>
          <div className="flex justify-center items-center gap-1">
            <span className="text-[15px] font-medium text-state-800">
              이미 회원이신가요?
            </span>
            <Link
              href="/auth/signin"
              className="text-[15px] text-blue-600 font-medium underline"
            >
              로그인
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
