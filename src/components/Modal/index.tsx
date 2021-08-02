import React, { memo, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { getFocusableChildren } from "./utils";
import "./style.css";

export interface ModalProps {
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = memo(({ onClose, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef(document.activeElement);

  const handleClose = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!containerRef?.current || !containerRef.current.contains(e.target as HTMLElement)) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose, containerRef],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey) {
        return;
      }

      if (e.keyCode === 27) {
        e.preventDefault();
        onClose();
      } else if (e.keyCode === 9 && containerRef?.current) {
        const focusableElements = getFocusableChildren(containerRef?.current);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && e.target === firstFocusable) {
          e.preventDefault();
          (lastFocusable as HTMLElement).focus();
        } else if (!e.shiftKey && e.target === lastFocusable) {
          e.preventDefault();
          (firstFocusable as HTMLElement).focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    const activeElement = activeElementRef.current;

    window.addEventListener("keydown", handleKeyPress, false);

    return () => {
      window.removeEventListener("keydown", handleKeyPress, false);

      if (activeElement) {
        (activeElement as HTMLElement).focus();
      }
    };
  }, [handleKeyPress]);

  useLayoutEffect(() => {
    if (containerRef?.current) {
      const firstFocusableElement = getFocusableChildren(containerRef?.current)[0];

      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement).focus();
      }
    }
  }, []);

  return (
    <div className="ModalWrapper" onClick={handleClose}>
      <div className="ModalContainer" ref={containerRef} role="dialog" aria-modal={true}>
        {children}
      </div>
    </div>
  );
});
