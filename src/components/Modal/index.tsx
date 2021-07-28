import React, { memo, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import "./style.css";

export interface ModalProps {
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = memo(({ onClose, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef(document.activeElement);

  const handleClose = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!containerRef?.current || !containerRef.current.contains(e.target as any)) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose, containerRef],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const activeElement = activeElementRef.current;

    window.addEventListener("keyup", handleKeyUp, false);

    return () => {
      window.removeEventListener("keyup", handleKeyUp, false);

      if (activeElement) {
        (activeElement as HTMLElement).focus();
      }
    };
  }, [handleKeyUp]);

  useLayoutEffect(() => {
    const getFirstFocusableChild = (children: HTMLCollection): Element | undefined => {
      for (let element of Object.values(children)) {
        if (["A", "BUTTON", "INPUT"].includes(element.nodeName)) {
          return element;
        }

        if (element.children) {
          const result = getFirstFocusableChild(element.children);

          if (result) {
            return result;
          }
        }
      }

      return undefined;
    };

    if (containerRef?.current?.children) {
      const firstChild = getFirstFocusableChild(containerRef.current.children);

      if (firstChild) {
        (firstChild as HTMLElement).focus();
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
