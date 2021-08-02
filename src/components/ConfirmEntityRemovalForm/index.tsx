import React, { memo } from "react";
import { EntityKind } from "../../types";
import { Form } from "../Form";

export interface ConfirmEntityRemovalFormProps {
  entityKind: EntityKind;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmEntityRemovalForm: React.FC<ConfirmEntityRemovalFormProps> = memo(
  ({ entityKind, children, onConfirm, onCancel }) => {
    return (
      <Form
        title={`remove ${entityKind}?`}
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
