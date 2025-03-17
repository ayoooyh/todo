"use client";

import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const token = getCookie("access_token");
  const refreshToken = getCookie("refresh_token");

  if (token && refreshToken) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
}
