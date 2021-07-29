import React, { memo, MouseEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { EntityKind, Id } from "../../types";
import "./style.css";

export interface ConnectionDisplayProps {
  actionId?: Id;
  triggerId?: Id;
  highlighted?: boolean;
  onClick: (actionId: Id, triggerId: Id) => void;
}

export const ConnectionDisplay: React.FC<ConnectionDisplayProps> = memo(
  ({ actionId, triggerId, highlighted, onClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasStyle, setCanvasStyle] = useState<object>({});
    const [buttonStyle, setButtonStyle] = useState<object>({});

    useLayoutEffect(() => {
      if (!canvasRef?.current) return;

      const context = canvasRef.current.getContext("2d");
      const actionElement = document.getElementById(`${EntityKind.Action}_${actionId}`);
      const triggerElement = document.getElementById(`${EntityKind.Trigger}_${triggerId}`);

      if (context) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const canvasParentRect = canvasRef.current.parentElement?.getBoundingClientRect();

        context.clearRect(0, 0, canvasRect.width, canvasRect.height);

        if (actionElement && triggerElement) {
          const actionRect = actionElement?.getBoundingClientRect();
          const triggerRect = triggerElement?.getBoundingClientRect();
          const canvasTop = Math.min(actionRect.top, triggerRect.top);
          const canvasBottom = Math.max(actionRect.bottom, triggerRect.bottom);

          canvasRef.current.width =
            (canvasParentRect?.width ?? 0) +
            parseInt(getComputedStyle(canvasRef.current)?.left ?? 0) * -2;
          canvasRef.current.height = canvasBottom - canvasTop;

          setCanvasStyle({
            top: `${canvasTop - (canvasParentRect?.top ?? 0)}px`,
            width: `${canvasRef.current.width}px`,
          });

          setButtonStyle({
            top: `${canvasTop - (canvasParentRect?.top ?? 0) + canvasRef.current.height / 2}px`,
          });

          const X1 = 0;
          const Y1 =
            triggerRect.top < actionRect.top
              ? triggerRect.height / 2
              : canvasRef.current.height - triggerRect.height / 2;
          const X2 = canvasRef.current.width;
          const Y2 =
            triggerRect.top < actionRect.top
              ? canvasRef.current.height - actionRect.height / 2
              : actionRect.height / 2;

          // console.log(X1, Y1, X2, Y2);

          context.beginPath();
          context.lineWidth = highlighted ? 4 : 2;
          context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(
            highlighted ? "--clr-secondary" : "--clr-text",
          );
          context.moveTo(X1, Y1);
          context.lineTo(X2, Y2);
          context.stroke();
        }
      }
    }, [actionId, triggerId, highlighted]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (actionId !== undefined && triggerId !== undefined) {
          onClick(actionId, triggerId);
        }
      },
      [actionId, triggerId, onClick],
    );

    return (
      <div className="ConnectionDisplay">
        <canvas className="Canvas" ref={canvasRef} style={canvasStyle} />
        {actionId !== undefined && triggerId !== undefined ? (
          <button className="Inverted Iconic" style={buttonStyle} onClick={handleClick}>
            <i className="fas fa-link" />
          </button>
        ) : null}
      </div>
    );
  },
);
