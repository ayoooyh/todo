"use client";

import Image from "next/image";
import { useState, ReactNode } from "react";
import useDropdownToggle from "@/hooks/useDropdownToggle";

type Option = {
  label: string;
  value: string;
};

type DropDownProps = {
  options: Option[];
  onSelect: (value: string) => void;
  trigger?: ReactNode;
  optionClassName?: string;
};

export default function DropDown({
  options,
  onSelect,
  trigger,
  optionClassName,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef } = useDropdownToggle<HTMLDivElement>({
    isOpen,
    onClose: () => setIsOpen(false),
  });

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit" ref={containerRef}>
      <button
        className="bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger || (
          <Image
            src="/images/Meatballs_menu.svg"
            alt="menu"
            width={24}
            height={24}
          />
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg z-50">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-[81px] flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                optionClassName || ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
