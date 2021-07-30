import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import "./style.css";

export interface ConnectionDisplayProps {
  onChangeWidth: (newWidth: number) => void;
}

export const ConnectionDisplay: React.FC<ConnectionDisplayProps> = memo(
  ({ onChangeWidth, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);

    const handleWindowResize = useCallback(() => {
      const newWidth = ref?.current?.getBoundingClientRect().width ?? 0;

      if (width !== newWidth) {
        onChangeWidth(newWidth);
      }

      setWidth(width);
    }, [onChangeWidth, width]);

    useEffect(() => {
      window.addEventListener("resize", handleWindowResize, false);

      return () => {
        window.removeEventListener("resize", handleWindowResize, false);
      };
    }, [handleWindowResize]);

    return (
      <div className="ConnectionDisplay" ref={ref}>
        {children}
      </div>
    );
  },
);
