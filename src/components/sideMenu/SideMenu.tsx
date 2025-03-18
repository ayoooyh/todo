import User from "@/components/sideMenu/User";
import Goal from "@/components/sideMenu/Goal";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SideMenu() {
  const [isFolded, setIsFolded] = useState(false);

  return (
    // TODO: fold 시 에니메이션 효과 추후 추가 필요
    <div
      className={`flex flex-col bg-white transition-all duration-300 ${
        isFolded ? "w-[60px]" : "max-w-[280px]"
      }`}
    >
      <div
        className={`flex items-center px-4 py-4 h-screen ${
          isFolded ? "flex-col gap-4" : "justify-between w-full"
        }`}
      >
        {isFolded ? (
          <Image
            src="/images/mini-logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
        ) : (
          <Image src="/images/logo.svg" alt="logo" width={106} height={35} />
        )}
        <Image
          src={isFolded ? "/images/expand.svg" : "/images/fold.svg"}
          alt={isFolded ? "expand" : "fold"}
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => setIsFolded(!isFolded)}
        />
      </div>

      {!isFolded && (
        <div className="flex flex-col gap-4 ">
          <User />
          <div className="border-t border-slate-200" />
          <div className="flex justify-left items-center gap-2 px-6">
            <Image
              src="/images/home.svg"
              alt="dashBoard"
              width={24}
              height={24}
            />
            <Link href="/" className="text-lg font-medium text-slate-800">
              대시보드
            </Link>
          </div>
          <div className="border-t border-slate-200" />
          <Goal />
        </div>
      )}
    </div>
  );
}
