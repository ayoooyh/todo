"use client";

import { usePathname } from "next/navigation";
import SideMenu from "@/components/sideMenu/SideMenu";

const noSidebarRoutes = ["/auth/signin", "/auth/signup"];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className="fixed inset-y-0 left-0">
          <SideMenu />
        </div>
      )}
      <div
        className={`flex-1 w-full ${
          pathname.includes("/createNote") ? "bg-white" : "bg-slate-100"
        } flex-col gap-3 py-6 px-20 ${showSidebar ? "pl-[180px]" : ""}`}
      >
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
