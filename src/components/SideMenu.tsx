import User from "@/components/sideMenu/User";
import Goal from "@/components/sideMenu/Goal";
import Link from "next/link";
import Image from "next/image";

export default function SideMenu() {
  return (
    <div className="flex flex-col gap-4 bg-white h-screen ">
      <User />
      <div className="border-t border-slate-200" />
      <div className="flex justify-left items-center gap-2 px-6">
        <Image src="/images/home.svg" alt="dashBoard" width={24} height={24} />
        <Link href="/" className="text-lg font-medium text-slate-800">
          대시보드
        </Link>
      </div>
      <div className="border-t border-slate-200" />
      <Goal />
    </div>
  );
}
