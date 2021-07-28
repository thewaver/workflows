import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  KeyboardEvent,
  memo,
  useCallback,
} from "react";
import "./style.css";

export interface LabelledInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
  onPressEnter: () => void;
}

export const LabelledInput: React.FC<LabelledInputProps> = memo(
  ({ label, onPressEnter, onKeyDown, ...props }) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          onPressEnter();
        } else if (onKeyDown) {
          onKeyDown(e);
        }
      },
      [onPressEnter, onKeyDown],
    );

    return (
      <div className="LabelledInput">
        <div className="Label">{label}</div>
        <input {...props} onKeyDown={handleKeyDown}></input>
      </div>
    );
  },
);
