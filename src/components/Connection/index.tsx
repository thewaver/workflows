import React, {
  memo,
  MouseEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export interface ConnectionProps {
  actionId?: Id;
  triggerId?: Id;
  highlighted?: boolean;
  version: number;
  onClick: (actionId: Id, triggerId: Id) => void;
}

export const Connection: React.FC<ConnectionProps> = memo(
  ({ actionId, triggerId, highlighted, onClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasStyle, setCanvasStyle] = useState<object>({});
    const [buttonStyle, setButtonStyle] = useState<object>({});

    const actionElement = useMemo(
      () => document.getElementById(`${EntityKind.Action}_${actionId}`),
      [actionId],
    );

    const triggerElement = useMemo(
      () => document.getElementById(`${EntityKind.Trigger}_${triggerId}`),
      [triggerId],
    );

    const actionRect = actionElement?.getBoundingClientRect() ?? defaultBoundingRect;
    const triggerRect = triggerElement?.getBoundingClientRect() ?? defaultBoundingRect;

    const { top: canvasParentTop, width: canvasWidth } =
      canvasRef?.current?.parentElement?.getBoundingClientRect() ?? defaultBoundingRect;

    const canvasTop = Math.min(actionRect.top, triggerRect.top);
    const canvasBottom = Math.max(actionRect.bottom, triggerRect.bottom);
    const canvasTopWithParentOffset = canvasTop - canvasParentTop;
    const canvasHeight = canvasBottom - canvasTop;

    const connectionTop =
      triggerRect.top < actionRect.top
        ? triggerRect.height / 2
        : canvasHeight - triggerRect.height / 2;
    const connectionBottom =
      triggerRect.top < actionRect.top
        ? canvasHeight - actionRect.height / 2
        : actionRect.height / 2;

    useLayoutEffect(() => {
      if (!canvasRef?.current) return;

      const context = canvasRef.current.getContext("2d");

      if (context) {
        setCanvasStyle({
          top: `${canvasTopWithParentOffset}px`,
          width: `${canvasWidth}px`,
        });

        setButtonStyle({
          top: `${canvasTopWithParentOffset + canvasHeight / 2}px`,
        });

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;

        context.beginPath();
        context.lineWidth = highlighted ? 2 : 1;
        context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(
          highlighted ? "--clr-secondary" : "--clr-text",
        );
        context.moveTo(0, connectionTop);
        context.lineTo(canvasWidth, connectionBottom);
        context.stroke();
      }
    }, [
      highlighted,
      canvasTopWithParentOffset,
      canvasWidth,
      canvasHeight,
      connectionTop,
      connectionBottom,
    ]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (actionId !== undefined && triggerId !== undefined) {
          onClick(actionId, triggerId);
        }
      },
      [actionId, triggerId, onClick],
    );

    if (actionId === undefined || triggerId === undefined) {
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
