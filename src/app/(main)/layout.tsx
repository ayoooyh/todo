"use client";

import { usePathname } from "next/navigation";
import SideMenu from "@/components/sideMenu/SideMenu";
import { useEffect, useState } from "react";

const noSidebarRoutes = ["/auth/signin", "/auth/signup"];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !noSidebarRoutes.includes(pathname);

  // 모바일 여부를 state로 관리
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    setIsMobileScreen(window.innerWidth < 768);
  }, []);

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className="fixed inset-y-0 left-0 z-50">
          <SideMenu />
        </div>
      )}
      <div
        className={`flex-1 h-screen overflow-y-auto ${
          pathname.includes("/createNote") || pathname.includes("/editNote")
            ? "bg-white"
            : "bg-slate-100"
        } 
        flex-col gap-3 py-6 px-2
        ${showSidebar ? "md:pl-13 xl:pl-[200px]" : "sm:px-4"}`}
      >
        <div
          className={`max-w-[1200px] mx-auto ${isMobileScreen ? "pt-4" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
