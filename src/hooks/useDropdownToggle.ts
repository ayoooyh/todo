import { useRef } from "react";
import useClickOutside from "./useClickOutside";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function useDropdownToggle<T extends HTMLElement>({
  isOpen,
  onClose,
}: Props) {
  const containerRef = useRef<T | null>(null);

  useClickOutside(containerRef, onClose, isOpen);

  return { containerRef };
}
