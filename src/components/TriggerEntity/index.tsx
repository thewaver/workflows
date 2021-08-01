import React from "react";
import { useSelector } from "react-redux";
import { selectTriggerById } from "../../rdx/workflow/selectors";
import { RootState } from "../../store";
import { Id } from "../../types";
import "./style.css";

export interface TriggerEntityProps {
  id: Id;
}

export const TriggerEntity: React.FC<TriggerEntityProps> = ({ id }) => {
  const trigger = useSelector((state: RootState) => selectTriggerById(state, id));

  if (!trigger) {
    return null;
  }

  return <>{trigger.name}</>;
};
