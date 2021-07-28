import React, { ChangeEvent, memo, useCallback, useState } from "react";
import { Action } from "../../types";
import { Form } from "../Form";
import { LabelledInput } from "../LabelledInput";

export interface NewActionFormProps {
  onSave: (action: Action) => void;
  onCancel: () => void;
}

export const NewActionForm: React.FC<NewActionFormProps> = memo(({ onSave, onCancel }) => {
  const [newAction, setNewAction] = useState<Partial<Action>>({});

  const canSave = Boolean(newAction.id) && Boolean(newAction.name);

  const handleSave = useCallback(() => {
    if (canSave) {
      onSave(newAction as any);
    }
  }, [onSave, newAction, canSave]);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewAction((oldAction) => ({ ...oldAction, id: e.target.value, name: e.target.value }));
  }, []);

  return (
    <Form title="new action" onSave={handleSave} onCancel={onCancel} canSave={canSave}>
      <LabelledInput label="name" onPressEnter={handleSave} onChange={handleNameChange} />
    </Form>
  );
});
