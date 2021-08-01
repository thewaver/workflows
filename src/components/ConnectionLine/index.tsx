import React, { memo, MouseEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { EntityKind, Id } from "../../types";
import "./style.css";

const defaultBoundingRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 0,
  height: 0,
};

export interface ConnectionLineProps {
  actionId?: Id;
  triggerId?: Id;
  highlighted?: boolean;
  version: number;
  onClick: (actionId: Id, triggerId: Id) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = memo(
  ({ actionId, triggerId, highlighted, onClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasStyle, setCanvasStyle] = useState<object>({});
    const [buttonStyle, setButtonStyle] = useState<object>({});

    const actionElement = document.getElementById(`${EntityKind.Action}_${actionId}`);
    const triggerElement = document.getElementById(`${EntityKind.Trigger}_${triggerId}`);
    const actionRect = actionElement?.getBoundingClientRect() ?? defaultBoundingRect;
    const triggerRect = triggerElement?.getBoundingClientRect() ?? defaultBoundingRect;

    const { top: canvasParentTop, width: canvasWidth } =
      canvasRef?.current?.parentElement?.getBoundingClientRect() ?? defaultBoundingRect;

    const canvasTop = Math.min(actionRect.top, triggerRect.top) - canvasParentTop;
    const canvasBottom = Math.max(actionRect.bottom, triggerRect.bottom) - canvasParentTop;
    const canvasHeight = canvasBottom - canvasTop;

    const connectionTriggerCenter =
      triggerRect.top - (canvasTop + canvasParentTop) + triggerRect.height / 2;
    const connectionActionCenter =
      actionRect.top - (canvasTop + canvasParentTop) + actionRect.height / 2;

    useLayoutEffect(() => {
      if (!canvasRef?.current) return;

      const context = canvasRef.current.getContext("2d");

      if (context) {
        setCanvasStyle({
          top: `${canvasTop}px`,
          width: `${canvasWidth}px`,
        });

        setButtonStyle({
          top: `${canvasTop + canvasHeight / 2}px`,
        });

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;

        context.beginPath();
        context.lineWidth = highlighted ? 2 : 1;
        context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(
          highlighted ? "--clr-secondary" : "--clr-text",
        );
        context.moveTo(0, connectionTriggerCenter);
        context.lineTo(canvasWidth, connectionActionCenter);
        context.stroke();
      }
    }, [
      highlighted,
      canvasTop,
      canvasWidth,
      canvasHeight,
      connectionTriggerCenter,
      connectionActionCenter,
    ]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (actionId !== undefined && triggerId !== undefined) {
          onClick(actionId, triggerId);
        }
      },
      [actionId, triggerId, onClick],
    );

    if (
      actionId === undefined ||
      triggerId === undefined ||
      actionElement === null ||
      triggerElement === null
    ) {
      return null;
    }

    return (
      <>
        <canvas className="Connection" ref={canvasRef} style={canvasStyle} />
        <button className="Inverted Iconic" style={buttonStyle} onClick={handleClick}>
          <i className={highlighted ? "fas fa-link" : "fas fa-unlink"} />
        </button>
      </>
    );
  },
);
