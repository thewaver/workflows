import React, { DetailedHTMLProps, InputHTMLAttributes, memo } from "react";
import "./style.css";

export interface LabelledInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
}

export const LabelledInput: React.FC<LabelledInputProps> = memo(({ label, ...props }) => {
  return (
    <div className="LabelledInput">
      <div className="Label">{label}</div>
      <input {...props}></input>
    </div>
  );
});
