import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import "./style.css";

export interface LabelledInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
}

export const LabelledInput: React.FC<LabelledInputProps> = ({ label, ...props }) => {
  return (
    <div className="LabelledInput">
      <div className="Label">{label}</div>
      <input {...props}></input>
    </div>
  );
};
