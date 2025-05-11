"use client";

import User from "@/components/sideMenu/User";
import Goal from "@/components/sideMenu/Goal";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import MobileSideMenu from "@/components/sideMenu/MobileSideMenu";

export default function SideMenu() {
  const [isFolded, setIsFolded] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isDesktopScreen, setIsDesktopScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const BREAKPOINTS = {
        mobile: 744,
        tablet: 1024,
        desktop: 1280,
      };
      const currentWidth = window.innerWidth;
      setIsMobileScreen(currentWidth < BREAKPOINTS.mobile);
      setIsDesktopScreen(currentWidth < BREAKPOINTS.desktop);

      // 화면 크기에 따라 사이드메뉴 상태 설정
      if (currentWidth < BREAKPOINTS.desktop) {
        setIsFolded(true); // 태블릿/데스크톱 미만에서는 접힌 상태로 시작
      } else {
        setIsFolded(false); // PC 화면에서는 항상 펼쳐진 상태
      }
    };

    // 초기 로드 시 화면 크기 확인
    checkScreenSize();

    // 화면 크기 변경 시 이벤트 리스너 추가
    window.addEventListener("resize", checkScreenSize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 사이드 메뉴 토글 함수
  const toggleSideMenu = () => {
    setIsFolded(!isFolded);
  };

  // 메뉴 닫기 함수 추가
  const closeSideMenu = () => {
    setIsFolded(true);
  };

  // 모바일 화면일 경우 모바일용 사이드 메뉴 컴포넌트 렌더링
  if (isMobileScreen) {
    return (
      <MobileSideMenu
        isFolded={isFolded}
        toggleSideMenu={toggleSideMenu}
        closeSideMenu={closeSideMenu}
      />
    );
  }

  const getSideMenuStyle = () => {
    if (isDesktopScreen) {
      return isFolded ? "w-[60px] h-screen left-0" : "w-[240px] h-screen";
    } else {
      return isFolded ? "w-[60px] h-screen" : "max-w-[280px] h-screen";
    }
  };

  return (
    <>
      {isDesktopScreen && !isFolded && (
        <div
          className="fixed inset-0 bg-black/80 z-10"
          onClick={toggleSideMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`flex flex-col border border-slate-200 bg-white transition-all duration-300 overflow-y-auto z-20 fixed ${getSideMenuStyle()}`}
      >
        <div
          className={`flex items-center px-4 py-4 ${
            isFolded ? "flex-col gap-4" : "justify-between w-full"
          }`}
        >
          {isFolded ? (
            <>
              <Link href="/">
                <Image
                  src="/images/mini-logo.svg"
                  alt="logo"
                  width={32}
                  height={32}
                />
              </Link>
              {isDesktopScreen && (
                <Image
                  src="/images/expand.svg"
                  alt="expand"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={toggleSideMenu}
                />
              )}
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={isDesktopScreen ? closeSideMenu : undefined}
              >
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={106}
                  height={35}
                />
              </Link>

              {isDesktopScreen && (
                <Image
                  src="/images/fold.svg"
                  alt="fold"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={toggleSideMenu}
                />
              )}
            </>
          )}
        </div>

        {!isFolded && (
          <div className="flex flex-col gap-4">
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
                onClick={isDesktopScreen ? closeSideMenu : undefined}
              >
                대시보드
              </Link>
            </div>
            <div className="border-t border-slate-200" />
            <Goal onGoalClick={isDesktopScreen ? closeSideMenu : undefined} />
          </div>
        )}
      </div>
    </>
  );
}
