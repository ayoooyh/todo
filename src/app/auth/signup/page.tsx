import SignUp from "@/components/auth/SignUp";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
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
      <SignUp />
    </div>
  );
}
