import React, { ChangeEvent, memo, useCallback, useState } from "react";
import { Trigger } from "../../types";
import { Form } from "../Form";
import { LabelledInput } from "../LabelledInput";

export interface NewTriggerFormProps {
  onSave: (trigger: Trigger) => void;
  onCancel: () => void;
}

export const NewTriggerForm: React.FC<NewTriggerFormProps> = memo(({ onSave, onCancel }) => {
  const [newTrigger, setNewTrigger] = useState<Partial<Trigger>>({});

  const canSave = Boolean(newTrigger.id) && Boolean(newTrigger.name);

  const handleSave = useCallback(() => {
    if (canSave) {
      onSave(newTrigger as any);
    }
  }, [onSave, newTrigger, canSave]);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTrigger((oldTrigger) => ({ ...oldTrigger, id: e.target.value, name: e.target.value }));
  }, []);

  return (
    <Form title="new trigger" onSave={handleSave} onCancel={onCancel} canSave={canSave}>
      <LabelledInput label="name" onPressEnter={handleSave} onChange={handleNameChange} />
    </Form>
  );
});
