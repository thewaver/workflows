import React, { MouseEvent, useCallback, useEffect, useRef } from "react";
import "./style.css";

export interface ModalProps {
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
    window.addEventListener("keyup", handleKeyUp, false);

    return () => {
      window.removeEventListener("keyup", handleKeyUp, false);
    };
  }, [handleKeyUp]);

  return (
    <div className="ModalWrapper" onClick={handleClose}>
      <div className="ModalContainer" ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
