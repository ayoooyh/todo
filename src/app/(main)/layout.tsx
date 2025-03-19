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
        className={`flex-1 w-full bg-neutral-100 ${
          showSidebar ? "pl-[180px]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
