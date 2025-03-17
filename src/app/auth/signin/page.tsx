"use client";

import Link from "next/link";
import Image from "next/image";
import { IAuthFormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useForm, RegisterOptions } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/common/Input";
import { useLogin } from "@/hooks/auth";

export default function Signin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IAuthFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const registerOptions: Partial<
    Record<keyof IAuthFormData, RegisterOptions<IAuthFormData>>
  > = {
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
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (formData: IAuthFormData) => {
    await login({ email: formData.email, password: formData.password });
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15">
      <Link href="/">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={270}
          height={89}
          className="mb-10"
        />
      </Link>
      <form
        className="flex flex-col justify-center gap-12 w-full max-w-[640px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-6">
          <Input
            label="이메일"
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요"
            errors={errors.email?.message}
            register={register}
            registerOptions={registerOptions}
          />

          <Input
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
            로그인하기
          </button>
          <div className="flex justify-center items-center gap-1">
            <span className="text-[15px] font-medium text-state-800">
              슬리드 투 두가 처음이신가요?
            </span>
            <Link
              href="/auth/signup"
              className="text-[15px] text-blue-600 font-medium underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
