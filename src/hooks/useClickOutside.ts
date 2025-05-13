import { useEffect } from "react";

export default function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  when: boolean = true
) {
  useEffect(() => {
    if (!when) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, when]);
}
