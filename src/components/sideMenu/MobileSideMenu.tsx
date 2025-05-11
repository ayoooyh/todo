import User from "@/components/sideMenu/User";
import Goal from "@/components/sideMenu/Goal";
import Link from "next/link";
import Image from "next/image";

interface MobileSideMenuProps {
  isFolded: boolean;
  toggleSideMenu: () => void;
  closeSideMenu: () => void;
}

export default function MobileSideMenu({
  isFolded,
  toggleSideMenu,
  closeSideMenu,
}: MobileSideMenuProps) {
  return (
    <>
      {!isFolded && (
        <div
          className="fixed inset-0 bg-black/80 z-10"
          onClick={toggleSideMenu}
        />
      )}

      <div
        className={`flex flex-col border border-slate-200 bg-white transition-all duration-300 z-20 fixed w-full ${
          isFolded ? "h-[48px] top-0" : "h-screen top-0"
        }`}
      >
        <div className="flex items-center justify-start px-4 py-3">
          <Image
            src="/images/hamburger.svg"
            alt="hamburger"
            width={24}
            height={24}
            onClick={toggleSideMenu}
            className="cursor-pointer"
          />
        </div>

        {!isFolded && (
          <div className="flex flex-col gap-4 animate-slideDown">
            <User />
            <div className="border-t border-slate-200" />
            <div className="flex justify-left items-center gap-2 px-6">
              <Image
                src="/images/home.svg"
                alt="dashBoard"
                width={24}
                height={24}
              />
              <Link
                href="/"
                className="text-lg font-medium text-slate-800"
                onClick={closeSideMenu}
              >
                대시보드
              </Link>
            </div>
            <div className="border-t border-slate-200" />
            <Goal onGoalClick={closeSideMenu} />
          </div>
        )}
      </div>
    </>
  );
}
