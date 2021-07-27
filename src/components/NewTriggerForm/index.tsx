import React, { ChangeEvent, useCallback, useState } from "react";
import { Trigger } from "../../types";
import { Form } from "../Form";
import { LabelledInput } from "../LabelledInput";
import "./style.css";

export interface NewTriggerFormProps {
  onSave: (trigger: Trigger) => void;
  onCancel: () => void;
}

export const NewTriggerForm: React.FC<NewTriggerFormProps> = ({ onSave, onCancel }) => {
  const [newTrigger, setNewTrigger] = useState<Partial<Trigger>>({});

  const canSave = Boolean(newTrigger.id) && Boolean(newTrigger.name);

  const handleSave = useCallback(() => {
    onSave(newTrigger as any);
  }, [onSave, newTrigger]);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTrigger((oldTrigger) => ({ ...oldTrigger, id: e.target.value, name: e.target.value }));
  }, []);

  return (
    <Form title="new trigger" onSave={handleSave} onCancel={onCancel} canSave={canSave}>
      <LabelledInput label="name" onChange={handleNameChange} />
    </Form>
  );
};
