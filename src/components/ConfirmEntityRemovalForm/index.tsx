import React, { memo } from "react";
import { Form } from "../Form";

export interface ConfirmEntityRemovalFormProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmEntityRemovalForm: React.FC<ConfirmEntityRemovalFormProps> = memo(
  ({ children, onConfirm, onCancel }) => {
    return (
      <Form
        title="remove entity?"
        saveLabel="Yes"
        cancelLabel="no"
        onSave={onConfirm}
        onCancel={onCancel}
        canSave
      >
        {children}
      </Form>
    );
  },
);
