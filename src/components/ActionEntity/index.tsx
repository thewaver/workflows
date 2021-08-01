import React from "react";
import { useSelector } from "react-redux";
import { selectActionById } from "../../rdx/workflow/selectors";
import { RootState } from "../../store";
import { Id } from "../../types";
import "./style.css";

export interface ActionEntityProps {
  id: Id;
}

export const ActionEntity: React.FC<ActionEntityProps> = ({ id }) => {
  const action = useSelector((state: RootState) => selectActionById(state, id));

  if (!action) {
    return null;
  }

  return <>{action.name}</>;
};
