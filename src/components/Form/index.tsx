import React, { memo } from "react";
import "./style.css";

export interface FormProps {
  title?: string;
  canSave?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const Form: React.FC<FormProps> = memo(({ title, canSave, onSave, onCancel, children }) => {
  return (
    <div className="Form">
      {title ? <div className="Title">{title}</div> : null}
      {children ? <div className="Content">{children}</div> : null}
      <div className="Buttons">
        <button className="Cancel" type="button" onClick={onCancel}>
          {"Cancel"}
        </button>
        <button className="Save" type="button" onClick={onSave} disabled={!canSave}>
          {"Save"}
        </button>
      </div>
    </div>
  );
});
