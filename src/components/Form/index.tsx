import React, { memo } from "react";
import "./style.css";

export interface FormProps {
  title?: string;
  canSave?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  onSave: () => void;
  onCancel: () => void;
}

export const Form: React.FC<FormProps> = memo(
  ({ title, canSave, saveLabel, cancelLabel, onSave, onCancel, children }) => {
    return (
      <div className="Form">
        {title ? <div className="Title">{title}</div> : null}
        {children ? <div className="Content">{children}</div> : null}
        <div className="Buttons">
          <button className="Cancel" type="button" onClick={onCancel}>
            {cancelLabel ?? "Cancel"}
          </button>
          <button className="Save" type="button" onClick={onSave} disabled={!canSave}>
            {saveLabel ?? "Save"}
          </button>
        </div>
      </div>
    );
  },
);
